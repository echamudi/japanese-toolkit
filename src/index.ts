// import * as kanji from 'kanji';
import {
    isKana, toHiragana, tokenize,
} from 'wanakana';
import * as fs from 'fs';
import { join } from 'path';

import { FitConfig, MatchDetailed, Match } from './types';

const dakuten: {[x: string]: string} = JSON.parse(`{
    "が": "か", "ぎ": "き", "ぐ": "く", "げ": "け", "ご": "こ",
    "ざ": "さ", "じ": "し", "ず": "す", "ぜ": "せ", "ぞ": "そ",
    "だ": "た", "ぢ": "ち", "づ": "つ", "で": "て", "ど": "と",
    "ば": "は", "び": "ひ", "ぶ": "ふ", "べ": "へ", "ぼ": "ほ"
}`);

const handakuten: {[x: string]: string} = JSON.parse(`{
    "ぱ": "は", "ぴ": "ひ", "ぷ": "ふ", "ぺ": "へ", "ぽ": "ほ"
}`);

const readingLib = JSON.parse(
    fs.readFileSync(join(__dirname, './readings.json')).toString(),
) as {[x: string]: string[]};

/**
 * If s1 is ひょう and s2 is ひょう, ぴょう, or びょう, return true
 * And vice versa
 * @param s1 String to be compared 1
 * @param s2 String to be compared 2
 */
function readingMatch(s1: string, s2: string): boolean {
    if (s1 === s2) return true;

    const [s1Mod, s2Mod] = [s1, s2].map((reading) => {
        if (dakuten[reading[0]]) return dakuten[reading[0]] + reading.slice(1);
        if (handakuten[reading[0]]) return handakuten[reading[0]] + reading.slice(1);
        return reading;
    });

    return s1Mod === s2Mod;
}

/**
 * @param writingText
 * @param readingText
 */
