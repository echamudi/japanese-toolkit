/**
 * Copyright (c) 2020 Ezzat Chamudi
 * Copyright (c) 2020 Project Authors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * 
 */

'strict mode';

const assert = require('assert');
const kanji = require('../');
const jsonLoader = require('../lib/json-loader');
const path = require('path');

const collectionArray = [
    kanji.kanken.lv10, // 0
    kanji.kanken.lv09, // 1
    kanji.kanken.lv08, // 2
    kanji.kanken.lv07, // 3
    kanji.kanken.lv06, // 4
    kanji.kanken.lv05, // 5
    kanji.kanken.lv04, // 6
    kanji.kanken.lv03, // 7
    kanji.kanken.lv02pre, // 8
    kanji.kanken.lv02, // 9
    kanji.kanken.lv01pre, // 10
    kanji.kanken.lv01, // 11
    kanji.jlpt.old4, // 12
    kanji.jlpt.old3, // 13
    kanji.jlpt.old2, // 14
    kanji.jlpt.old1, // 15
    kanji.jlpt.n5, // 16
    kanji.jlpt.n4, // 17
    kanji.jlpt.n3, // 18
    kanji.jlpt.n2, // 19
    kanji.jlpt.n1, // 20
    kanji.grade.g01, // 21
    kanji.grade.g02, // 21
    kanji.grade.g03, // 23
    kanji.grade.g04, // 24
    kanji.grade.g05, // 25
    kanji.grade.g06, // 26
    kanji.grade.g08, // 27
    kanji.grade.g09, // 28
    kanji.grade.g10, // 29
    kanji.freq.list, // 30
    kanji.all.list // 31
];

