/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const https = require('https');
const fs = require('fs');

fs.mkdirSync('./dist/data', { recursive: true });
const wkAudioIndexJson = fs.createWriteStream('./dist/data/wk-audio-index.json');

https.get('https://raw.githubusercontent.com/echamudi/japanese-vocabulary-pronunciation-audio/master/dist/wk-audio-index.json', (response) => {
    response.pipe(wkAudioIndexJson);
});
