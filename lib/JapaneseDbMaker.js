const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const console = require('console');
const readline = require('readline');
const JMdictUtil = require('./JMdictUtil');
const JMnedictUtil = require('./JMnedictUtil');

class JapaneseDbMaker {
  /**
   * @param {Object<string, string>} sources
   * @param {string} targetPath
   * @returns {Promise}
   */
  static buildSqlite(sources, targetPath) {
    // Create entry arrays
    const jmdict = new JMdictUtil(sources.jmdict);
    const jmdictEntries = jmdict.getJMdictEntries();
    const jmnedict = new JMnedictUtil(sources.jmnedict);
    const jmnedictEntries = jmnedict.getJMnedictEntries();

    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(targetPath)) throw Error(`DB File ${targetPath} already exists, please delete or change the path.`);

        const db = new sqlite3.Database(targetPath);

        db.serialize(() => {
          db.run('CREATE TABLE jmdict_jsons (`ent_seq` INTEGER, `json` TEXT, PRIMARY KEY(`ent_seq`))');
          db.run('CREATE TABLE jmdict_entities (`name` TEXT, `value` TEXT, PRIMARY KEY(`name`))');
          db.run('CREATE TABLE jmnedict_jsons (`ent_seq` INTEGER, `json` TEXT, PRIMARY KEY(`ent_seq`))');
          db.run('CREATE TABLE jmnedict_entities (`name` TEXT, `value` TEXT, PRIMARY KEY(`name`))');
          db.run('CREATE TABLE dict_index (`ent_seq` INTEGER, `kanji` TEXT, `reading` TEXT, `pri_point` INTEGER, `sense` INTEGER, PRIMARY KEY(`ent_seq`, `kanji`,`reading`))');
        });

        db.serialize(() => {
          db.run('BEGIN');

          // TABLE: jmdict_jsons

          jmdictEntries.forEach((jmdictEntry) => {
            const entSeq = jmdictEntry.ent_seq[0];

            db.run('INSERT INTO jmdict_jsons VALUES (?, ?)',
              entSeq,
              JSON.stringify(jmdictEntry, null, 0));

            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0, null);
            process.stdout.write(`jmdict_jsons table : ${jmdictEntry.ent_seq[0]}`);
          });

          // TABLE: dict_index

          jmdictEntries.forEach((jmdictEntry) => {
            const entSeq = jmdictEntry.ent_seq[0];
            // console.log(`==${entSeq}==`);

            /** @type {[number, string, string, number, string][]}
             *         ent_seq, kanji, reading, pri_point, sense */
            const vocabRows = [];

            // Calculate reading element priority points
            /** @type {Object.<string, number>} */
            const rElePriPoints = {};
            jmdictEntry.r_ele.forEach((rEle) => {
              const rElePriPoint = JMdictUtil.priCalc(rEle.re_pri);

              rElePriPoints[rEle.reb[0]] = rElePriPoint;
            });

            // If vocab has kanji element
            if (jmdictEntry.k_ele) {
              jmdictEntry.k_ele.forEach((kEle) => {
                const keb = kEle.keb[0];
                const kElePriPoint = JMdictUtil.priCalc(kEle.ke_pri);

                jmdictEntry.r_ele.forEach((rEle) => {
                  /** @type {string} kanji reading */
                  const reb = rEle.reb[0];

                  /** @type {number} */
                  const priPoint = kElePriPoint > rElePriPoints[reb]
                    ? kElePriPoint : rElePriPoints[reb];

                  // If the reading has no kanji tag
                  if (Object.hasOwnProperty.call(rEle, 're_nokanji')) {
                    vocabRows.push([entSeq, null, reb, priPoint, '']);

                    // If the reading has reading restriction to the kanji
                  } else if (Object.hasOwnProperty.call(rEle, 're_restr')) {
                    if (rEle.re_restr.indexOf(keb) !== -1) {
                      vocabRows.push([entSeq, keb, reb, priPoint, '']);
                    }

                    // If the reading doesn't have tags above,
                    // it applies to all kanji
                  } else {
                    vocabRows.push([entSeq, keb, reb, priPoint, '']);
                  }
                });
              });
            }

            // If the vocab doesn't have kanji element
            if (!jmdictEntry.k_ele) {
              jmdictEntry.r_ele.forEach((rEle) => {
                vocabRows.push([entSeq, null, rEle.reb[0], rElePriPoints[rEle.reb[0]], '']);
              });
            }

            // Add glossaries
            jmdictEntry.sense.forEach((sense) => {
              let glosses = sense.gloss.reduce((ax, gloss) => `${ax}; ${gloss.$t}`, '');
              glosses = glosses.slice(2);
              glosses += '; ';

              const stagk = sense.stagk ? sense.stagk[0] : null;
              const stagr = sense.stagr ? sense.stagr[0] : null;

              vocabRows.forEach((vocabRow) => {
                if (stagk === null && stagr === null) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                } else if (stagk !== null && vocabRow[1] === stagk) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                } else if (stagr !== null && vocabRow[2] === stagr) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                }
              });
              // console.log(stagk, stagr, glosses);
            });

