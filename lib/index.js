const loadJson = require('./json-loader')
const path = require('path');

/**
 * Kanji Kentei by level
 */
class Kanken {
    /** @returns {string[]} list of kanji */
    get lv10() { return loadJson(path.join(__dirname, 'kanken.lv10.json')) }
    /** @returns {string[]} list of kanji */
    get lv09() { return loadJson(path.join(__dirname, 'kanken.lv09.json')) }
    /** @returns {string[]} list of kanji */
    get lv08() { return loadJson(path.join(__dirname, 'kanken.lv08.json')) }
    /** @returns {string[]} list of kanji */
    get lv07() { return loadJson(path.join(__dirname, 'kanken.lv07.json')) }
    /** @returns {string[]} list of kanji */
    get lv06() { return loadJson(path.join(__dirname, 'kanken.lv06.json')) }
    /** @returns {string[]} list of kanji */
    get lv05() { return loadJson(path.join(__dirname, 'kanken.lv05.json')) }
    /** @returns {string[]} list of kanji */
    get lv04() { return loadJson(path.join(__dirname, 'kanken.lv04.json')) }
    /** @returns {string[]} list of kanji */
    get lv03() { return loadJson(path.join(__dirname, 'kanken.lv03.json')) }
    /** @returns {string[]} list of kanji */
    get lv02pre() { return loadJson(path.join(__dirname, 'kanken.lv02pre.json')) }
    /** @returns {string[]} list of kanji */
    get lv02() { return loadJson(path.join(__dirname, 'kanken.lv02.json')) }
    /** @returns {string[]} list of kanji */
    get lv01pre() { return loadJson(path.join(__dirname, 'kanken.lv01pre.json')) }
    /** @returns {string[]} list of kanji */
    get lv01() { return loadJson(path.join(__dirname, 'kanken.lv01.json')) }
};
module.exports.kanken = new Kanken();

/**
 * Kanji Kentei by JLPT level
 */
class Jlpt {
    /** @returns {string[]} list of kanji */
    get old4() { return loadJson(path.join(__dirname, 'jlpt.old4.json')) }
    /** @returns {string[]} list of kanji */
    get old3() { return loadJson(path.join(__dirname, 'jlpt.old3.json')) }
    /** @returns {string[]} list of kanji */
    get old2() { return loadJson(path.join(__dirname, 'jlpt.old2.json')) }
    /** @returns {string[]} list of kanji */
    get old1() { return loadJson(path.join(__dirname, 'jlpt.old1.json')) }
    /** @returns {string[]} list of kanji */
    get n5() { return loadJson(path.join(__dirname, 'jlpt.n5.json')) }
    /** @returns {string[]} list of kanji */
    get n4() { return loadJson(path.join(__dirname, 'jlpt.n4.json')) }
    /** @returns {string[]} list of kanji */
    get n3() { return loadJson(path.join(__dirname, 'jlpt.n3.json')) }
    /** @returns {string[]} list of kanji */
    get n2() { return loadJson(path.join(__dirname, 'jlpt.n2.json')) }
    /** @returns {string[]} list of kanji */
    get n1() { return loadJson(path.join(__dirname, 'jlpt.n1.json')) }
}
module.exports.jlpt = new Jlpt();

/**
 * Kanji by grade
 */
class Grade {
    /** @returns {string[]} list of kanji */
    get g01() { return loadJson(path.join(__dirname, 'grade.g01.json')) }
    /** @returns {string[]} list of kanji */
    get g02() { return loadJson(path.join(__dirname, 'grade.g02.json')) }
    /** @returns {string[]} list of kanji */
    get g03() { return loadJson(path.join(__dirname, 'grade.g03.json')) }
    /** @returns {string[]} list of kanji */
    get g04() { return loadJson(path.join(__dirname, 'grade.g04.json')) }
    /** @returns {string[]} list of kanji */
    get g05() { return loadJson(path.join(__dirname, 'grade.g05.json')) }
    /** @returns {string[]} list of kanji */
    get g06() { return loadJson(path.join(__dirname, 'grade.g06.json')) }
    /** 
     * Remaining of Joyo Kanji
     * @returns {string[]} list of kanji */
    get g08() { return loadJson(path.join(__dirname, 'grade.g08.json')) }
    /** 
     * Jinmeiyo Kanji
     * @returns {string[]} list of kanji */
    get g09() { return loadJson(path.join(__dirname, 'grade.g09.json')) }
    /** 
     * Variant of Joyo Kanji
     * @returns {string[]} list of kanji */
    get g10() { return loadJson(path.join(__dirname, 'grade.g10.json')) }
}
module.exports.grade = new Grade();

/**
 * Frequency 1-2501 Kanji taken from KANJIDIC
 * The frequency list is made by Alexandre Girardi
 */
class Freq {
    /** @returns {string[]} list of kanji */
    get list() { return loadJson(path.join(__dirname, 'freq.json')) }
}
module.exports.freq = new Freq();

/**
 * 13,108 kanji from KANJIDIC (JIS X 0208-1998, JIS X 0212-1990, JIS X 0213-2012)
 * Sorting is not guaranteed
 */
class All {
    /** @returns {string[]} list of kanji */
    get list() { return loadJson(path.join(__dirname, 'all.json')) }
}
module.exports.all = new All();

module.exports.kanjiTree = require('./kanji-tree.js');
