// import * as kanji from 'kanji';
import { isKana, toHiragana } from 'wanakana';
import * as fs from 'fs';
import { join } from 'path';

const inf: {[x: string]: string} = 
{
    'か': 'が',
    'き': 'ぎ',
    'く': 'ぐ',
    'け': 'げ',
    'こ': 'ご',
    'さ': 'ざ',
    'し': 'じ',
    'す': 'ず',
    'せ': 'ぜ',
    'そ': 'ぞ',
    'た': 'だ',
    'ち': 'ぢ',
    'つ': 'づ',
    'て': 'で',
    'と': 'ど',
    'は': 'ば',
    'ひ': 'び',
    'ふ': 'ぶ',
    'へ': 'べ',
    'ほ': 'ぼ',
}

const readingLib = JSON.parse(
        fs.readFileSync(join(__dirname, './readings.json')).toString()
    ) as {[x: string]: string[]};

function readingMatch(s1: string, s2: string): boolean {
    let [s1_mod, s2_mod] = [s1, s2].map((reading) =>
        [...reading].map((char) => inf[char] ?? char).join('')
    );

    return s1_mod === s2_mod;
};

export function fitObj(writing: string, reading: string): {k: string, r: string, m: number}[] | undefined {
    // console.log(writing, reading);
    if (writing.length !== 0 && reading.length === 0) return undefined;
    if (writing.length === 0 && reading.length !== 0) return undefined;
    if (!isKana(reading)) throw new Error('Reading must be kana only');

    const writingArray = [...writing];
    const readingArray = [...reading];
    const isOneChar = writingArray.length === 1;
    const writingHiragana = toHiragana(writing);
    const readingHiragana = toHiragana(reading);

    // If writing is only one character
    if (!isKana(writing) && isOneChar) {
        let score = 0;

        const r: string[] = readingLib[writing];

        for (let i = 0; i < r.length; i++) {
            if(readingMatch(reading, r[i])) {
                score = 1;
                break;
            }
        }

        return [
            {
                k: writing,
                r: reading,
                m: score
            }
        ]
    }

    // Try direct match
    if (writingHiragana === readingHiragana) {
        const ret: any = [];

        writingArray.forEach((writingChar, index) => {
            ret.push({
                k: writingChar,
                r: readingArray[index],
                m: 1
            });
        });

        return ret;
    };

    // If first leter is hiragana
    if (isKana(writingArray[0]) && toHiragana(writingArray[0]) === toHiragana(readingArray[0])) {
        const trial = fitObj(
            writingArray.slice(1).join(''),
            reading.slice(1)
        )

        if (trial === undefined) return undefined;

        return [
            {
                k: writingArray[0],
                r: toHiragana(readingArray[0]),
                m: 1
            },
            ...trial
        ]
    }

    if (isKana(writingArray[0]) && writingHiragana !== readingHiragana) {
        return undefined;
    }

    let doesFirstCharMatch = false;
    let firstCharMatches: string[] = [];

    readingLib[writingArray[0]].forEach((charReading) => {
        if (readingMatch(reading.slice(0, charReading.length), charReading)) {
            doesFirstCharMatch = true;
            firstCharMatches.push(charReading);
        }
    });

    let results: ({k: string, r: string, m: number}[])[] = [];

    // If there is at least one match, traverse for each possibility
    if (doesFirstCharMatch) {
        for (let i = 0; i < firstCharMatches.length; i++) {
            const trial = fitObj(
                writingArray.slice(1).join(''),
                reading.slice(firstCharMatches[i].length)
            );

            if (trial !== undefined) {
                results.push([
                    {
                        k: writingArray[0],
                        r: firstCharMatches[i],
                        m: 1
                    },
                    ...trial
                ]);
            };
        }
    }

    // If it doesn't match

    for (let i = 1; i < readingArray.length; i++) {
        const trial = fitObj(
            writingArray.slice(1).join(''),
            reading.slice(i)
        );

        if (trial !== undefined) {
            results.push([
                {
                    k: writingArray[0],
                    r: reading.slice(0, i),
                    m: 0
                },
                ...trial
            ]);
        };
    }

    // Find the best reading

    let highestScore = -1;
    let currentResult: any;
    
    results.forEach((result) => {
        const currentScore = result.reduce((ax, el) => ax + el.m, 0);

        if (currentScore > highestScore) {
            currentResult = result;
            highestScore = currentScore;
        }
    });

    return currentResult;
};

// TODO
// Fix this fitObj('糀谷駅', 'こうじゃえき')
// fix this console.log(fitObj('飛田給駅', 'とびたきゅうえき'));

// Create scoring system?
console.log(fitObj('勿来', 'なこそ'));