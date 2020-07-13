const fs = require('fs');
const https = require('https');

fs.mkdirSync('./raw-data/', { recursive: true });

// Download files
(async () => {
    console.log('Downloading required files');
    await Promise.all([
        (() => new Promise((resolve, reject) => {
            // Download Names List
            https.get('https://raw.githubusercontent.com/echamudi/unicode-mirror/master/13.0.0/ucd/NamesList.txt', (response) => {
                response.pipe(fs.createWriteStream('./raw-data/NamesList.txt'));
                resolve();
            });
        }))()
    ]);
    console.log('Download done!');
})();
