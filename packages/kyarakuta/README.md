# Kyarakuta

Get character unicode block and sublock names of a string.

## Installation

```
npm install kyarakuta
```
```js
const kyarakuta = require('kyarakuta');
```

## APIs

### Get Unicode block names

```js
kyarakuta.getBlockNames('Abc　食べ物 اهلا 😆');
```

Output:
```js
[
  { char: 'A', block: 'C0 Controls and Basic Latin (Basic Latin)', subblock: 'Uppercase Latin alphabet' },
  { char: 'b', block: 'C0 Controls and Basic Latin (Basic Latin)', subblock: 'Lowercase Latin alphabet' },
  { char: 'c', block: 'C0 Controls and Basic Latin (Basic Latin)', subblock: 'Lowercase Latin alphabet' },
  { char: '　', block: 'CJK Symbols and Punctuation', subblock: 'CJK symbols and punctuation'  },
  { char: '食', block: 'CJK Unified Ideographs', subblock: undefined },
  { char: 'べ', block: 'Hiragana', subblock: 'Hiragana letters' },
  { char: '物', block: 'CJK Unified Ideographs', subblock: undefined },
  { char: ' ', block: 'C0 Controls and Basic Latin (Basic Latin)', subblock: 'ASCII punctuation and symbols' },
  { char: 'ا', block: 'Arabic', subblock: 'Based on ISO 8859-6' },
  { char: 'ه', block: 'Arabic', subblock: 'Based on ISO 8859-6' },
  { char: 'ل', block: 'Arabic', subblock: 'Based on ISO 8859-6' },
  { char: 'ا', block: 'Arabic', subblock: 'Based on ISO 8859-6' },
  { char: ' ', block: 'C0 Controls and Basic Latin (Basic Latin)', subblock: 'ASCII punctuation and symbols' },
  { char: '😆', block: 'Emoticons', subblock: 'Faces' }
]
```

Block names are acquired from the official Unicode Names List 13.0.

### Some

At least one character must satisfy the one of the inputted blocks.

```js
kyarakuta.some('A 食 🧐', [
  {
    block: 'C0 Controls and Basic Latin (Basic Latin)', 
    subblock: undefined     // 'undefined' means any subblock
  }
]);
// Output: true

kyarakuta.some('abcあいう', [
  {
    block: 'Hiragana', 
    subblock: 'Hiragana letters'
  }
]);
// Output: true

kyarakuta.some('abcあいう', [
  {
    block: 'Arabic',
    subblock: undefined
  }
]);
// Output: false

kyarakuta.some('アパート', [
  { block: 'Hiragana' },
  { block: 'Katakana' }
]);
// Output: true
```

### Every

All characters must satisfy at least one of the inputted blocks.

```js
kyarakuta.every('اهلا', [
  { block: 'Arabic' }
]);
// Output: true

kyarakuta.every('アパート', [
  { block: 'Hiragana' },
  { block: 'Katakana' }
]);
// Output: true

kyarakuta.every('アパート', [
  { block: 'Hiragana' },
  { block: 'Katakana' }
]);
// Output: true

kyarakuta.every('アパート Apartment', [
  { block: 'Hiragana' },
  { block: 'Katakana' }
]);
// Output: false

kyarakuta.every('Aa食', [
  {
    block: undefined,    // 'undefined' means any block
    subblock: 'Uppercase Latin alphabet'
  },
  {
    block: undefined,
    subblock: 'Lowercase Latin alphabet'
  }
]);
// Output: false

kyarakuta.every('ABcd', [
  {
    subblock: 'Uppercase Latin alphabet'
  },
  {
    subblock: 'Lowercase Latin alphabet'
  }
]);
// Output: true
```

## Japanese Specific Utilities

### Is Kana

Check if all characters in a string is kana.

```js
kyarakuta.isKana('アパート'); // true;
kyarakuta.isKana('これはアパートです'); // true
kyarakuta.isKana('アパート Apartment'), // false
```

Kana is all characters within "Hiragana" and "Katakana" blocks.

### Is CJK

Check if all characters in a string belong to CJK blocks.

```js
kyarakuta.isCJK('全国'); // true
kyarakuta.isCJK('𠚢𠀋'); // true
kyarakuta.isCJK(''); // true
kyarakuta.isCJK('a'); // false
kyarakuta.isCJK('はよ'); // false
kyarakuta.isCJK('全国は'); // false
```

### Is Japanese

Japanese script mixes hiragana, katakana, kanji, and romaji.
But in this function, 'isJapanese' checks whether a string only contains Kana and CJK characters.
No spaces and punctuations are allowed.

```js
kyarakuta.isJapanese('全国は'); // true
kyarakuta.isJapanese('このハンバーガはめっちゃうまい'); // true
kyarakuta.isJapanese('すごい！'); // false, contains punctuation
kyarakuta.isJapanese('これは　すごい') ;// false, contains space
kyarakuta.isJapanese('Hello'); // false
kyarakuta.isJapanese('Hello世界'); // false
```

### To Hiragana and To Katakana

Converts katakana to hiragana or hiragana to katakana

```js
kyarakuta.toHiragana('インドネシア'); // いんどねしあ
kyarakuta.toKatakana('いんどねしあ'); // インドネシア
```

## License

Copyright © 2020 Ezzat Chamudi

Kyarakuta code is licensed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/). Images, logos, docs, and articles in this project are released under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

Libraries, dependencies, and tools used in this project are tied with their licenses.
