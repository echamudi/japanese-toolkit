/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const fs = require('fs');
const https = require('https');

fs.mkdirSync('./raw-data/', { recursive: true });

// Download files
(async () => {
    console.log('Downloading required files');
    await Promise.all([
        (() => new Promise((resolve) => {
            // Download Names List
            https.get('https://raw.githubusercontent.com/echamudi/unicode-mirror/master/13.0.0/ucd/NamesList.txt', (response) => {
                response.pipe(fs.createWriteStream('./raw-data/NamesList.txt'));
                resolve();
            });
        }))(),
    ]);
    console.log('Download done!');
})();
