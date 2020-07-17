/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// import * as kanji from 'kanji';
import {
    isKana, toHiragana, isCJK, getBlockNames, BlockStats, isWithinRanges,
} from 'kyarakuta';
import * as fs from 'fs';
import { join } from 'path';

import {
    FitConfig, MatchDetailed, Match, CharDataItem,
} from './types';

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
    fs.readFileSync(join(__dirname, '../data/readings.json')).toString(),
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

function isIterationMark(字: number | string): boolean {
    if (typeof 字 === 'number') {
        return 字 === 12293 || 字 === 12445 || 字 === 12446 || 字 === 12541 || 字 === 12542;
    }

    return 字 === '々' || 字 === 'ゝ' || 字 === 'ゞ' || 字 === 'ヽ' || 字 === 'ヾ';
}

/**
 * @param writingText
 * @param readingText
 */
export function fitObj(writingText: string, readingText: string): MatchDetailed[] | null {
    const memo: Record<string, Record<string, ReturnType<typeof fitObj>>> = {};

    // Validate writing
    // const isWritingValid = isJapanese(writingText);
    // if (!isWritingValid) throw new Error('Currently, writing argument accept kanji and kana.');

    // Validate reading
    const isReadingValid = isKana(readingText) || readingText === '';
    if (!isReadingValid) throw new Error('Currently, reading argument accept kana only.');

    const writingBlocks = getBlockNames(writingText);

    const charData: Record<string, CharDataItem> = {};

    writingBlocks.forEach((charDetails) => {
        const char = charDetails.char;
        if (charData[char]) return;

        const cp = char.codePointAt(0) as number;
        const cjk = isCJK(char) || isIterationMark(cp);
        const kana = isKana(char) && !isIterationMark(cp);
        const block = charDetails.block?.toLowerCase();
        const subblock = charDetails.subblock?.toLowerCase();
        let silent = false;

        /**
         * Get silent information
         */
        {
            silent = silent || isWithinRanges(char, [[
                // Some Fullwidth ASCII variants (？,！, etc)
                [0xFF01, 0xFF0F],
                [0xFF1A, 0xFF20],
                [0xFF3B, 0xFF40],
                [0xFF5B, 0xFF5E],
            ]]);

            // If the block name has the following labels, assume it silent
            if (block) {
                silent = !!(silent
                || BlockStats[block].sym
                || BlockStats[block].pun
                || BlockStats[block].mrk
                || BlockStats[block].bra
                || BlockStats[block].ann
                || BlockStats[block].str
                || BlockStats[block].sig);
            }

            // If the subblock name has the following labels, assume it silent
            if (subblock) {
                silent = !!(silent
                || BlockStats[subblock].sym
                || BlockStats[subblock].pun
                || BlockStats[subblock].mrk
                || BlockStats[subblock].bra
                || BlockStats[subblock].ann
                || BlockStats[subblock].str
                || BlockStats[subblock].sig);
            }

            // Exceptions: iteration marks are not silent
            silent = silent && !isIterationMark(cp);
        }

        charData[char] = {
            char,
            cp,
            cjk,
            kana,
            silent,
        };
    });

    function executor(writingArray: string[], readingArray: string[]): ReturnType<typeof fitObj> {
        const writing: string = writingArray.join('');
        const reading: string = readingArray.join('');

        /**
         * Load memo
         */
        if (memo[writing] && Object.prototype.hasOwnProperty.call(memo[writing], reading)) {
            return memo[writing][reading];
        }

        if (!Object.prototype.hasOwnProperty.call(memo, writing)) {
            memo[writing] = {};
        }

        if (writing.length !== 0 && reading.length === 0) return null;
        if (writing.length === 0 && reading.length !== 0) return null;
        if (writing.length === 0 && reading.length === 0) return [];

        /*
         * Prepare constants
         */
        const isOneChar = writingArray.length === 1;
        const writingHiragana = toHiragana(writing);
        const readingHiragana = toHiragana(reading);

        // const isWritingKanji = isKanji(writing);
        const isWritingKana = isKana(writing);

        /**
         * If writing is only one CJK character (+ 々)
         * example: writing = '今', reading = 'きょう'
         */
        if (isOneChar && (charData[writing].cjk)) {
            const r: string[] = readingLib[writing] ?? [];

            const match: 0 | 1 = r.some((readingLibItem) => readingMatch(reading, readingLibItem))
                ? 1 : 0;

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
         * If first letter is kana and matches
         * example:
         *            v                    v
         * writing = 'まで漢字', reading = 'までかんじ'
         */
        if (charData[writingArray[0]].kana
            && toHiragana(writingArray[0]) === toHiragana(readingArray[0])) {
            let matchCounter = 0;

            for (let i = 0; i < writingArray.length; i += 1) {
                if (writingArray[i] === undefined || readingArray[i] === undefined) {
                    break;
                }

                if (toHiragana(writingArray[i]) !== toHiragana(readingArray[i])) {
                    break;
                } else {
                    matchCounter += 1;
                }
            }

            const next = executor(
                writingArray.slice(matchCounter),
                readingArray.slice(matchCounter),
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

        // TODO: Add kana repetition letter algorithm
        // TODO: Allow space in the reading

        /**
         * If letter is voiceless, skip the letter
         */
        if (charData[writingArray[0]]?.silent) {
            const next = executor(
                writingArray.slice(1),
                readingArray,
            );

            if (next === null) {
                memo[writing][reading] = null;
                return null;
            }

            // If the next word is also silent, merge them
            if (next[0].silent) {
                const chunk = next.slice(0, 1)[0];

                memo[writing][reading] = [
                    {
                        w: writingArray[0] + chunk.w,
                        r: '',
                        match: 0,
                        isKanji: false,
                        silent: true,
                    },
                    ...next.slice(1),
                ];
            } else {
                memo[writing][reading] = [
                    {
                        w: writingArray[0],
                        r: '',
                        match: 1 as 0 | 1,
                        isKanji: false,
                        silent: true,
                    },
                    ...next,
                ];
            }

            return memo[writing][reading];
        }

        /**
         * If first letter is hiragana and doesn't match, return undefined
         * example:
         *            v                    v
         * writing = 'まで漢字', reading = 'はでかんじ'
         */
        if (charData[writingArray[0]].kana && writingHiragana !== readingHiragana) {
            memo[writing][reading] = null;
            return null;
        }

        const firstCharMatches: {
            /** For reading strings taken from ReadingLib */
            readingLibItem: string,
            /** For reading strings taken from sliced inputted string */
            readingSlice: string
        }[] = [];

        if (readingLib[writingArray[0]] !== undefined) {
            readingLib[writingArray[0]].forEach((readingLibItem) => {
                const readingSlice = reading.slice(0, readingLibItem.length);

                if (readingMatch(readingSlice, readingLibItem)) {
                    firstCharMatches.push({ readingSlice, readingLibItem });
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
        if (firstCharMatches.length > 0) {
            for (let i = 0; i < firstCharMatches.length; i += 1) {
                const trial = executor(
                    writingArray.slice(1),
                    readingArray.slice(firstCharMatches[i].readingSlice.length),
                );

                if (trial !== null) {
                    possibleResults.push([
                        {
                            w: writingArray[0],
                            r: firstCharMatches[i].readingSlice,
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
         *
         * The i in this loop is going with this pattern:
         * 3 2 1 0 6 5 4 9 8 7 12 11 10 ...
         */
        {
            let start = 3;
            let i = 3;
            let nextStop = 0;

            for (;;) {
                let trial = executor(
                    writingArray.slice(1),
                    readingArray.slice(i),
                );

                // If trial has result, clone the array
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
                    } else {
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

                if (i === readingArray.length) break;

                // Loop calculation
                if (i === nextStop) {
                    nextStop = start + 1;
                    start = nextStop + 2;
                    i = start;
                } else {
                    i -= 1;
                }
            }
        }

        /**
         * Find the best reading from possibleResults
         */
        {
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
    }

    return executor([...writingText], [...readingText]);
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
