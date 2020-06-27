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
const zlib = require('zlib');
const xml2json = require('xml2json');
const { promisify } = require('util');

const gunzip = promisify(zlib.gunzip);
const sleep = promisify(setTimeout);

(async () => {
    const kanjidicGzipPath = path.resolve(__dirname, '../raw-data/kanjidic2.xml.gz');
    const kanjidicGzipBuffer = fs.readFileSync(kanjidicGzipPath);

    const kanjidicXml = await gunzip(kanjidicGzipBuffer);
    
    const kanjidicObj = xml2json.toJson(kanjidicXml, {
        object: true,
        arrayNotation: true,
    });

    // Generate JSON for debugging
    // fs.writeFileSync(
    //     path.resolve(__dirname, '../raw-data/kanjidic2.json'), 
    //     JSON.stringify(jmdictObj, null, 2)
    // );

    const targetDir = path.resolve(__dirname, '../lib/kanjidic');

    fs.mkdirSync(targetDir, { recursive: true });

    for (let i = 0; i < kanjidicObj.kanjidic2[0].character.length; i++) {
        const character = kanjidicObj.kanjidic2[0].character[i];
        const ucs = character
            .codepoint[0]
            .cp_value
            .filter((el) => el.cp_type === "ucs")[0]
            .$t
            .toLowerCase();
        
        const targetFilePath = path.join(targetDir, ucs + '.json');

        if (fs.existsSync(targetFilePath)) {
            throw new Error('duplicate: ' + targetFilePath);
        }

        // if (character.literal[0].length > 1) {
        //     console.log(character.literal[0]);
        // }

        fs.writeFileSync(
            targetFilePath,
            JSON.stringify(character),
            { encoding: 'utf-8' }
        );
    }

    const notice = `
This folder is generated by script. Please don't edit the content manually.
Data taken from KANJIDIC http://www.edrdg.org/wiki/index.php/KANJIDIC_Project
Creative Commons Attribution-ShareAlike Licence (V3.0)
Copyright (C) The Electronic Dictionary Research and Development Group.
`;
        
        // Add notice
        fs.writeFileSync(path.join(targetDir, '_notice.txt'), notice, function(err) {
            if (err) {
                console.log(err);
            }
        });
        
})();
