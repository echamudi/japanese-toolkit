/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

'strict mode';

const assert = require('assert');
const kyarakuta = require('..');

describe('kyarakuta', function () {
    it('runs getBlockNames', function () {
        assert.deepStrictEqual(
            kyarakuta.getBlockNames('Hello! おはよう、田中さん！ 😁👋'),
            [
                {
                    char: 'H',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Uppercase Latin alphabet'
                },
                {
                    char: 'e',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Lowercase Latin alphabet'
                },
                {
                    char: 'l',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Lowercase Latin alphabet'
                },
                {
                    char: 'l',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Lowercase Latin alphabet'
                },
                {
                    char: 'o',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Lowercase Latin alphabet'
                },
                {
                    char: '!',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'ASCII punctuation and symbols'
                },
                {
                    char: ' ',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'ASCII punctuation and symbols'
                },
                { char: 'お', block: 'Hiragana', subblock: 'Hiragana letters' },
                { char: 'は', block: 'Hiragana', subblock: 'Hiragana letters' },
                { char: 'よ', block: 'Hiragana', subblock: 'Hiragana letters' },
                { char: 'う', block: 'Hiragana', subblock: 'Hiragana letters' },
                {
                    char: '、',
                    block: 'CJK Symbols and Punctuation',
                    subblock: 'CJK symbols and punctuation'
                },
                { char: '田', block: 'CJK Unified Ideographs', subblock: undefined },
                { char: '中', block: 'CJK Unified Ideographs', subblock: undefined },
                { char: 'さ', block: 'Hiragana', subblock: 'Hiragana letters' },
                { char: 'ん', block: 'Hiragana', subblock: 'Hiragana letters' },
                {
                    char: '！',
                    block: 'Halfwidth and Fullwidth Forms',
                    subblock: 'Fullwidth ASCII variants'
                },
                {
                    char: ' ',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'ASCII punctuation and symbols'
                },
                { char: '😁', block: 'Emoticons', subblock: 'Faces' },
                {
                    char: '👋',
                    block: 'Miscellaneous Symbols and Pictographs',
                    subblock: 'Hand symbols'
                }
            ]
        );
    });
});
