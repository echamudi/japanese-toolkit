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
import {
    FitConfig, FuriganaMatchDetailed, FuriganaMatch, CharDataItem,
} from './types';

import { ReadingLib } from './gen/reading-lib';

const dakuten: {[x: string]: string} = JSON.parse(`{
    "が": "か", "ぎ": "き", "ぐ": "く", "げ": "け", "ご": "こ",
    "ざ": "さ", "じ": "し", "ず": "す", "ぜ": "せ", "ぞ": "そ",
    "だ": "た", "ぢ": "ち", "づ": "つ", "で": "て", "ど": "と",
    "ば": "は", "び": "ひ", "ぶ": "ふ", "べ": "へ", "ぼ": "ほ"
}`);

const handakuten: {[x: string]: string} = JSON.parse(`{
    "ぱ": "は", "ぴ": "ひ", "ぷ": "ふ", "ぺ": "へ", "ぽ": "ほ"
}`);

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
export function fitObj(writingText: string, readingText: string): FuriganaMatchDetailed[] | null {
    const memo: Record<number, Record<number, ReturnType<typeof fitObj>>> = {};

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
        const iterationKana = cp === 12445 || cp === 12446 || cp === 12541 || cp === 12542;
        const iterationKanji = cp === 12293;
        const cjk = isCJK(char);
        const kana = isKana(char) && !(iterationKana || iterationKanji);
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
            silent = silent && !iterationKana && !iterationKanji;
        }

        charData[char] = {
            char,
            cp,
            cjk,
            kana,
            silent,
            iterationKana,
            iterationKanji,
        };

        Object.freeze(charData[char]);
    });

    Object.freeze(charData);

    const writingArray = [...writingText];
    const readingArray = [...readingText];
    const writingLength = writingArray.length;
    const readingLength = readingArray.length;
    const writingHiragana = [...toHiragana(writingText)];
    const readingHiragana = [...toHiragana(readingText)];

    Object.freeze(writingArray);
    Object.freeze(readingArray);

    /**
     * @param writingIndex Start pointer of writing array
     * @param readingIndex Start pointer of reading array
     */
    function executor(writingIndex: number, readingIndex: number): ReturnType<typeof fitObj> {
        if (readingIndex > readingLength) return null;
        if (writingIndex > writingLength) return null;
        if (writingLength !== writingIndex && readingLength === readingIndex) return null;
        if (writingLength === writingIndex && readingLength !== readingIndex) return null;
        if (writingLength === writingIndex && readingLength === readingIndex) return [];

        // const writing: string = writingArray.slice(writingIndex).join('');
        // const reading: string = readingArray.slice(readingIndex).join('');

        /**
         * Load memo
         */
        if (memo[writingIndex]
            && Object.prototype.hasOwnProperty.call(memo[writingIndex], readingIndex)) {
            return memo[writingIndex][readingIndex];
        }

        if (!Object.prototype.hasOwnProperty.call(memo, writingIndex)) {
            memo[writingIndex] = {};
        }

        /*
         * Prepare constants
         */
        const isOneChar = (writingArray.length - writingIndex) === 1;
        const writingHiraganaSlice = writingHiragana.slice(writingIndex).join('');
        const readingHiraganaSlice = readingHiragana.slice(readingIndex).join('');

        // const isWritingKanji = isKanji(writing);
        // const isWritingKana = isKana(writing);

        const char0 = writingArray[writingIndex];
        const char0data = charData[writingArray[writingIndex]];

        /**
         * If writing is only one CJK character (+ 々)
         * example: writing = '今', reading = 'きょう'
         */
        if (isOneChar
                && (
                    // Either the writing is a kanji
                    (char0data.cjk || char0data.iterationKanji)

                    // OR a kana iteration mark (e.g. ゞ) and have 1 letter reading (e.g. ず)
                    || (char0data.iterationKana && (readingArray.length - readingIndex) === 1)
                )
        ) {
            const r: string[] = ReadingLib[char0] ?? [];
            const readingSlice = readingArray.slice(readingIndex).join('');

            const match: 0 | 1 = r.some((readingLibItem) => readingMatch(
                readingSlice, readingLibItem,
            )) ? 1 : 0;

            memo[writingIndex][readingIndex] = [
                {
                    w: char0,
                    r: readingSlice,
                    match,
                    isKanji: true,
                    returnId: 1,
                },
            ];

            return memo[writingIndex][readingIndex];
        }

        /**
         * If first letter is kana and matches
         * example:
         *            v                    v
         * writing = 'まで漢字', reading = 'までかんじ'
         */
        if (char0data.kana
            && toHiragana(writingArray[writingIndex]) === toHiragana(readingArray[readingIndex])) {
            let matchCounter = 0;

            for (let i = 0; i < readingArray.length; i += 1) {
                if (writingArray[writingIndex + i] === undefined
                    || readingArray[readingIndex + i] === undefined) {
                    break;
                }

                if (toHiragana(writingArray[writingIndex + i])
                    !== toHiragana(readingArray[readingIndex + i])) {
                    break;
                } else {
                    matchCounter += 1;
                }
            }

            const next = executor(
                writingIndex + matchCounter,
                readingIndex + matchCounter,
            );

            if (next === null) {
                memo[writingIndex][readingIndex] = null;
                return null;
            }

            memo[writingIndex][readingIndex] = [
                {
                    w: writingArray.slice(writingIndex, writingIndex + matchCounter).join(''),
                    r: toHiragana(readingArray.slice(readingIndex, readingIndex + matchCounter).join('')),
                    match: 1 as 0 | 1,
                    isKanji: false,
                    returnId: 3,
                },
                ...next,
            ];

            return memo[writingIndex][readingIndex];
        }

        // TODO: Allow space in the reading

        /**
         * If letter is voiceless, skip the letter
         */
        if (char0data?.silent) {
            const next = executor(
                writingIndex + 1,
                readingIndex,
            );

            if (next === null) {
                memo[writingIndex][readingIndex] = null;
                return null;
            }

            // If the next word is also silent, merge them
            if (next[0].silent) {
                const chunk = next.slice(0, 1)[0];

                memo[writingIndex][readingIndex] = [
                    {
                        w: writingArray[writingIndex] + chunk.w,
                        r: '',
                        match: 0,
                        isKanji: false,
                        silent: true,
                    },
                    ...next.slice(1),
                ];
            } else {
                memo[writingIndex][readingIndex] = [
                    {
                        w: writingArray[writingIndex],
                        r: '',
                        match: 1 as 0 | 1,
                        isKanji: false,
                        silent: true,
                    },
                    ...next,
                ];
            }

            return memo[writingIndex][readingIndex];
        }

        /**
         * If first letter is hiragana and doesn't match, return undefined
         * example:
         *            v                    v
         * writing = 'まで漢字', reading = 'はでかんじ'
         */
        if (char0data.kana && writingHiraganaSlice !== readingHiraganaSlice) {
            memo[writingIndex][readingIndex] = null;
            return null;
        }

        const firstCharMatches: {
            /** For reading strings taken from ReadingLib */
            readingLibItem: string,
            /** For reading strings taken from sliced inputted string */
            readingSlice: string
        }[] = [];

        if (ReadingLib[writingArray[writingIndex]] !== undefined) {
            ReadingLib[writingArray[writingIndex]].forEach((readingLibItem) => {
                const readingSlice = readingArray.slice(
                    readingIndex,
                    readingIndex + readingLibItem.length,
                ).join('');

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
                    writingIndex + 1,
                    readingIndex + firstCharMatches[i].readingSlice.length,
                );

                if (trial !== null) {
                    possibleResults.push([
                        {
                            w: writingArray[writingIndex],
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
                    writingIndex + 1,
                    readingIndex + i,
                );

                // If trial has result, clone the array
                trial = trial ? [...trial] : null;

                // Only push to possibleResults if the current path is possible
                if (trial !== null) {
                    const currentObj = {
                        w: writingArray[writingIndex],
                        r: readingArray.slice(readingIndex, readingIndex + i).join(''),
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

                if (i > (readingArray.length - readingIndex) + 2) break;

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

            memo[writingIndex][readingIndex] = currentResult;
            return currentResult;
        }
    }

    return executor(0, 0);
}

export function fit(writing: string, reading: string, config: {type: 'object', kanaReading?: boolean }): FuriganaMatch[] | null;
export function fit(writing: string, reading: string, config: {type: 'string'}): string | null;
export function fit(writing: string, reading: string): string | null;

export function fit(writing: string, reading: string, config?: FitConfig):
    FuriganaMatch[] | string | null {
    const fitObjResult = fitObj(writing, reading);

    if (config?.type === 'object') {
        if (fitObjResult === null) return null;

        if (config.kanaReading === false) {
            return fitObjResult.map((el) => {
                if (el.isKanji) return { w: el.w, r: el.r };
                return { w: el.w };
            });
        }

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

export { FuriganaMatch };
