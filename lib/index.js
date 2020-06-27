/**
 * Copyright (c) 2020 Ezzat Chamudi
 * Copyright (c) 2020 Project Authors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * 
 */

const loadJson = require('./json-loader')
const path = require('path');

const Kanken = {
    /** @returns {string[]} list of kanji */
    get lv10() { return loadJson(path.join(__dirname, 'data', 'kanken.lv10.json')) },
    /** @returns {string[]} list of kanji */
    get lv09() { return loadJson(path.join(__dirname, 'data', 'kanken.lv09.json')) },
    /** @returns {string[]} list of kanji */
    get lv08() { return loadJson(path.join(__dirname, 'data', 'kanken.lv08.json')) },
    /** @returns {string[]} list of kanji */
    get lv07() { return loadJson(path.join(__dirname, 'data', 'kanken.lv07.json')) },
    /** @returns {string[]} list of kanji */
    get lv06() { return loadJson(path.join(__dirname, 'data', 'kanken.lv06.json')) },
    /** @returns {string[]} list of kanji */
    get lv05() { return loadJson(path.join(__dirname, 'data', 'kanken.lv05.json')) },
    /** @returns {string[]} list of kanji */
    get lv04() { return loadJson(path.join(__dirname, 'data', 'kanken.lv04.json')) },
    /** @returns {string[]} list of kanji */
    get lv03() { return loadJson(path.join(__dirname, 'data', 'kanken.lv03.json')) },
    /** @returns {string[]} list of kanji */
    get lv02pre() { return loadJson(path.join(__dirname, 'data', 'kanken.lv02pre.json')) },
    /** @returns {string[]} list of kanji */
    get lv02() { return loadJson(path.join(__dirname, 'data', 'kanken.lv02.json')) },
    /** @returns {string[]} list of kanji */
    get lv01pre() { return loadJson(path.join(__dirname, 'data', 'kanken.lv01pre.json')) },
    /** @returns {string[]} list of kanji */
    get lv01() { return loadJson(path.join(__dirname, 'data', 'kanken.lv01.json')) },
};

/**
 * Kanji Kentei by level
 */
module.exports.kanken = Kanken;

const Jlpt = {
    /** @returns {string[]} list of kanji */
    get old4() { return loadJson(path.join(__dirname, 'data', 'jlpt.old4.json')) },
    /** @returns {string[]} list of kanji */
    get old3() { return loadJson(path.join(__dirname, 'data', 'jlpt.old3.json')) },
    /** @returns {string[]} list of kanji */
    get old2() { return loadJson(path.join(__dirname, 'data', 'jlpt.old2.json')) },
    /** @returns {string[]} list of kanji */
    get old1() { return loadJson(path.join(__dirname, 'data', 'jlpt.old1.json')) },
    /** @returns {string[]} list of kanji */
    get n5() { return loadJson(path.join(__dirname, 'data', 'jlpt.n5.json')) },
    /** @returns {string[]} list of kanji */
    get n4() { return loadJson(path.join(__dirname, 'data', 'jlpt.n4.json')) },
    /** @returns {string[]} list of kanji */
    get n3() { return loadJson(path.join(__dirname, 'data', 'jlpt.n3.json')) },
    /** @returns {string[]} list of kanji */
    get n2() { return loadJson(path.join(__dirname, 'data', 'jlpt.n2.json')) },
    /** @returns {string[]} list of kanji */
    get n1() { return loadJson(path.join(__dirname, 'data', 'jlpt.n1.json')) },
}

/**
 * Kanji Kentei by JLPT level
 */
module.exports.jlpt = Jlpt;

const Grade = {
    /** @returns {string[]} list of kanji */
    get g01() { return loadJson(path.join(__dirname, 'data', 'grade.g01.json')) },
    /** @returns {string[]} list of kanji */
    get g02() { return loadJson(path.join(__dirname, 'data', 'grade.g02.json')) },
    /** @returns {string[]} list of kanji */
    get g03() { return loadJson(path.join(__dirname, 'data', 'grade.g03.json')) },
    /** @returns {string[]} list of kanji */
    get g04() { return loadJson(path.join(__dirname, 'data', 'grade.g04.json')) },
    /** @returns {string[]} list of kanji */
    get g05() { return loadJson(path.join(__dirname, 'data', 'grade.g05.json')) },
    /** @returns {string[]} list of kanji */
    get g06() { return loadJson(path.join(__dirname, 'data', 'grade.g06.json')) },
    /** 
     * Remaining of Joyo Kanji
     * @returns {string[]} list of kanji */
    get g08() { return loadJson(path.join(__dirname, 'data', 'grade.g08.json')) },
    /** 
     * Jinmeiyo Kanji
     * @returns {string[]} list of kanji */
    get g09() { return loadJson(path.join(__dirname, 'data', 'grade.g09.json')) },
    /** 
     * Variant of Joyo Kanji
     * @returns {string[]} list of kanji */
    get g10() { return loadJson(path.join(__dirname, 'data', 'grade.g10.json')) },
}

/**
 * Kanji by grade
 */
module.exports.grade = Grade;

const Freq = {
    /** @returns {string[]} list of kanji */
    get list() { return loadJson(path.join(__dirname, 'data', 'freq.json')) }
}

/**
 * Frequency 1-2501 Kanji taken from KANJIDIC
 * The frequency list is made by Alexandre Girardi
 */
module.exports.freq = Freq;

const All = {
    /** @returns {string[]} list of kanji */
    get list() { return loadJson(path.join(__dirname, 'data', 'all.json')) }
}

/**
 * 13,108 kanji from KANJIDIC (JIS X 0208-1998, JIS X 0212-1990, JIS X 0213-2012)
 * Sorting is not guaranteed
 */
module.exports.all = All;

const Related = {
    /** @returns {Object.<string, Array.<string>>} */
    get antonyms() { return loadJson(path.join(__dirname, 'kanjium', 'kanjium-antonyms.json')) },
    /** @returns {Object.<string, Array.<string>>} */
    get lookalikes() { return loadJson(path.join(__dirname, 'kanjium', 'kanjium-lookalikes.json')) },
    /** @returns {Object.<string, Array.<string>>} */
    get synonyms() { return loadJson(path.join(__dirname, 'kanjium', 'kanjium-synonyms.json')) },
    /** @returns {Object.<string, Array.<string>>} */
    get variants() { return loadJson(path.join(__dirname, 'kanjium', 'kanjium-variants.json')) },
};

/**
 * Related kanji
 * antonyms, lookalikes, synonyms, and variants
 */
module.exports.related = Related;

module.exports.kanjiTree = require('./kanji-tree.js');
