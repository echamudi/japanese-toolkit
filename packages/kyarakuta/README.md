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
kyarakuta.getBlockNames('みんな幸せ〜😆');
```
Output:
```js
[
  { char: 'み', block: 'Hiragana', subblock: 'Hiragana letters' },
  { char: 'ん', block: 'Hiragana', subblock: 'Hiragana letters' },
  { char: 'な', block: 'Hiragana', subblock: 'Hiragana letters' },
  { char: '幸', block: 'CJK Unified Ideographs', subblock: undefined },
  { char: 'せ', block: 'Hiragana', subblock: 'Hiragana letters' },
  { char: '〜', block: 'CJK Symbols and Punctuation', subblock: 'CJK punctuation' },
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

## License

Copyright © 2020 Ezzat Chamudi

Kyarakuta code is licensed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/). Images, logos, docs, and articles in this project are released under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

Libraries, dependencies, and tools used in this project are tied with their licenses.