export function fitObj(writingText: string, readingText: string): MatchDetailed[] | null {
    const memo: {[x: string]: {[x: string]: ReturnType<typeof fitObj>} } = {};

    // Validate writing
    const isWritingValid = tokenize(writingText, { detailed: true })
        .map((el: any) => el.type)
        .every((el: any) => el === 'kanji'
            || el === 'hiragana'
            || el === 'katakana'
            || el === 'englishNumeral'
            || el === 'japaneseNumeral'
            || el === 'japanesePunctuation') || writingText === '';
    if (!isWritingValid) throw new Error('Currently, writing argument accept kanji and kana only.');

    // Validate reading
    const isReadingValid = isKana(readingText) || readingText === '';
    if (!isReadingValid) throw new Error('Currently, reading argument accept kana only.');

    function executor(writing: string, reading: string): ReturnType<typeof fitObj> {
        if (memo[writing] && Object.prototype.hasOwnProperty.call(memo[writing], reading)) {
            return memo[writing][reading];
        }

        if (!Object.prototype.hasOwnProperty.call(memo, writing)) {
            memo[writing] = {};
        }

        if (writing.length !== 0 && reading.length === 0) return null;
        if (writing.length === 0 && reading.length !== 0) return null;
        if (writing.length === 0 && reading.length === 0) return [];

        const writingArray = [...writing];
        const readingArray = [...reading];

        if (readingArray.length < writingArray.length) {
            memo[writing][reading] = null;
            return null;
        }

        const isOneChar = writingArray.length === 1;
        const writingHiragana = toHiragana(writing);
        const readingHiragana = toHiragana(reading);

        // const isWritingKanji = isKanji(writing);
        const isWritingKana = isKana(writing);

        /**
         * If writing is only one character
         * example: writing = '今', reading = 'きょう'
         */
        if (!isKana(writing) && isOneChar) {
            let match: 0 | 1 = 0;

            const r: string[] = readingLib[writing];

            for (let i = 0; i < r.length; i += 1) {
                if (readingMatch(reading, r[i])) {
                    match = 1;
                    break;
                }
            }

            memo[writing][reading] = [
                {
                    w: writing,
                    r: reading,
                    match,
                    isKanji: true,
                    returnId: 1,
                },
            ];

            return memo[writing][reading];
        }

        /**
         * If writing kana matches exaclty like the reading kana
         * example: writing = 'くろ', reading = 'くろ'
         * example: writing = 'ボーブは', reading = 'ぼーぶは'
         */
        if (isWritingKana && writingHiragana === readingHiragana) {
            memo[writing][reading] = [
                {
                    w: writing,
                    r: readingHiragana,
                    match: 1 as 0 | 1,
                    isKanji: false,
                    returnId: 2,
                },
            ];

            return memo[writing][reading];
        }

        /**
         * If first leter is hiragana and matches
         * example:
         *            v                    v
         * writing = 'まで漢字', reading = 'までかんじ'
         */
        if (isKana(writingArray[0])
            && toHiragana(writingArray[0]) === toHiragana(readingArray[0])) {
            let matchCounter = 0;

            for (let i = 0; i < writingArray.length; i += 1) {
                if (toHiragana(writingArray[i]) !== toHiragana(readingArray[i])) {
                    break;
                } else {
                    matchCounter += 1;
                }
            }

            const next = executor(
                writingArray.slice(matchCounter).join(''),
                reading.slice(matchCounter),
            );

            if (next === null) {
                memo[writing][reading] = null;
                return null;
            }

            memo[writing][reading] = [
                {
                    w: writingArray.slice(0, matchCounter).join(''),
                    r: toHiragana(readingArray.slice(0, matchCounter).join('')),
                    match: 1 as 0 | 1,
                    isKanji: false,
                    returnId: 3,
                },
                ...next,
            ];

            return memo[writing][reading];
        }

        /**
         * If first leter is hiragana and doesn't match, return undefined
         * example:
         *            v                    v
         * writing = 'まで漢字', reading = 'はでかんじ'
         */
        if (isKana(writingArray[0]) && writingHiragana !== readingHiragana) {
            memo[writing][reading] = null;
            return null;
        }

        let doesFirstCharMatch = false;
        const firstCharMatches: string[] = [];

        if (readingLib[writingArray[0]] !== undefined) {
            readingLib[writingArray[0]].forEach((charReading) => {
                if (readingMatch(reading.slice(0, charReading.length), charReading)) {
                    doesFirstCharMatch = true;
                    firstCharMatches.push(charReading);
                }
            });
        }

        const possibleResults: ReturnType<typeof fitObj>[] = [];

        /**
         * If there is at least one match, traverse for each possibility
         * example:
         *
         * writing = '田地', reading = 'でんち'
         * According to dict, '田' can match 'で' and 'でん'
         * we will traverse to both path ['で', 'でん']
         */
        if (doesFirstCharMatch) {
            for (let i = 0; i < firstCharMatches.length; i += 1) {
                const trial = executor(
                    writingArray.slice(1).join(''),
                    reading.slice(firstCharMatches[i].length),
                );

                if (trial !== null) {
                    possibleResults.push([
                        {
                            w: writingArray[0],
                            r: firstCharMatches[i],
                            match: 1 as 0 | 1,
                            isKanji: true,
                            returnId: 4,
                        },
                        ...trial,
                    ]);
                }
            }
        }

        /**
         * If it doesn't match anything, assume for each letter
         * example:
         *
         * writing = '食は', reading = 'あいうえおは'
         * According to dict, '食' can't match anything
         * we will traverse all possibilities ['あ', 'あい', 'あいう', 'あいうえ', ...]
         */
        for (let i = 1; i <= readingArray.length; i += 1) {
            let trial = executor(
                writingArray.slice(1).join(''),
                reading.slice(i),
            );

            trial = trial ? [...trial] : null;

            // Only push to possibleResults if the current path is possible
            if (trial !== null) {
                const currentObj = {
                    w: writingArray[0],
                    r: reading.slice(0, i),
                    match: 0 as 0 | 1,
                    isKanji: true,
                    returnId: 5,
                };

                /**
                 * If next MatchDetailed is a match
                 */
                if (trial[0]?.match === 1) {
                    possibleResults.push([
                        currentObj,
                        ...trial,
                    ]);
                }

                /*
                If next MatchDetailed is not a match, merge with current
                From:
                    { w: '一', r: 'あ', match: 0, ... }      <-- currentObj
                    [
                        { w: '二', r: 'いうえお', match: 0, ... }
                    ]
                To:
                    [
                        { w: '一二', r: 'あいうえお', match: 0, ... }
                    ]
                */
                {
                    const chunk = trial.splice(0, 1)[0];

                    possibleResults.push([{
                        w: currentObj.w + chunk.w,
                        r: currentObj.r + chunk.r,
                        match: 0,
                        isKanji: true,
                        returnId: 5,
                    },
                    ...trial,
                    ]);
                }
            }
        }

        // Find the best reading
        let highestScore = -1;
        let currentResult: ReturnType<typeof fitObj> = null;

        possibleResults.forEach((result) => {
            const currentScore = result?.reduce((ax, el) => ax + el.match, 0) ?? 0;

            if (currentScore > highestScore) {
                currentResult = result;
                highestScore = currentScore;
            }
        });

        memo[writing][reading] = currentResult;
        return currentResult;
    }

    return executor(writingText, readingText);
}

export function fit(writing: string, reading: string, config: {type: 'object'}): Match[] | null;
export function fit(writing: string, reading: string, config: {type: 'string'}): string | null;
export function fit(writing: string, reading: string): string | null;

export function fit(writing: string, reading: string, config?: FitConfig): Match[] | string | null {
    const fitObjResult = fitObj(writing, reading);

    if (config?.type === 'object') {
        if (fitObjResult === null) return null;
        return fitObjResult.map((el) => ({ w: el.w, r: el.r }));
    }

    {
        if (fitObjResult === null) return null;

        const tokens: string[] = [];

        fitObjResult.forEach((el) => {
            if (el.isKanji) tokens.push(` ${el.w}[${el.r}]`);
            if (!el.isKanji) tokens.push(`${el.w}`);
        });

        return tokens.join('').trim();
    }
}
