/**
 * Kanji Kentei by level
 * @type {{ [level: string]: string[] }}
 */
module.exports.kanken = {};
module.exports.kanken.lv10 = require('./kanken.lv10.json');
module.exports.kanken.lv09 = require('./kanken.lv09.json');
module.exports.kanken.lv08 = require('./kanken.lv08.json');
module.exports.kanken.lv07 = require('./kanken.lv07.json');
module.exports.kanken.lv06 = require('./kanken.lv06.json');
module.exports.kanken.lv05 = require('./kanken.lv05.json');
module.exports.kanken.lv04 = require('./kanken.lv04.json');
module.exports.kanken.lv03 = require('./kanken.lv03.json');
module.exports.kanken.lv02pre = require('./kanken.lv02pre.json');
module.exports.kanken.lv02 = require('./kanken.lv02.json');
module.exports.kanken.lv01pre = require('./kanken.lv01pre.json');
module.exports.kanken.lv01 = require('./kanken.lv01.json');

/**
 * Kanji Kentei by level, alias to kanken property
 * In kankenNumeric, the keys are numbers
 * @type {{ [level: string]: string[] }}
 */
module.exports.kankenNumeric = {};
module.exports.kankenNumeric[100] = module.exports.kanken.lv10;
module.exports.kankenNumeric[90] = module.exports.kanken.lv09;
module.exports.kankenNumeric[80] = module.exports.kanken.lv08;
module.exports.kankenNumeric[70] = module.exports.kanken.lv07;
module.exports.kankenNumeric[60] = module.exports.kanken.lv06;
module.exports.kankenNumeric[50] = module.exports.kanken.lv05;
module.exports.kankenNumeric[40] = module.exports.kanken.lv04;
module.exports.kankenNumeric[30] = module.exports.kanken.lv03;
module.exports.kankenNumeric[25] = module.exports.kanken.lv02pre;
module.exports.kankenNumeric[20] = module.exports.kanken.lv02;
module.exports.kankenNumeric[15] = module.exports.kanken.lv01pre;
module.exports.kankenNumeric[10] = module.exports.kanken.lv01;

/**
 * Kanji Kentei by JLPT level
 * @type {{ [nLevel: string]: string[] }}
 */
module.exports.jlpt = {};
module.exports.jlpt.old4 = require('./jlpt.old4.json');
module.exports.jlpt.old3 = require('./jlpt.old3.json');
module.exports.jlpt.old2 = require('./jlpt.old2.json');
module.exports.jlpt.old1 = require('./jlpt.old1.json');
module.exports.jlpt.n5 = require('./jlpt.n5.json');
module.exports.jlpt.n4 = require('./jlpt.n4.json');
module.exports.jlpt.n3 = require('./jlpt.n3.json');
module.exports.jlpt.n2 = require('./jlpt.n2.json');
module.exports.jlpt.n1 = require('./jlpt.n1.json');

/**
 * Kanji Kentei by grade
 * @type {{ [grade: string]: string[] }}
 */
module.exports.grade = {};
module.exports.grade.g01 = require('./grade.g01.json');
module.exports.grade.g02 = require('./grade.g02.json');
module.exports.grade.g03 = require('./grade.g03.json');
module.exports.grade.g04 = require('./grade.g04.json');
module.exports.grade.g05 = require('./grade.g05.json');
module.exports.grade.g06 = require('./grade.g06.json');

/** Remaining of Joyo Kanji */
module.exports.grade.g08 = require('./grade.g08.json');

/** Jinmeiyo Kanji */
module.exports.grade.g09 = require('./grade.g09.json');

/** Variant of Joyo Kanji */
module.exports.grade.g10 = require('./grade.g10.json');

/**
 * Frequency 1-2501 Kanji taken from KANJIDIC
 * The frequency list is made by Alexandre Girardi
 * @type {string[]}
 */
module.exports.freq = require('./freq.json');

/**
 * 13,108 kanji from KANJIDIC (JIS X 0208-1998, JIS X 0212-1990, JIS X 0213-2012)
 * @type {string[]}
 */
module.exports.all = require('./all.json');

module.exports.kanjiTree = require('./kanji-tree.js');