describe('testing Kanji', function () {
    describe('testing json loader', function () {
        it('loads json', function () {
            assert.deepStrictEqual(jsonLoader(path.join('.','test','fixtures','simple-array.json')), ['A', 'B']);
        });
    });

    describe('testing kanji tree', function () {
        it('exports correct object', function () {
            assert.deepStrictEqual(kanji.kanjiTree('国'),
                {
                    element: "国",
                    g: [{ element: "囗" },
                    {
                        element: "玉",
                        g: [
                            { element: "王" },
                            { element: "丶" }
                        ]
                    },
                    { element: "囗" }
                    ]
                }
            );
        });

        it('returns null if character is not found', function () {
            assert.deepStrictEqual(kanji.kanjiTree('a'), null);
        });

        it('throws wrong non string input', function () {
            // @ts-ignore
            assert.throws(() => { kanji.kanjiTree(10) }, new Error('char input must be string'));
            // @ts-ignore
            assert.throws(() => { kanji.kanjiTree({}) }, new Error('char input must be string'));
            assert.doesNotThrow(() => { kanji.kanjiTree('国') });
        });

        it('throws wrong wrong kanji length', function () {
            assert.throws(() => { kanji.kanjiTree('𦥑') }, new Error('kanjiTree only supports 1 character length'));
        });

        it('throws wrong input length', function () {
            assert.throws(() => { kanji.kanjiTree('abc') }, new Error('wrong length of string'));
            assert.throws(() => { kanji.kanjiTree('国際') }, new Error('wrong length of string'));
            assert.throws(() => { kanji.kanjiTree('') }, new Error('wrong length of string'));
        });
    });

    describe('testing flat file kanji list', function () {
        it('has kanji kentei properties', function () {
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv10), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv09), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv08), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv07), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv06), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv05), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv04), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv03), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv02pre), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv02), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv01pre), true);
            assert.deepStrictEqual(Array.isArray(kanji.kanken.lv01), true);
        });

        it('has jlpt properties', function () {
            assert.deepStrictEqual(Array.isArray(kanji.jlpt.old4), true);
            assert.deepStrictEqual(Array.isArray(kanji.jlpt.old3), true);
            assert.deepStrictEqual(Array.isArray(kanji.jlpt.old2), true);
            assert.deepStrictEqual(Array.isArray(kanji.jlpt.old1), true);

            assert.deepStrictEqual(Array.isArray(kanji.jlpt.n5), true);
            assert.deepStrictEqual(Array.isArray(kanji.jlpt.n4), true);
            assert.deepStrictEqual(Array.isArray(kanji.jlpt.n3), true);
            assert.deepStrictEqual(Array.isArray(kanji.jlpt.n2), true);
            assert.deepStrictEqual(Array.isArray(kanji.jlpt.n1), true);
        });

        it('has grade properties', function () {
            // Kyouiku
            assert.deepStrictEqual(Array.isArray(kanji.grade.g01), true);
            assert.deepStrictEqual(Array.isArray(kanji.grade.g02), true);
            assert.deepStrictEqual(Array.isArray(kanji.grade.g03), true);
            assert.deepStrictEqual(Array.isArray(kanji.grade.g04), true);
            assert.deepStrictEqual(Array.isArray(kanji.grade.g05), true);
            assert.deepStrictEqual(Array.isArray(kanji.grade.g06), true);

            // Remaining Joyo
            assert.deepStrictEqual(Array.isArray(kanji.grade.g08), true);

            // Jinmeiyo
            assert.deepStrictEqual(Array.isArray(kanji.grade.g09), true);

            // Variant of joyo kanji
            assert.deepStrictEqual(Array.isArray(kanji.grade.g10), true);
        });

        it('has freq properties', function () {
            assert.deepStrictEqual(Array.isArray(kanji.freq.list), true);
        });

        it('has all properties', function () {
            // 13,108 kanji from KANJIDIC (JIS X 0208-1998, JIS X 0212-1990, JIS X 0213-2012)
            assert.deepStrictEqual(Array.isArray(kanji.all.list), true);
        });
    });

    describe('random test content', function() {
        it('has correct related kanji content', function () {
            assert.deepStrictEqual(kanji.jlpt.n1.includes('垣'), true);
            assert.deepStrictEqual(kanji.jlpt.n2.includes('授'), true);
            assert.deepStrictEqual(kanji.jlpt.n3.includes('交'), true);
            assert.deepStrictEqual(kanji.jlpt.n4.includes('体'), true);
            assert.deepStrictEqual(kanji.jlpt.n5.includes('一'), true);

            // Kanjium
            assert.deepStrictEqual(kanji.related.antonyms["悪"], ["善", "美", "好", "良"]);
            assert.deepStrictEqual(kanji.related.lookalikes["会"], ["今", "令", "合"]);
            assert.deepStrictEqual(kanji.related.synonyms["悪"], ["醜", "粗", "憎"]);
            assert.deepStrictEqual(kanji.related.variants["万"], ["萬"]);
        });
    });

    describe('uniqueness test', function () {
        it('has unique arrays for all', function () {
            collectionArray.forEach((array, index) => {
                const set = new Set();

                array.forEach((char) => {
                    if (!set.has(char)) set.add(char);
                    else throw new Error('Wrong, at index ' + index + ' char ' + char);
                })
            })
        });

        it('has no kanji overlaps between kanken levels', function () {
            const kanken = [
                ...kanji.kanken.lv10,
                ...kanji.kanken.lv09,
                ...kanji.kanken.lv08,
                ...kanji.kanken.lv07,
                ...kanji.kanken.lv06,
                ...kanji.kanken.lv05,
                ...kanji.kanken.lv04,
                ...kanji.kanken.lv03,
                ...kanji.kanken.lv02pre,
                ...kanji.kanken.lv02,
                ...kanji.kanken.lv01pre,
                ...kanji.kanken.lv01,
            ];

            const set = new Set();

            kanken.forEach((char) => {
                if (!set.has(char)) set.add(char);
                else throw new Error('Wrong, char ' + char);
            })
        });

        it('has no kanji overlaps between new jlpt levels', function () {
            const jlpt = [
                ...kanji.jlpt.n5,
                ...kanji.jlpt.n4,
                ...kanji.jlpt.n3,
                ...kanji.jlpt.n2,
                ...kanji.jlpt.n1,
            ];

            const set = new Set();

            jlpt.forEach((char) => {
                if (!set.has(char)) set.add(char);
                else throw new Error('Wrong, char ' + char);
            })
        });
    });
});