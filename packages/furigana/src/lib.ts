import {
    BlockStats, getBlockNames, isCJK, isKana, isWithinRanges,
} from 'kyarakuta';
import { CharData, CharDataItem } from './types';

export const Dakuten: Record<string, string> = JSON.parse(`{
    "が": "か", "ぎ": "き", "ぐ": "く", "げ": "け", "ご": "こ",
    "ざ": "さ", "じ": "し", "ず": "す", "ぜ": "せ", "ぞ": "そ",
    "だ": "た", "ぢ": "ち", "づ": "つ", "で": "て", "ど": "と",
    "ば": "は", "び": "ひ", "ぶ": "ふ", "べ": "へ", "ぼ": "ほ"
}`);

export const Handakuten: Record<string, string> = JSON.parse(`{
    "ぱ": "は", "ぴ": "ひ", "ぷ": "ふ", "ぺ": "へ", "ぽ": "ほ"
}`);

/**
 * Char data collection.
 * The data will be alive during the process.
 * Use flushCharData() to clear it.
 */
let charData: CharData = {};

export function getCharData(stringArr: string[]): Record<string, CharDataItem> {
    stringArr.forEach((char) => {
        if (charData[char]) return;

        const charDetails = getBlockNames(char)[0];

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
            silent = silent && !iterationKana && !iterationKanji && cp !== 12294; // 〆
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

    return charData;
}

export function flushCharData(): void {
    charData = {};
}
