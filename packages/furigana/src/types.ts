/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export interface FuriganaMatch {
    /**
     * Writing
     */
    w: string,

    /**
     * Reading
     */
    r?: string,
}

/**
 * Similar to Match, but it contains more information for debugging purposes
 */
export interface FuriganaMatchDetailed extends FuriganaMatch {
    /**
     * 1 - matches according to kanjilib
     * 0 - doesn't match according to kanjilib
     */
    match: 0 | 1,

    /**
     * true writing contains kanji only
     * false writing contains writing only
     */
    isKanji: boolean,

    /**
     * return source (for debugging purpose)
     */
    returnId?: number,

    /**
     * Silent
     */
    silent?: boolean
}

export interface FitConfig {
    type?: 'object' | 'string'
}

export interface CharDataItem {
    /** Original character */
    char: string,

    /** Codepoint of the char */
    cp: number,

    /** Is it CJK character? */
    cjk: boolean,

    /** Is it in Hiragana + Katakana blocks? */
    kana: boolean,

    /**
     * Possibly silent character.
     * The value is true if the block or subblock names contains one of the following words:
     * symbol, punctuation, marks, brackets, annotation, stroke, and sign
     */
    silent: boolean,

    /**
     * Iteration kana mark
     * 'ゝ', etc.
     */
    iterationKana: boolean

    /**
     * Iteration kanji mark
     * '々'
     */
    iterationKanji: boolean
}
