const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');

fs.mkdirSync('./source/', { recursive: true });

(async () => {
    console.log('Downloading required files');

    await Promise.all([
        (() => new Promise((resolve, reject) => {
            https.get('https://raw.githubusercontent.com/ezhmd/kanjium/master/data/source_files/antonyms.txt', (response) => {
                response.pipe(fs.createWriteStream('./source/kanjium-antonyms.txt'));
                resolve();
            });
        }))(),
        (() => new Promise((resolve, reject) => {
            https.get('https://raw.githubusercontent.com/ezhmd/kanjium/master/data/source_files/synonyms.txt', (response) => {
                response.pipe(fs.createWriteStream('./source/kanjium-synonyms.txt'));
                resolve();
            });
        }))(),
        (() => new Promise((resolve, reject) => {
            https.get('https://raw.githubusercontent.com/ezhmd/kanjium/master/data/source_files/lookalikes.txt', (response) => {
                response.pipe(fs.createWriteStream('./source/kanjium-lookalikes.txt'));
                resolve();
            });
        }))(),
        (() => new Promise((resolve, reject) => {
            https.get('https://raw.githubusercontent.com/ezhmd/kanjium/master/data/source_files/variants.txt', (response) => {
                response.pipe(fs.createWriteStream('./source/kanjium-variants.txt'));
                resolve();
            });
        }))()
    ]);

    console.log('Downloading git files');

    execSync('cd ./source && git clone --depth 1 -b master https://github.com/ezhmd/kanjivg.git && cd ..',
        {
            stdio: 'inherit'
        }
    );

    console.log('Completed');
})();
