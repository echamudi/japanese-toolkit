# Furigana

Fit kana text into Japanese writing.

## API

```ts
function fit(writingText: string, readingText: string): string | null;
```

- `writingText`: The japanese writing. Currently, it only accepts kanji, kana, and numbers.

- `readingText`: The reading of the inputted writing. Currently, it only accepts kana.

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

Pass `{ type: 'object' }` for getting tokens instead of string:

```js
console.log(fit('九段下', 'くだんした', { type: 'object' }));
// Output:
[
     { w: '九', r: 'く' },
     { w: '段', r: 'だん' },
     { w: '下', r: 'した' },
];

console.log(fit('勿来駅', 'なこそえき', { type: 'object' }));
// Output:
[
     { w: '勿来', r: 'なこそ' },
     { w: '駅', r: 'えき' },
];
```

Another input example with many of the readings don't exist in the dictionary:

```js
fit(
    '安居院と生明と安栖と馬酔木と東奥と旦来と流井と行町と五百蔵',
    'あぐいとあざみとあずまいとあせびとあちおくとあっそとあらいとあるきまちといおろい',
    { type: 'object' },
)
// Output:
[
  { w: '安', r: 'あ' },
  { w: '居', r: 'ぐ' },
  { w: '院', r: 'い' }, // Guessed
  { w: 'と', r: 'と' },
  { w: '生', r: 'あざ' }, // Guessed
  { w: '明', r: 'み' },
  { w: 'と', r: 'と' },
  { w: '安', r: 'あ' },
  { w: '栖', r: 'ずまい' }, // Guessed
  { w: 'と', r: 'と' },
  { w: '馬酔木', r: 'あせび' }, // Guessed
  { w: 'と', r: 'と' },
  { w: '東', r: 'あち' }, // Guessed
  { w: '奥', r: 'おく'},
  { w: 'と', r: 'と' },
  { w: '旦来', r: 'あっそ' }, // Guessed
  { w: 'と', r: 'と' },
  { w: '流', r: 'あら' }, // Guessed
  { w: '井', r: 'い' },
  { w: 'と', r: 'と' },
  { w: '行', r: 'あるき' }, // Guessed
  { w: '町', r: 'まち' },
  { w: 'と', r: 'と' },
  { w: '五', r: 'い' },
  { w: '百', r: 'お' },
  { w: '蔵', r: 'ろい' } // Guessed
]
```

## Use Case

This tool can be used when you have a list of Japanese writing and reading pairs and you want to link the readings to each character of the writings.

For example, the furigana column in the following table is generated from the strings in kanji and reading column by using this furigana tool.

<img src="https://raw.githubusercontent.com/echamudi/japanese-toolkit/master/images/japanese-db-furigana.png" alt="furigana usage in japanese db">

## Acknowledgements

- This repo contains reading definitions from KANJIDIC.

     Copyright The Electronic Dictionary Research and Development Group

     Creative Commons Attribution-ShareAlike Licence (V3.0)

## License

Copyright © 2020 [Ezzat Chamudi](https://github.com/echamudi)

Furigana code is licensed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/). Images, logos, docs, and articles in this project are released under [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/legalcode).

Libraries, dependencies, and tools used in this project are tied with their licenses.
