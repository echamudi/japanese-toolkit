const fs = require('fs');

/**
 * Load JSON
 * @param {string} dir directory
 * @returns {Object} loaded json object
 */
function loadJson(dir) {
    return JSON.parse(fs.readFileSync(dir));
}
module.exports = loadJson;