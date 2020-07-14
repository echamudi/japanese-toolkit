const https = require('https');
const fs = require('fs');

fs.mkdirSync('./source/', { recursive: true });
const wkAudioIndexJson = fs.createWriteStream('./source/wk-audio-index.json');

https.get('https://raw.githubusercontent.com/echamudi/japanese-vocabulary-pronunciation-audio/master/dist/wk-audio-index.json', (response) => {
  response.pipe(wkAudioIndexJson);
});
