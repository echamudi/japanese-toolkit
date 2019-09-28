const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
// const console = require('console');
const readline = require('readline');
const JMdictUtil = require('./JMdictUtil');
const JMnedictUtil = require('./JMnedictUtil');
const KanjidicUtil = require('./KanjidicUtil');

/**
 * @class
 */
class JapaneseDbMaker {
  /**
   * @param {Object<string, string>} sources
   * @param {string} targetPath
   * @returns {Promise}
   */
  static async buildSqlite(sources, targetPath) {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(targetPath)) throw Error(`DB File ${targetPath} already exists, please delete or change the path.`);

        const db = new sqlite3.Database(targetPath);

        db.serialize(() => {
          db.run(`CREATE TABLE jmdict_jsons (
            ent_seq INTEGER,
            json TEXT,
            PRIMARY KEY(ent_seq)
            )`);
          db.run(`CREATE TABLE jmdict_entities (
            name TEXT,
            value TEXT,
            PRIMARY KEY(name)
            )`);
          db.run(`CREATE TABLE jmnedict_jsons (
            ent_seq INTEGER,
            json TEXT,
            PRIMARY KEY(ent_seq))`);
          db.run(`CREATE TABLE jmnedict_entities (
            name TEXT,
            value TEXT,
            PRIMARY KEY(name))`);
          db.run(`CREATE TABLE kanjidic (
            literal TEXT,
            jis208 TEXT,
            jis212 TEXT,
            jis213 TEXT,
            ucs TEXT,
            rad_classical INTEGER,
            rad_nelson_c INTEGER,
            json TEXT,
            PRIMARY KEY(literal))`);
          db.run(`CREATE TABLE dict_index (
            source INTEGER,
            id INTEGER,
            kanji TEXT,
            reading TEXT,
            pri_point INTEGER,
            meaning TEXT,
            PRIMARY KEY(source, id, kanji,reading))`);
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

        db.serialize(() => {
          db.run('BEGIN');

          process.stdout.write('Loading Kanjidic\n');

          const kanjidic = new KanjidicUtil(sources.kanjidic);
          const kanjidicEntries = kanjidic.getKanjidicEntries();

          // TABLE: kanjidic_jsons
          kanjidicEntries.forEach((/** @type {any} */ kanjidicEntry) => {
            const literal = kanjidicEntry.literal[0];
            let jis208 = null;
            let jis212 = null;
            let jis213 = null;
            let ucs = null;

            kanjidicEntry.codepoint[0].cp_value.forEach((/** @type {any} */ cpValue) => {
              if (cpValue.cp_type === 'jis208') jis208 = cpValue.$t;
              if (cpValue.cp_type === 'jis212') jis212 = cpValue.$t;
              if (cpValue.cp_type === 'jis213') jis213 = cpValue.$t;
              if (cpValue.cp_type === 'ucs') ucs = cpValue.$t;
            });

            let radClassical = null;
            let radNelsonC = null;

            kanjidicEntry.radical[0].rad_value.forEach((/** @type {any} */ radValue) => {
              if (radValue.rad_type === 'classical') radClassical = radValue.$t;
              if (radValue.rad_type === 'nelson_c') radNelsonC = radValue.$t;
            });

            // eslint-disable-next-line no-param-reassign
            delete kanjidicEntry.literal;
            // eslint-disable-next-line no-param-reassign
            delete kanjidicEntry.codepoint;
            // eslint-disable-next-line no-param-reassign
            delete kanjidicEntry.radical;

            db.run('INSERT INTO kanjidic VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              literal,
              jis208,
              jis212,
              jis213,
              ucs,
              radClassical,
              radNelsonC,
              JSON.stringify(kanjidicEntry, null, 0));
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
