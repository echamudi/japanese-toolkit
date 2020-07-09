/**
 * Copyright (c) 2020 Ezzat Chamudi
 * Copyright (c) 2020 Project Authors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * 
 */

const fs = require('fs');
const path = require('path');

/**
 * Returns the readings of given character
 * @param {string} char letter
 * @returns {{on: string[], kun: string[], nanori: string[]}} readings object
 */
function readings(char) {
    // @ts-ignore
    if (!(typeof char === 'string' || char instanceof String)) {
        throw new Error('char input must be string');
    };

    const numberOfLetters = [...char].length;
    if (numberOfLetters < 1 || numberOfLetters > 1) throw new Error('wrong length of string');

    const unicode = (() => {
        if (char.length === 1) {
            return char.charCodeAt(0).toString(16);
        }

        if (char.length === 2) {
            return (
                (char.charCodeAt(0) - 0xD800) * 0x400
              + (char.charCodeAt(1) - 0xDC00) + 0x10000
            ).toString(16);
        }

        throw new Error("f readings code logic error");
    })();

    const filePath = path.join(__dirname, 'kanjidic', unicode + '.json');

    if (!fs.existsSync(filePath)) return null;

    const charObj = JSON.parse(fs.readFileSync(filePath).toString());

    const on = charObj
        ?.reading_meaning
        ?.[0]
        ?.rmgroup
        ?.[0]
        ?.reading
        .filter((/** @type {{[x: string]: string}} */ el) => el.r_type === 'ja_on')
        .map((/** @type {{[x: string]: string}} */ el) => el.$t);

    const kun = charObj
        ?.reading_meaning
        ?.[0]
        ?.rmgroup
        ?.[0]
        ?.reading
        .filter((/** @type {{[x: string]: string}} */ el) => el.r_type === 'ja_kun')
        .map((/** @type {{[x: string]: string}} */ el) => el.$t);

    const nanori = charObj
        ?.reading_meaning
        ?.[0]
        .nanori;

    return { on: on ?? [], kun: kun ?? [], nanori: nanori ?? [] };
}

module.exports = { readings };
