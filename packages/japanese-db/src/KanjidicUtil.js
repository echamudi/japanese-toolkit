/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const fs = require('fs');
const xml2json = require('xml2json');

// eslint-disable-next-line import/prefer-default-export
export class KanjidicUtil {
    /**
     * @param {string} path
     */
    constructor(path) {
        // Properties

        /** @type {string} */
        this.data = null;
        this.kanjidicObj = null;
        this.kanjidicEntries = null;

        // Constructor script
        this.load(path);
    }

    /**
     * Load Kanjidic file
     * @param {string} path
     * @returns {void}
     */
    load(path) {
    /** @type {string} */
        this.data = fs.readFileSync(path, 'utf8');
    }

    /**
     * Get Kanjidic Entries
     * @returns {any}
     */
    getKanjidicEntries() {
        if (this.kanjidicEntries) return this.kanjidicEntries;

        const kanjidicObj = /** @type {any} */ (xml2json.toJson(this.data, {
            object: true,
            arrayNotation: true,
        }));

        this.kanjidicEntries = kanjidicObj.kanjidic2[0].character;

        return kanjidicObj.kanjidic2[0].character;
    }
}
