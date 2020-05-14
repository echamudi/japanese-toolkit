const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
// const console = require('console');
const kanji = require('kanji');
const readline = require('readline');
const JMdictUtil = require('./JMdictUtil');
const JMnedictUtil = require('./JMnedictUtil');
const KanjidicUtil = require('./KanjidicUtil');

const wkAudio = require('../source/wk-audio-index.json');

/**
 * @class
 */
class JapaneseDBMaker {
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
          process.stdout.write('Creating shared tables\n');
          db.run('BEGIN');

          db.run(`CREATE TABLE metadata (
            key TEXT,
            value TEXT,
            PRIMARY KEY(key)
            )`);
          db.run(`CREATE TABLE dict_index (
            source INTEGER,
            id INTEGER,
            kanji TEXT,
            reading TEXT,
            pri_point INTEGER,
            meaning TEXT,
            PRIMARY KEY(source, id, kanji,reading)
            )`);

          db.run('END');
        });

        // JMdict
        db.serialize(() => {
          process.stdout.write('Loading JMdict\n');
          db.run('BEGIN');

          const jmdict = new JMdictUtil(sources.jmdict);
          const jmdictEntries = jmdict.getJMdictEntries();

          // TABLE: jmdict_jsons
          db.run(`CREATE TABLE jmdict_jsons (
            ent_seq INTEGER,
            json TEXT,
            PRIMARY KEY(ent_seq)
            )`);

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
             source: 1,
             id: number,
             kanji: string,
             reading: string,
             priPoint: number,
             meaning: string}[]} */
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
          db.run(`CREATE TABLE jmdict_entities (
            name TEXT,
            value TEXT,
            PRIMARY KEY(name)
            )`);

          Object.keys(jmdict.entities).forEach((key) => {
            db.run('INSERT INTO jmdict_entities VALUES (?, ?)',
              key,
              jmdict.entities[key]);
          });

          // TABLE: metadata
          db.run('INSERT INTO metadata VALUES (?, ?)',
            'jmdict-date',
            jmdict.dictDate);

          db.run('END');

          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0, null);
          process.stdout.write('Inserting data to SQLite file...\n');
        });

        // JMnedict
        db.serialize(() => {
          process.stdout.write('Loading JMnedict\n');
          db.run('BEGIN');

          const jmnedict = new JMnedictUtil(sources.jmnedict);
          const jmnedictEntries = jmnedict.getJMnedictEntries();

          // TABLE: jmnedict_jsons
          db.run(`CREATE TABLE jmnedict_jsons (
            ent_seq INTEGER,
            json TEXT,
            PRIMARY KEY(ent_seq)
            )`);

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

          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0, null);

          // TABLE: jmnedict_entities
          db.run(`CREATE TABLE jmnedict_entities (
            name TEXT,
            value TEXT,
            PRIMARY KEY(name)
            )`);

          Object.keys(jmnedict.entities).forEach((key) => {
            db.run('INSERT INTO jmnedict_entities VALUES (?, ?)',
              key,
              jmnedict.entities[key]);
          });

          // TABLE: metadata
          db.run('INSERT INTO metadata VALUES (?, ?)',
            'jmnedict-date',
            jmnedict.dictDate);

          db.run('END');
        });

        // Kanjidic
        db.serialize(() => {
          process.stdout.write('Loading Kanjidic\n');
          db.run('BEGIN');

          const kanjidic = new KanjidicUtil(sources.kanjidic);
          const kanjidicEntries = kanjidic.getKanjidicEntries();

          // TABLE: kanjidic
          db.run(`CREATE TABLE kanjidic (
            sort INTEGER,
            literal TEXT,
            jis208 TEXT,
            jis212 TEXT,
            jis213 TEXT,
            ucs TEXT,
            rad_classical INTEGER,
            rad_nelson_c INTEGER,
            grade INTEGER,
            stroke_count INTEGER,
            variant TEXT,
            freq INTEGER,
            rad_name TEXT,
            jlpt INTEGER,
            dic_number TEXT,
            query_code TEXT,
            reading TEXT,
            meaning TEXT,
            nanori TEXT,
            PRIMARY KEY(literal))`);

          kanjidicEntries.forEach(
            (/** @type {any} */ kanjidicEntry, /** @type {number} */ index) => {
              // literal
              const literal = kanjidicEntry.literal[0];

              // codepoint
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

              // radical
              // if (kanjidicEntry.radical.length > 1) {
              //   throw new Error(`${literal}: radical.length > 1`);
              // }

              let radClassical = null;
              let radNelsonC = null;

              kanjidicEntry.radical[0].rad_value.forEach((/** @type {any} */ radValue) => {
                if (radValue.rad_type === 'classical') radClassical = radValue.$t;
                if (radValue.rad_type === 'nelson_c') radNelsonC = radValue.$t;
              });

              // misc
              const misc = kanjidicEntry.misc[0];

              const grade = misc.grade
                ? misc.grade[0] : null;
              const strokeCount = misc.stroke_count
                ? misc.stroke_count[0] : null;
              const variant = misc.variant
                ? JSON.stringify(misc.variant, null, 0) : null;
              const freq = misc.freq
                ? misc.freq[0] : null;
              const radName = misc.rad_name
                ? JSON.stringify(misc.rad_name, null, 0) : null;
              const jlpt = misc.jlpt
                ? misc.jlpt[0] : null;

              // dic_number
              // if (kanjidicEntry.dic_number && kanjidicEntry.dic_number.length > 1) {
              //   throw new Error(`${literal}: dic_number.length > 1`);
              // }

              const dicNumber = kanjidicEntry.dic_number
                ? JSON.stringify(kanjidicEntry.dic_number[0].dic_ref, null, 0) : null;

              // query_code
              // if (kanjidicEntry.query_code && kanjidicEntry.query_code.length > 1) {
              //   throw new Error(`${literal}: query_code.length > 1`);
              // }

              const queryCode = kanjidicEntry.query_code
                ? JSON.stringify(kanjidicEntry.query_code[0].q_code, null, 0) : null;

              // reading_meaning & nanori
              let reading = null;
              let meaning = null;
              let nanori = null;

              if (kanjidicEntry.reading_meaning) {
                const readingObj = kanjidicEntry.reading_meaning[0].rmgroup[0].reading;
                reading = readingObj ? JSON.stringify(readingObj, null, 0) : null;

                let meaningObj = kanjidicEntry.reading_meaning[0].rmgroup[0].meaning;
                // Filter non english meaning
                meaningObj = meaningObj ? meaningObj.filter((/** @type {any} */ el) => typeof el === 'string') : null;
                meaning = meaningObj ? JSON.stringify(meaningObj, null, 0) : null;

                const nanoriObj = kanjidicEntry.reading_meaning[0].nanori;
                nanori = nanoriObj ? JSON.stringify(nanoriObj, null, 0) : null;
              }

              db.run('INSERT INTO kanjidic VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                index + 1,
                literal,
                jis208,
                jis212,
                jis213,
                ucs,
                radClassical,
                radNelsonC,
                grade,
                strokeCount,
                variant,
                freq,
                radName,
                jlpt,
                dicNumber,
                queryCode,
                reading,
                meaning,
                nanori);
            },
          );

          db.run('END');
        });

        // Kanji Groups
        db.serialize(() => {
          process.stdout.write('Loading Kanji\n');
          db.run('BEGIN');

          /** @type {Object<string, Object<string, number>>} */
          const all = {};

          kanji.kanken.lv10.forEach((char) => { all[char] = { kanken: 100 }; });
          kanji.kanken.lv09.forEach((char) => { all[char] = { kanken: 90 }; });
          kanji.kanken.lv08.forEach((char) => { all[char] = { kanken: 80 }; });
          kanji.kanken.lv07.forEach((char) => { all[char] = { kanken: 70 }; });
          kanji.kanken.lv06.forEach((char) => { all[char] = { kanken: 60 }; });
          kanji.kanken.lv05.forEach((char) => { all[char] = { kanken: 50 }; });
          kanji.kanken.lv04.forEach((char) => { all[char] = { kanken: 40 }; });
          kanji.kanken.lv03.forEach((char) => { all[char] = { kanken: 30 }; });
          kanji.kanken.lv02pre.forEach((char) => { all[char] = { kanken: 25 }; });
          kanji.kanken.lv02.forEach((char) => { all[char] = { kanken: 20 }; });
          kanji.kanken.lv01pre.forEach((char) => { all[char] = { kanken: 15 }; });
          kanji.kanken.lv01.forEach((char) => { all[char] = { kanken: 10 }; });

          kanji.jlpt.n5.forEach((char) => { all[char].jlptNew = 5; });
          kanji.jlpt.n4.forEach((char) => { all[char].jlptNew = 4; });
          kanji.jlpt.n3.forEach((char) => { all[char].jlptNew = 3; });
          kanji.jlpt.n2.forEach((char) => { all[char].jlptNew = 2; });
          kanji.jlpt.n1.forEach((char) => { all[char].jlptNew = 1; });

          db.run(`CREATE TABLE kanji_groups (
            kanji TEXT,
            kanken INTEGER,
            jlpt_new INTEGER,
            PRIMARY KEY(kanji)
            )`);

          Object.keys(all).forEach((char) => {
            db.run('INSERT INTO kanji_groups VALUES (?,?,?)',
              char,
              all[char].kanken,
              all[char].jlptNew);
          });

          db.run('END');
        });


        // kanjivg_tree
        db.serialize(() => {
          process.stdout.write('Loading KanjiVG Tree\n');
          db.run('BEGIN');

          db.run(`CREATE TABLE kanjivg_tree (
            kanji TEXT,
            tree_json TEXT,
            PRIMARY KEY(kanji)
          )`);

          const allKanji = kanji.all.list;

          allKanji.forEach((char) => {
            if (char.length !== 1) return;
            /** @type {Object|null} */
            const charTree = kanji.kanjiTree(char);
            if (charTree === null) return;
            db.run('INSERT INTO kanjivg_tree VALUES (?,?)',
              char,
              JSON.stringify(charTree));
          });
          db.run('END');
        });

        // wanikani_audio
        db.serialize(() => {
          process.stdout.write('Loading WaniKani Audio\n');
          db.run('BEGIN');

          db.run(`CREATE TABLE wanikani_audio (
            kanji TEXT,
            reading TEXT,
            PRIMARY KEY(kanji, reading)
          )`);

          wkAudio.forEach((el) => {
            db.run('INSERT INTO wanikani_audio VALUES (?,?)',
              el.k,
              el.r);
          });
          db.run('END');
        });

        // related kanji
        db.serialize(() => {
          process.stdout.write('Loading Related Kanji\n');
          db.run('BEGIN');
          db.run('CREATE TABLE related_antonyms (kanji TEXT, array TEXT, PRIMARY KEY(kanji))');
          db.run('CREATE TABLE related_lookalikes (kanji TEXT, array TEXT, PRIMARY KEY(kanji))');
          db.run('CREATE TABLE related_synonyms (kanji TEXT, array TEXT, PRIMARY KEY(kanji))');
          db.run('CREATE TABLE related_variants (kanji TEXT, array TEXT, PRIMARY KEY(kanji))');

          const {
            antonyms,
            lookalikes,
            synonyms,
            variants,
          } = kanji.related;

          Object.keys(antonyms).forEach((char) => {
            db.run('INSERT INTO related_antonyms VALUES (?,?)',
              char,
              JSON.stringify(antonyms[char]));
          });
          Object.keys(lookalikes).forEach((char) => {
            db.run('INSERT INTO related_lookalikes VALUES (?,?)',
              char,
              JSON.stringify(lookalikes[char]));
          });
          Object.keys(synonyms).forEach((char) => {
            db.run('INSERT INTO related_synonyms VALUES (?,?)',
              char,
              JSON.stringify(synonyms[char]));
          });
          Object.keys(variants).forEach((char) => {
            db.run('INSERT INTO related_variants VALUES (?,?)',
              char,
              JSON.stringify(variants[char]));
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
module.exports = JapaneseDBMaker;
