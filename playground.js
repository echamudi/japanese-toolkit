// Ignore this file, it's only used for trying functions

const fs = require('fs');
const { KanjidicUtil } = require('./lib');

function objectToJson(object, path, beautify = true) {
  /** @type {number} */
  const space = beautify ? 2 : 0;

  fs.writeFileSync(
    path,
    JSON.stringify(object, null, space),
    'utf8',
  );
}

const kanjidic = new KanjidicUtil('./kanjidic2.xml');

objectToJson(kanjidic.getKanjidicEntries(), './kanjidic.json');
