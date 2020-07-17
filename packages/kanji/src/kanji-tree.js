/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const fs = require('fs');
const path = require('path');

/**
 * Returns kanji tree of given character
 * @param {string} char letter
 * @returns {Object} kanji tree object, it returns null if it's not found in database
 */
function kanjiTree(char) {
    // @ts-ignore
    if (!(typeof char === 'string' || char instanceof String)) {
        throw new Error('char input must be string');
    }

    const numberOfLetters = [...char].length;
    if (numberOfLetters < 1 || numberOfLetters > 1) throw new Error('wrong length of string');

    if (char.length > 1) throw new Error('kanjiTree only supports 1 character length');

    const charCode = char.charCodeAt(0).toString(16);
    const fileDir = path.join(__dirname, 'kanji-tree', `0${charCode}.json`);

    if (fs.existsSync(fileDir)) {
        const json = JSON.parse(fs.readFileSync(fileDir).toString());
        return json;
    }
    return null;
}

module.exports = kanjiTree;
