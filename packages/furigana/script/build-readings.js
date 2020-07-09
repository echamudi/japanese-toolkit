const kanji = require('kanji');
const wanakana = require('wanakana');
const fs = require('fs');
const path = require('path');

/**
 * Final readings dictionary file
 * @type {{[x: string]: string[]}}
 */
const fin = {};

kanji.all.list().forEach((char, index) => {
    let readingsObj;
    try {
        readingsObj = kanji.readings(char);
    } catch {
        console.log('err', char);
        return;
    }
    fin[char] = [];
    const readingsArray = fin[char];

    readingsObj.on.forEach((reading) => {
        readingsArray.push(wanakana.toHiragana(reading));
    });

    readingsObj.kun.forEach((reading) => {
        readingsArray.push(reading.split('.')[0].replace('-', ''));
    });

    readingsObj.nanori.forEach((reading) => {
        readingsArray.push(reading);
    });

    fin[char] = [...new Set(readingsArray)];
});

const dir = path.resolve(__dirname, '../dist');
const filename = path.resolve(dir, 'readings.json');

fs.mkdirSync(path.resolve(__dirname, '../dist'), {recursive: true});
fs.writeFileSync(filename, JSON.stringify(fin));
