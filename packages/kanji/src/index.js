/**
 * Copyright (c) 2020 Ezzat Chamudi
 * Copyright (c) 2020 Project Authors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 */

const path = require('path');
const loadJson = require('./json-loader');

/**
 * Kanji by Kentei level
 */
const Kanken = {
    /** @return {string[]} Kanji Kentei Level 10 */
    lv10() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv10.json')); },
    /** @return {string[]} Kanji Kentei Level 9 */
    lv09() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv09.json')); },
    /** @return {string[]} Kanji Kentei Level 8 */
    lv08() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv08.json')); },
    /** @return {string[]} Kanji Kentei Level 7 */
    lv07() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv07.json')); },
    /** @return {string[]} Kanji Kentei Level 6 */
    lv06() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv06.json')); },
    /** @return {string[]} Kanji Kentei Level 5 */
    lv05() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv05.json')); },
    /** @return {string[]} Kanji Kentei Level 4 */
    lv04() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv04.json')); },
    /** @return {string[]} Kanji Kentei Level 3 */
    lv03() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv03.json')); },
    /** @return {string[]} Kanji Kentei Level pre-2 */
    lv02pre() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv02pre.json')); },
    /** @return {string[]} Kanji Kentei Level 2 */
    lv02() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv02.json')); },
    /** @return {string[]} Kanji Kentei Level pre-1 */
    lv01pre() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv01pre.json')); },
    /** @return {string[]} Kanji Kentei Level 1 */
    lv01() { return loadJson(path.join(__dirname, '..', 'data', 'kanken.lv01.json')); },
};

module.exports.kanken = Kanken;

const Jlpt = {
    /** @return {string[]} Old JLPT4 */
    old4() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.old4.json')); },
    /** @return {string[]} Old JLPT3 */
    old3() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.old3.json')); },
    /** @return {string[]} Old JLPT2 */
    old2() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.old2.json')); },
    /** @return {string[]} Old JLPT1 */
    old1() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.old1.json')); },
    /** @return {string[]} Unofficial JLPT N5 list */
    n5() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.n5.json')); },
    /** @return {string[]} Unofficial JLPT N4 list */
    n4() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.n4.json')); },
    /** @return {string[]} Unofficial JLPT N3 list */
    n3() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.n3.json')); },
    /** @return {string[]} Unofficial JLPT N2 list */
    n2() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.n2.json')); },
    /** @return {string[]} Unofficial JLPT N1 list */
    n1() { return loadJson(path.join(__dirname, '..', 'data', 'jlpt.n1.json')); },
};

/**
 * Kanji by JLPT level
 */
module.exports.jlpt = Jlpt;

const Grade = {
    /** @return {string[]} Grade 1 */
    g01() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g01.json')); },
    /** @return {string[]} Grade 2 */
    g02() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g02.json')); },
    /** @return {string[]} Grade 3 */
    g03() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g03.json')); },
    /** @return {string[]} Grade 4 */
    g04() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g04.json')); },
    /** @return {string[]} Grade 5 */
    g05() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g05.json')); },
    /** @return {string[]} Grade 6 */
    g06() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g06.json')); },
    /** @return {string[]} Remaining of Joyo Kanji (Joyo kanji minus G1-G6 kanji) */
    g08() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g08.json')); },
    /** @return {string[]} Remaining Jinmeiyo Kanji */
    g09() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g09.json')); },
    /** @return {string[]} Variant of Joyo Kanji */
    g10() { return loadJson(path.join(__dirname, '..', 'data', 'grade.g10.json')); },
};

/**
 * Kanji by grade
 */
module.exports.grade = Grade;

const Freq = {
    /** @return {string[]} list of kanji */
    list() { return loadJson(path.join(__dirname, '..', 'data', 'freq.json')); },
};

/**
 * Frequency 1-2501 Kanji taken from KANJIDIC
 * The frequency list is made by Alexandre Girardi
 */
module.exports.freq = Freq;

const All = {
    /** @returns {string[]} list of all 13,108 kanji from KANJIDIC (JIS X 0208-1998,
     * JIS X 0212-1990, JIS X 0213-2012) */
    list() { return loadJson(path.join(__dirname, '..', 'data', 'all.json')); },
};

/**
 * 13,108 kanji from KANJIDIC (JIS X 0208-1998, JIS X 0212-1990, JIS X 0213-2012)
 * Sorting is not guaranteed
 */
module.exports.all = All;

const Related = {
    /** @returns {{[x: string]: string[]}} Antonyms kanji */
    antonyms() { return loadJson(path.join(__dirname, 'kanjium', 'kanjium-antonyms.json')); },
    /** @returns {{[x: string]: string[]}} Lookalikes kanji */
    lookalikes() { return loadJson(path.join(__dirname, 'kanjium', 'kanjium-lookalikes.json')); },
    /** @returns {{[x: string]: string[]}} Synonyms kanji */
    synonyms() { return loadJson(path.join(__dirname, 'kanjium', 'kanjium-synonyms.json')); },
    /** @returns {{[x: string]: string[]}} Variants kanji */
    variants() { return loadJson(path.join(__dirname, 'kanjium', 'kanjium-variants.json')); },
};

/**
 * Related kanji
 * antonyms, lookalikes, synonyms, and variants
 */
module.exports.related = Related;

module.exports.kanjiTree = require('./kanji-tree.js');

module.exports.readings = require('./kanjidic.js').readings;
