const fs = require('fs');
const path = require('path');

/**
 * Returns kanji tree of given character
 * @param {string} char letter
 * @returns {Object} kanji tree object, it returns null if it's not found in database
 */
function kanjiTree(char) {
    if (!(typeof char === 'string' || char instanceof String)) {
        throw new Error('char input must be string');
    };

    if (char.length !== 1) throw new Error('wrong length of string');
    
    const charCode = char.charCodeAt().toString(16);
    const fileDir = path.join(__dirname, 'kanji-tree', '0' + charCode + '.json');

    if (fs.existsSync(fileDir)) {
        const json = JSON.parse(fs.readFileSync(fileDir));
        return json;
    } else {
        return null;
    }
}

module.exports = kanjiTree;
