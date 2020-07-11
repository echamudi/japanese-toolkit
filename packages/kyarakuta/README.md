# Kyarakuta

Get character unicode block and sublock names of a string.

## Example

```js
const kyarakuta = require('');

console.log(kyarakuta.getBlockNames('みんな幸せ〜😆'));
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

## License

Copyright © 2020 Ezzat Chamudi

Kyarakuta code is licensed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/). Images, logos, docs, and articles in this project are released under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

Libraries, dependencies, and tools used in this project are tied with their licenses.
