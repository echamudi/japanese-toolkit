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

export function fitObj(writing: string, reading: string): any {
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
                r: toHiragana(readingArray[0])
            },
            ...fitObj(
                writingArray.slice(1).join(''),
                reading.slice(1)
            )
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

    // If there is at least one match, traverse for each possibility
    if (doesFirstCharMatch) {
        for (let i = 0; i < firstCharMatches.length; i++) {
            const trial = fitObj(
                writingArray.slice(1).join(''),
                reading.slice(firstCharMatches[i].length)
            );

            if (trial !== undefined) {
                return [
                    {
                        k: writingArray[0],
                        r: firstCharMatches[i]
                    },
                    ...trial
                ]
            };
        }
    }

    // If it doesn't match

    // Try inflicted first reading char
    // for (let i = 1; i < readingArray.length; i++) {
    //     const trial = fitObj(
    //         writingArray.slice(1).join(''),
    //         reading.slice(i)
    //     );

    //     if (trial !== undefined) {
    //         return [
    //             {
    //                 k: writingArray[0],
    //                 r: reading.slice(0, i)
    //             },
    //             ...trial
    //         ]
    //     };
    // }

    for (let i = 1; i < readingArray.length; i++) {
        const trial = fitObj(
            writingArray.slice(1).join(''),
            reading.slice(i)
        );

        if (trial !== undefined) {
            return [
                {
                    k: writingArray[0],
                    r: reading.slice(0, i)
                },
                ...trial
            ]
        };
    }

    return undefined;
};

// TODO
// Fix this fitObj('糀谷駅', 'こうじゃえき')
// fix this console.log(fitObj('飛田給駅', 'とびたきゅうえき'));
