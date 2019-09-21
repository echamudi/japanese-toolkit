const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
// const console = require('console');
const readline = require('readline');
const JMdictUtil = require('./JMdictUtil');
const JMnedictUtil = require('./JMnedictUtil');

/**
 * @class
 */
class JapaneseDbMaker {
  /**
   * @param {Object<string, string>} sources
   * @param {string} targetPath
   * @returns {Promise}
   */
  static buildSqlite(sources, targetPath) {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(targetPath)) throw Error(`DB File ${targetPath} already exists, please delete or change the path.`);

        const db = new sqlite3.Database(targetPath);

        db.serialize(() => {
          db.run('CREATE TABLE jmdict_jsons (`ent_seq` INTEGER, `json` TEXT, PRIMARY KEY(`ent_seq`))');
          db.run('CREATE TABLE jmdict_entities (`name` TEXT, `value` TEXT, PRIMARY KEY(`name`))');
          db.run('CREATE TABLE jmnedict_jsons (`ent_seq` INTEGER, `json` TEXT, PRIMARY KEY(`ent_seq`))');
          db.run('CREATE TABLE jmnedict_entities (`name` TEXT, `value` TEXT, PRIMARY KEY(`name`))');
          db.run('CREATE TABLE dict_index (`source` INTEGER, `id` INTEGER, `kanji` TEXT, `reading` TEXT, `pri_point` INTEGER, `meaning` TEXT, PRIMARY KEY(`source`, `id`, `kanji`,`reading`))');
        });

        db.serialize(() => {
          db.run('BEGIN');

          process.stdout.write('Loading JMdict\n');

          const jmdict = new JMdictUtil(sources.jmdict);
          const jmdictEntries = jmdict.getJMdictEntries();

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

            /** @type {{
             * source: 1,
             * id: number,
             * kanji: string,
             * reading: string,
             * priPoint: number,
             * meaning: string}[]} */
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
                    vocabRows.push(
                      {
                        source: 1,
                        id: entSeq,
                        kanji: null,
                        reading: reb,
                        priPoint,
                        meaning: '',
                      },
                    );

                    // If the reading has reading restriction to the kanji
                  } else if (Object.hasOwnProperty.call(rEle, 're_restr')) {
                    if (rEle.re_restr.indexOf(keb) !== -1) {
                      vocabRows.push(
                        {
                          source: 1,
                          id: entSeq,
                          kanji: keb,
                          reading: reb,
                          priPoint,
                          meaning: '',
                        },
                      );
                    }

                    // If the reading doesn't have tags above,
                    // it applies to all kanji
                  } else {
                    vocabRows.push(
                      {
                        source: 1,
                        id: entSeq,
                        kanji: keb,
                        reading: reb,
                        priPoint,
                        meaning: '',
                      },
                    );
                  }
                });
              });
            }

            // If the vocab doesn't have kanji element
            if (!jmdictEntry.k_ele) {
              jmdictEntry.r_ele.forEach((rEle) => {
                vocabRows.push(
                  {
                    source: 1,
                    id: entSeq,
                    kanji: null,
                    reading: rEle.reb[0],
                    priPoint: rElePriPoints[rEle.reb[0]],
                    meaning: '',
                  },
                );
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
                  vocabRow.meaning += glosses;
                } else if (stagk !== null && vocabRow.kanji === stagk) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow.meaning += glosses;
                } else if (stagr !== null && vocabRow.reading === stagr) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow.meaning += glosses;
                }
              });
              // console.log(stagk, stagr, glosses);
            });

            // Put in db
            vocabRows.forEach((row) => {
              db.run('INSERT INTO dict_index VALUES (?, ?, ?, ?, ?, ?)', [
                row.source,
                row.id,
                row.kanji,
                row.reading,
                row.priPoint,
                row.meaning,
              ]);

              readline.clearLine(process.stdout, 0);
              readline.cursorTo(process.stdout, 0, null);
              process.stdout.write(`dict_index table : ${row.id} ${row.kanji} ${row.reading}`);
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

          process.stdout.write('Loading JMnedict\n');

          const jmnedict = new JMnedictUtil(sources.jmnedict);
          const jmnedictEntries = jmnedict.getJMnedictEntries();

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

            /** @type {{
             * source: 2,
             * id: number,
             * kanji: string,
             * reading: string,
             * meaning: string}[]} */
            const vocabRows = [];

            // If vocab has kanji element
            if (jmnedictEntry.k_ele) {
              jmnedictEntry.k_ele.forEach((kEle) => {
                const keb = kEle.keb[0];

                jmnedictEntry.r_ele.forEach((rEle) => {
                  /** @type {string} kanji reading */
                  const reb = rEle.reb[0];

                  vocabRows.push({
                    source: 2,
                    id: entSeq,
                    kanji: keb,
                    reading: reb,
                    meaning: '',
                  });
                });
              });
            }

            // If the vocab doesn't have kanji element
            if (!jmnedictEntry.k_ele) {
              jmnedictEntry.r_ele.forEach((rEle) => {
                vocabRows.push({
                  source: 2,
                  id: entSeq,
                  kanji: null,
                  reading: rEle.reb[0],
                  meaning: '',
                });
              });
            }

            // Add glossaries
            jmnedictEntry.trans.forEach((trans) => {
              let transDets = trans.trans_det.reduce((ax, text) => `${ax}; ${text}`, '');
              transDets = transDets.slice(2);
              transDets += '; ';

              vocabRows.forEach((vocabRow) => {
                // eslint-disable-next-line no-param-reassign
                vocabRow.meaning += transDets;
              });
            });

            // Put in db
            vocabRows.forEach((row) => {
              db.run('INSERT INTO dict_index(`source`, `id`, `kanji`, `reading`, `meaning`) VALUES (?, ?, ?, ?, ?)', [
                row.source,
                row.id,
                row.kanji,
                row.reading,
                row.meaning,
              ]);

              readline.clearLine(process.stdout, 0);
              readline.cursorTo(process.stdout, 0, null);
              process.stdout.write(`dict_index table : ${row.id} ${row.kanji} ${row.reading}`);
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
