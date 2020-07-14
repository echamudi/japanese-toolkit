/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Ranges } from './types/types';

export const CJKranges: Ranges = [
    [0x4E00, 0x9FFF], // CJK Unified Ideographs
    [0x3400, 0x4DBF], // CJK Unified Ideographs Extension A
    [0x20000, 0x2A6DF], // CJK Unified Ideographs Extension B
    [0x2A700, 0x2B73F], // CJK Unified Ideographs Extension C
    [0x2B740, 0x2B81F], // CJK Unified Ideographs Extension D
    [0x2B820, 0x2CEAF], // CJK Unified Ideographs Extension E
    [0x2CEB0, 0x2EBEF], // CJK Unified Ideographs Extension F
    [0x30000, 0x3134F], // CJK Unified Ideographs Extension G
    [0xF900, 0xFAFF], // CJK Compatibility Ideographs
    [0x2F800, 0x2FA1F], // CJK Compatibility Ideographs Supplement
    [0x2E80, 0x2EFF], // CJK Radicals Supplement

    // Additional CGK ranges, we don't use them in this checking
    // [0x3000, 0x303F], // CJK Symbols and Punctuation
    // [0x31C0, 0x31EF], // CJK Strokes
    // [0x3200, 0x32FF], // Enclosed CJK Letters and Months
    // [0x3300, 0x33FF], // CJK Compatibility
    // [0xFE30, 0xFE4F], // CJK Compatibility Forms
];

export const KanaRanges: Ranges = [
    [0x3040, 0x309F], // Hiragana
    [0x30A0, 0x30FF], // Katakana
    [0x31F0, 0x31FF], // Katakana Phonetic Extensions
];
