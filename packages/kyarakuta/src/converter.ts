/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { KanaMap, KanaDetails } from './gen/kana-map';

export function toHiragana(string: string): string {
    const charArrayOriginal = [...string].map((char) => {
        const cp = char.codePointAt(0);
        if (cp === undefined) throw new Error();
        return cp;
    });

    const charArray: number[] = charArrayOriginal.map((cp) => {
        const h2kCodePoint = KanaMap[cp] as KanaDetails | undefined;
        let cpNew: number = cp;

        if (h2kCodePoint?.hiragana !== undefined) {
            cpNew = typeof h2kCodePoint.hiragana === 'number' ? h2kCodePoint.hiragana : cpNew;
        }

        return cpNew;
    });

    // Traverse for katakana dash
    for (let i = 0; i < charArray.length; i += 1) {
        const curr = charArray[i];
        const currOriginal = charArrayOriginal[i];
        const next = charArray[i + 1];

        if (next === 12540 // if next char is katana dash (ー)
            && KanaMap[currOriginal]?.katakana === true // AND if current character is katakana
            && typeof KanaMap[curr]?.vocal === 'number' // AND current character has vocal
        ) {
            const vocalCodePoint = KanaMap[curr].vocal as number;
            charArray[i + 1] = vocalCodePoint;
        }
    }

    return charArray.map((codePoint) => String.fromCodePoint(codePoint)).join('');
}

export function toKatakana(string: string): string {
    const charArrayOriginal = [...string].map((char) => {
        const cp = char.codePointAt(0);
        if (cp === undefined) throw new Error();
        return cp;
    });

    const charArray: number[] = charArrayOriginal.map((cp) => {
        const h2kCodePoint = KanaMap[cp] as KanaDetails | undefined;
        let cpNew: number = cp;

        if (h2kCodePoint?.hiragana !== undefined) {
            cpNew = typeof h2kCodePoint.katakana === 'number' ? h2kCodePoint.katakana : cpNew;
        }

        return cpNew;
    });

    return charArray.map((codePoint) => String.fromCodePoint(codePoint)).join('');
}