            // Put in db
            vocabRows.forEach((row) => {
              db.run('INSERT INTO dict_index VALUES (?, ?, ?, ?, ?)', row);

              readline.clearLine(process.stdout, 0);
              readline.cursorTo(process.stdout, 0, null);
              process.stdout.write(`dict_index table : ${row[0]} ${row[1]} ${row[2]}`);
            });
          });

          // TABLE: jmdict_entities

          Object.keys(jmdict.entities).forEach((key) => {
            db.run('INSERT INTO jmdict_entities VALUES (?, ?)',
              key,
              jmdict.entities[key]);
          });

          db.run('END');

          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0, null);
          process.stdout.write('Inserting data to SQLite file...\n');
        });

        db.serialize(() => {
          db.run('BEGIN');

          // TABLE: jmnedict_jsons

          jmnedictEntries.forEach((jmnedictEntry) => {
            const entSeq = jmnedictEntry.ent_seq[0];

            db.run('INSERT INTO jmnedict_jsons VALUES (?, ?)',
              entSeq,
              JSON.stringify(jmnedictEntry, null, 0));

            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0, null);
            process.stdout.write(`jmnedict_jsons table : ${jmnedictEntry.ent_seq[0]}`);
          });

          // TABLE: dict_index

          jmnedictEntries.forEach((jmnedictEntry) => {
            const entSeq = jmnedictEntry.ent_seq[0];
            // console.log(`==${entSeq}==`);

            /** @type {[number, string, string, string][]}
             *         ent_seq, kanji, reading, trans */
            const vocabRows = [];

            // If vocab has kanji element
            if (jmnedictEntry.k_ele) {
              jmnedictEntry.k_ele.forEach((kEle) => {
                const keb = kEle.keb[0];

                jmnedictEntry.r_ele.forEach((rEle) => {
                  /** @type {string} kanji reading */
                  const reb = rEle.reb[0];

                  vocabRows.push([entSeq, keb, reb, '']);
                });
              });
            }

            // If the vocab doesn't have kanji element
            if (!jmnedictEntry.k_ele) {
              jmnedictEntry.r_ele.forEach((rEle) => {
                vocabRows.push([entSeq, null, rEle.reb[0], '']);
              });
            }

            // Add glossaries
            jmnedictEntry.trans.forEach((trans) => {
              let glosses = sense.gloss.reduce((ax, gloss) => `${ax}; ${gloss.$t}`, '');
              glosses = glosses.slice(2);
              glosses += '; ';

              const stagk = sense.stagk ? sense.stagk[0] : null;
              const stagr = sense.stagr ? sense.stagr[0] : null;

              vocabRows.forEach((vocabRow) => {
                if (stagk === null && stagr === null) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                } else if (stagk !== null && vocabRow[1] === stagk) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                } else if (stagr !== null && vocabRow[2] === stagr) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                }
              });
              // console.log(stagk, stagr, glosses);
            });

            // Put in db
            vocabRows.forEach((row) => {
              db.run('INSERT INTO dict_index VALUES (?, ?, ?, ?, ?)', row);

              readline.clearLine(process.stdout, 0);
              readline.cursorTo(process.stdout, 0, null);
              process.stdout.write(`dict_index table : ${row[0]} ${row[1]} ${row[2]}`);
            });
          });

          // TABLE: jmnedict_entities

          Object.keys(jmnedict.entities).forEach((key) => {
            db.run('INSERT INTO jmnedict_entities VALUES (?, ?)',
              key,
              jmnedict.entities[key]);
          });

          db.run('END');
        });

        db.close(() => {
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
module.exports = JapaneseDbMaker;
