# Furigana

Fit kana text into Japanese writing.

## API

```ts
function fit(writing: string, reading: string): string | null;
```

- `writing`: The japanese writing. Currently, it only accepts kanji, kana, and numbers.

- `reading`: The reading of the inputted writing. Currently, it only accepts kana.

## Examples

```js
const { fit } = require('furigana');

console.log(fit('行っています', 'いっています'));
// 行[い]っています

console.log(fit('行っています', 'おこなっています'));
// 行[おこな]っています

console.log(fit('轟駅にいっています', 'どめきえきにいっています'));
// 轟[どめき] 駅[えき]にいっています
```

The function will guess the reading placement if the reading is not in the dictionary.

```js
console.log(fit('一社長と四十物谷さんは武漢市に住んでいます', 'にのまえしゃちょうとあいものやさんはうーはんしにすんでいます'));
// 一[にのまえ] 社[しゃ] 長[ちょう]と 四[あ] 十[い] 物[もの] 谷[や]さんは 武[う] 漢[ーはん] 市[し]に 住[す]んでいます

console.log(fit('一社長と十先生', 'にのまえしゃちょうとつなしせんせい'));
// 一[にのまえ] 社[しゃ] 長[ちょう]と 十[つなし] 先[せん] 生[せい]
```

Pass `{ type: 'object' }` for getting tokens instead of string.

```js
console.log(fit('九段下', 'くだんした', { type: 'object' }));
/*
[
     { w: '九', r: 'く' },
     { w: '段', r: 'だん' },
     { w: '下', r: 'した' }
]
*/
```

## Acknowledgements

- This repo contains reading definitions from KANJIDIC.

     Copyright The Electronic Dictionary Research and Development Group

     Creative Commons Attribution-ShareAlike Licence (V3.0)

## License

Copyright © 2020 Ezzat Chamudi

MPL-2.0