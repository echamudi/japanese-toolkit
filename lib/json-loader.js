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

/**
 * Load JSON
 * @param {string} dir directory
 * @returns {Object} loaded json object
 */
function loadJson(dir) {
    return JSON.parse(fs.readFileSync(dir));
}
module.exports = loadJson;