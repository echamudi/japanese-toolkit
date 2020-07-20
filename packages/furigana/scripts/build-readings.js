// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
const kanji = require('kanji');
const kyarakuta = require('kyarakuta');
const fs = require('fs');
const path = require('path');

/**
 * Final readings dictionary file
 * @type {{[x: string]: string[]}}
 */
const fin = {};

kanji.all.list().forEach((char) => {
    let readingsObj;
    try {
        readingsObj = kanji.readings(char);
    } catch {
        // console.log('not found: ', char);
        return;
    }
    fin[char] = [];
    const readingsArray = fin[char];

    readingsObj.on.forEach((reading) => {
        readingsArray.push(kyarakuta.toHiragana(reading));
    });

    readingsObj.kun.forEach((reading) => {
        readingsArray.push(reading.split('.')[0].replace('-', ''));
    });

    readingsObj.nanori.forEach((reading) => {
        readingsArray.push(reading);
    });

    fin[char] = [...new Set(readingsArray)];
});

const dir = path.resolve(__dirname, '../src/gen');
const filename = path.resolve(dir, 'reading-lib.ts');

const ts = `
// Generated code, don't edit this file

export const ReadingLib: Record<string, string[]> = JSON.parse(
    '${JSON.stringify(fin)}',
);
`;
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filename, ts);
