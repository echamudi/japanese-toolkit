const fs = require('fs');
const xml2json = require('xml2json');

class KanjidicUtil {
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
module.exports = KanjidicUtil;
