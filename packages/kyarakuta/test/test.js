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

        // Extremes
        assert.deepStrictEqual(
            kyarakuta.getBlockNames(''),
            []
        );
    });

    it('runs some', () => {
        assert.deepStrictEqual(kyarakuta.some('A 食 🧐', [
            {
                block: 'C0 Controls and Basic Latin (Basic Latin)',
                subblock: undefined     // 'undefined' means any subblock
            }
        ]), true);

        assert.deepStrictEqual(kyarakuta.some('abcあいう', [
            {
                block: 'Hiragana',
                subblock: 'Hiragana letters'
            }
        ]), true);

        assert.deepStrictEqual(kyarakuta.some('abcあいう', [
            {
                block: 'Arabic',
                subblock: undefined
            }
        ]), false);

        assert.deepStrictEqual(kyarakuta.some('アパート', [
            { block: 'Hiragana' },
            { block: 'Katakana' }
        ]), true);

        // Extremes
        assert.deepStrictEqual(kyarakuta.some('アパート', []), true);
        assert.deepStrictEqual(kyarakuta.some('', []), true);
        assert.deepStrictEqual(kyarakuta.some('', [
            { block: 'Hiragana' },
            { block: 'Katakana' }
        ]), true);
    });

    it('runs every', () => {
        assert.deepStrictEqual(kyarakuta.every('アパート', [
            { block: 'Hiragana' },
            { block: 'Katakana' }
        ]), true);

        assert.deepStrictEqual(kyarakuta.every('アパート Apartment', [
            { block: 'Hiragana' },
            { block: 'Katakana' }
        ]), false);

        assert.deepStrictEqual(kyarakuta.every('Aa食', [
            {
                block: undefined,    // 'undefined' means any block
                subblock: 'Uppercase Latin alphabet'
            },
            {
                block: undefined,
                subblock: 'Lowercase Latin alphabet'
            }
        ]), false);

        assert.deepStrictEqual(kyarakuta.every('ABcd', [
            {
                subblock: 'Uppercase Latin alphabet'
            },
            {
                subblock: 'Lowercase Latin alphabet'
            }
        ]), true);

        // Extremes Test
        assert.deepStrictEqual(kyarakuta.every('AB 穂', []), true);
        assert.deepStrictEqual(kyarakuta.every('',  [
            {
                subblock: 'Uppercase Latin alphabet'
            },
            {
                subblock: 'Lowercase Latin alphabet'
            }
        ]), true);
        assert.deepStrictEqual(kyarakuta.every('', [
            { block: 'Hiragana' },
            { block: 'Katakana' }
        ]), true);
    });
});
