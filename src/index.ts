// import * as kanji from 'kanji';
import * as wanakana from 'wanakana';
import * as fs from 'fs';
import { join } from 'path';

const readingLib = JSON.parse(
        fs.readFileSync(join(__dirname, './readings.json')).toString()
    ) as {[x: string]: string[]};

export function fitObj(writing: string, reading: string) {
    if (!wanakana.isKana(reading)) {
        throw new Error('Reading must be kana only');
    }

    const writingArray = [...writing];
    const readingArray = [...reading];
    const isOneChar = writingArray.length === 1;
    const writingHiragana = wanakana.toHiragana(writing);
    const readingHiragana = wanakana.toHiragana(reading);

    // If writing is only one character
    if (!wanakana.isKana(writing) && isOneChar) {
        return [
            {
                k: writing,
                r: reading
            }
        ]
    }

    // Try direct match
    if (writingHiragana === readingHiragana) {
        const ret: any = [];

        writingArray.forEach((writingChar, index) => {
            ret.push({
                k: writingChar,
                r: readingArray[index]
            });
        });

        return ret;
    };

    if (wanakana.isKana(writing) && writingHiragana !== readingHiragana) {
        return undefined;
    }

    let firstCharMatch = false;
    let firstCharMatches = [];

    readingLib[writingArray[0]].forEach((reading));
};

console.log(readingLib['一']);
