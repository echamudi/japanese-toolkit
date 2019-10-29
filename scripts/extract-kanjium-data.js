const csvtojson = require("csvtojson");

(async () => {
    const antonyms = (/** @type {Array<Object.<string, string>>} */ await csvtojson({
        delimiter: '\t',
        noheader: 'true',
        headers: [
            "key",
            "val",
        ],
    })
    .fromFile(__dirname + '/../source/kanjium-antonyms.txt'))
    .map((el) => {
        return {
            key: el.key,
            val: el.val.split(',')
        }
    });
    
    console.log(antonyms);
})();
