/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export interface SubBlocksLibraryInterface {
    readonly subblocks: Record<number, string>;
    readonly codePoints: Record<number, number>;
}

export interface BlockRange {
    readonly block: string,
    readonly start: number,
    readonly end: number
}

/**
 * [start, end]
 */
export type RangeTuple = [number, number];
export type Ranges = RangeTuple[];

export interface BlockCondition {
    block?: string | undefined,
    subblock?: string | undefined
}

export interface BlockStat {
    /** Is it a block? */
    bl?: 1,

    /** Is it a subblock? */
    sb?: 1,

    /** Does the block/subblock name contain the word "letter"? */
    ltr?: 1,
    /** Does the block/subblock name contain the word "digit"? */
    dig?: 1,
    /** Does the block/subblock name contain the word "number/numeral/numeric"? */
    num?: 1,

    /** Does the block/subblock name contain the word "symbol"? */
    sym?: 1,
    /** Does the block/subblock name contain the word "punctuation"? */
    pun?: 1,
    /** Does the block/subblock name contain the word "mark"? */
    mrk?:1,
    /** Does the block/subblock name contain the word "bracket"? */
    bra?: 1,
    /** Does the block/subblock name contain the word "annotation"? */
    ann?: 1,
    /** Does the block/subblock name contain the word "stroke"? */
    str?: 1,

    /** Does the block/subblock name contain the word "vowel"? */
    vow?: 1,
    /** Does the block/subblock name contain the word "consonant"? */
    con?: 1,

    /** Does the block/subblock name contain the word "sign"? */
    sig?: 1,
    /** Does the block/subblock name contain the word "syllable"? */
    syl?: 1,

    /**
     * [start codepoint, end codepoint]
     *
     * Not available for subblocks
     */
    range?: RangeTuple;
}
