# Kanji

<img src="https://github.com/echamudi/japanese-toolkit/workflows/Japanese%20Toolkit%20JS/badge.svg">

With Kanji you can:

- Get readings information of kanji characters.
- Get kanji characters in an array based on categorization.
- Get kanji composition tree.

---

<p align="center">
  <a href="https://github.com/echamudi/japanese-toolkit/"><img src="https://raw.githubusercontent.com/echamudi/japanese-toolkit/master/images/japanese-toolkit.svg" alt="Japanese Toolkit Logo" width="160" height="128"></a>
  <br><br>
  <p  align="center">
This package is part of <a href="https://github.com/echamudi/japanese-toolkit/">Japanese Toolkit JS</a> suite.</p>
</p>

---

## Demo

<a href="https://repl.it/@echamudi/demo-kanji" target="_blank">
    <img width="250" height="40" src="https://raw.githubusercontent.com/echamudi/badges/master/try-now-replit-light%402x.png" alt="Try now in Repl.it">
</a>

## Usage as Module

### Kanji Readings

Get the readings of kanji

```js
const kanji = require('kanji');

kanji.readings('食')
/* Result:
{
  on: [ 'ショク', 'ジキ' ],
  kun: [ 'く.う', 'く.らう', 'た.べる', 'は.む' ],
  nanori: [ 'ぐい' ]
}
*/
```

### Kanji Collections

```js
// Kanji Kentei
console.log(kanji.kanken.lv10());
console.log(kanji.kanken.lv09());
console.log(kanji.kanken.lv08());
console.log(kanji.kanken.lv07());
console.log(kanji.kanken.lv06());
console.log(kanji.kanken.lv05());
console.log(kanji.kanken.lv04());
console.log(kanji.kanken.lv03());
console.log(kanji.kanken.lv02pre());
console.log(kanji.kanken.lv02());
console.log(kanji.kanken.lv01pre());
console.log(kanji.kanken.lv01());

// Old JLPT
console.log(kanji.jlpt.old4());
console.log(kanji.jlpt.old3());
console.log(kanji.jlpt.old2());
console.log(kanji.jlpt.old1());

// New JLPT
console.log(kanji.jlpt.n5());
console.log(kanji.jlpt.n4());
console.log(kanji.jlpt.n3());
console.log(kanji.jlpt.n2());
console.log(kanji.jlpt.n1());

// Kyouiku Kanji
console.log(kanji.grade.g01());
console.log(kanji.grade.g02());
console.log(kanji.grade.g03());
console.log(kanji.grade.g04());
console.log(kanji.grade.g05());
console.log(kanji.grade.g06());
console.log(kanji.grade.g08()); // Remaining of Joyo Kanji
console.log(kanji.grade.g09()); // Jinmeiyo Kanji
console.log(kanji.grade.g10()); // Variant of Joyo Kanji

// Frequency 1-2501 Kanji taken from KANJIDIC
// The frequency list is made by Alexandre Girardi
console.log(kanji.freq());

// 13,108 kanji from KANJIDIC (JIS X 0208-1998, JIS X 0212-1990, JIS X 0213-2012())
console.log(kanji.all());

```

The kanji characters in the frequency list array are ordered from most popular to least popular.
The rest of arrays are not ordered.

### Related Kanji

```js
console.log(kanji.related.antonyms());
console.log(kanji.related.lookalikes());
console.log(kanji.related.synonyms());
console.log(kanji.related.variants());
```

### Kanji Composition Tree

```js
const kanji = require('kanji');

console.log(kanji.kanjiTree('国'));

/* Result:
{
    element: "国",
    g: [{
            element: "囗"
        },
        {
            element: "玉",
            g: [{
                    element: "王"
                },
                {
                    element: "丶"
                }
            ]
        },
        {
            element: "囗"
        }
    ]
}
*/
```

### Notes

Everytime you call the functions above, it reads the json file from the data or dist folder.
If you call the same function frequently, please use memoization techniques to reduce file read.

## Usage as CLI Tool

Install kanji tool
```
npm install -g kanji
```

### Show kanji Tree

```sh
kanji-tree 焼き鳥
```

Output
```
├─ 焼
│  ├─ 火
│  └─ 尭
│     ├─ 卉
│     │  ├─ 十
│     │  └─ 廾
│     │     ├─ 十
│     │     ├─ 丿
│     │     └─ 十
│     └─ ？
│        ├─ 兀
│        │  └─ 一
│        └─ 儿
│           └─ 丿
├─ ？
└─ 鳥
   └─ 灬
```

## Development

### Preparation

```
npm install
npm run download-source
npm run extract-data
```

### Watch
```
npm run watch
```

### Testing
```
npm test
```

### Compile
```
npm run compile
```

## Acknowledgment

The items are collected from following sources:

- JLPT Study by Peter van der Woude https://jlptstudy.net
- Jonathan Waller JLPT Kanji List http://www.tanos.co.uk/jlpt/
- KANJIDIC Project http://www.edrdg.org/wiki/index.php/KANJIDIC_Project
- 日本漢字能力検定級別漢字表 https://www.kanken.or.jp/kanken/outline/degree.html
- KanjiVG by Ulrich Apel https://github.com/KanjiVG/kanjivg
- Kanjium by Uros Ozvatic https://github.com/mifunetoshiro/kanjium

## Authors

* **Ezzat Chamudi** - [echamudi](https://github.com/echamudi)

See also the list of [contributors](https://github.com/echamudi/kanji/graphs/contributors) who participated in this project.

## License

Copyright © 2020 Ezzat Chamudi

Kanji code is licensed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/). Images, logos, docs, and articles in this project are released under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

Libraries, dependencies, and tools used in this project are tied with their licenses.

