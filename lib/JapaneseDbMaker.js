const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const console = require('console');
const readline = require('readline');
const JMdictUtil = require('./JMdictUtil');

class JapaneseDbMaker {
  /**
   * @param {Object<string, string>} sources
   * @param {string} targetPath
   * @returns {Promise}
   */
  static buildSqlite(sources, targetPath) {
    // Set directories of the source and target

    const jmdictPath = sources.jmdict;

    // Create entry arrays
    const jmdict = new JMdictUtil(jmdictPath);
    const jmdictEntries = jmdict.getJMdictEntries();

    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(targetPath)) throw Error(`DB File ${targetPath} already exists, please delete or change the path.`);

        const db = new sqlite3.Database(targetPath);

        db.serialize(() => {
          db.run('CREATE TABLE jsons (`ent_seq` INTEGER, `json` TEXT, PRIMARY KEY(`ent_seq`))');
          db.run('CREATE TABLE vocabs (`ent_seq` INTEGER, `kanji` TEXT, `reading` TEXT, `pri_point` INTEGER, `sense` INTEGER, PRIMARY KEY(`ent_seq`, `kanji`,`reading`))');
          db.run('CREATE TABLE entities (`name` TEXT, `value` TEXT, PRIMARY KEY(`name`))');
        });

        db.serialize(() => {
          // TABLE: jsons
          db.run('BEGIN');

          jmdictEntries.forEach((jmdictEntry) => {
            const entSeq = jmdictEntry.ent_seq[0];

            db.run('INSERT INTO jsons VALUES (?, ?)',
              entSeq,
              JSON.stringify(jmdictEntry, null, 0));

            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0, null);
            process.stdout.write(`jsons table : ${jmdictEntry.ent_seq[0]}`);
          });

          let prevEntSeq = -1;

          // TABLE: vocabs

          jmdictEntries.forEach((jmdictEntry) => {
            const entSeq = jmdictEntry.ent_seq[0];
            // console.log(`==${entSeq}==`);

            /** @type {[number, string, string, number, string][]}
             *         ent_seq, kanji, reading, pri_point, sense */
            const vocabRows = [];

            // Check unsorted entSeq in xml
            if (entSeq < prevEntSeq) {
              console.error(`entseq ${entSeq}: unsorted`);
            }
            prevEntSeq = entSeq;

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
              db.run('INSERT INTO vocabs VALUES (?, ?, ?, ?, ?)', row);

              readline.clearLine(process.stdout, 0);
              readline.cursorTo(process.stdout, 0, null);
              process.stdout.write(`jsons table : ${row[0]} ${row[1]} ${row[2]}`);
            });
          });

          // TABLE: entities

          Object.keys(jmdict.entities).forEach((key) => {
            db.run('INSERT INTO entities VALUES (?, ?)',
              key,
              jmdict.entities[key]);
          });

          db.run('END');

          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0, null);
          process.stdout.write('Inserting data to SQLite file...\n');
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
