/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

// eslint-disable-next-line spaced-comment

const assert = require('assert');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

describe('japanese-db', function () {
    describe('extracts correctly', function () {
        // it('extracts dict_index table correctly', async function () {
        //   // TODO
        // });
        // it('extracts jmdict_entities table correctly', async function () {
        //   // TODO
        // });
        // it('extracts jmdict_jsons table correctly', async function () {
        //   // TODO
        // });
        // it('extracts jmnedict_entities table correctly', async function () {
        //   // TODO
        // });
        // it('extracts jmnedict_jsons table correctly', async function () {
        //   // TODO
        // });
        // it('extracts kanji_groups table correctly', async function () {
        //   // TODO
        // });
        // it('extracts kanjidic table correctly', async function () {
        //   // TODO
        // });

        it('extracts kanjivg_tree table correctly', async function () {
            /** @type { import("sqlite3").Database } */
            const db = new sqlite3.Database(path.join(__dirname, 'temp', 'japanese.db'));
            const result = await new Promise((resolve) => {
                db.all(
                    'SELECT * FROM kanjivg_tree WHERE kanji="圧"',
                    (err, rows) => { resolve(rows); },
                );
            });

            // @ts-ignore
            assert.deepStrictEqual(
                JSON.stringify(result),
                '[{"kanji":"圧","tree_json":"{\\"element\\":\\"圧\\",\\"g\\":[{\\"element\\":\\"厂\\"},{\\"element\\":\\"土\\"}]}"}]',
            );
        });

        it('extracts metadata table correctly', async function () {
            /** @type { import("sqlite3").Database } */
            const db = new sqlite3.Database(path.join(__dirname, 'temp', 'japanese.db'));
            const result = await new Promise((resolve) => {
                db.all(
                    'SELECT * FROM metadata',
                    (err, rows) => { resolve(rows); },
                );
            });

            // @ts-ignore
            assert.deepStrictEqual(
                JSON.stringify(result),
                '[{"key":"jmdict-date","value":"2019-08-16"},{"key":"jmnedict-date","value":"2019-09-20"}]',
            );
        });

        // it('extracts related_antonyms table correctly', async function () {
        //   // TODO
        // });
        // it('extracts related_lookalikes table correctly', async function () {
        //   // TODO
        // });
        // it('extracts related_synonyms table correctly', async function () {
        //   // TODO
        // });
        // it('extracts related_variants table correctly', async function () {
        //   // TODO
        // });

        it('extracts wanikani_audio table correctly', async function () {
            /** @type { import("sqlite3").Database } */
            const db = new sqlite3.Database(path.join(__dirname, 'temp', 'japanese.db'));
            const result = await new Promise((resolve) => {
                db.all(
                    `SELECT * FROM wanikani_audio WHERE 
                      kanji="寡婦"
                      OR kanji="寡黙"
                      OR kanji="寧ろ"
                      OR kanji="審判"
                      OR kanji="審査"
                      OR kanji="寮"`,
                    (err, rows) => { resolve(rows); },
                );
            });

            // @ts-ignore
            assert.deepStrictEqual(
                JSON.stringify(result),
                '[{"kanji":"寡婦","reading":"かふ"},{"kanji":"寡黙","reading":"かもく"},{"kanji":"寧ろ","reading":"むしろ"},{"kanji":"審判","reading":"しんぱん"},{"kanji":"審査","reading":"しんさ"},{"kanji":"寮","reading":"りょう"}]',
            );
        });
    });
});
