/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

'strict mode';

const assert = require('assert');
const kyarakuta = require('..');

describe('kyarakuta', () => {
    it('runs getBlockNames', () => {
        assert.deepStrictEqual(
            kyarakuta.getBlockNames('Hello! おはよう、田中さん！ 😁👋'),
            [
                {
                    char: 'H',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Uppercase Latin alphabet',
                },
                {
                    char: 'e',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Lowercase Latin alphabet',
                },
                {
                    char: 'l',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Lowercase Latin alphabet',
                },
                {
                    char: 'l',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Lowercase Latin alphabet',
                },
                {
                    char: 'o',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'Lowercase Latin alphabet',
                },
                {
                    char: '!',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'ASCII punctuation and symbols',
                },
                {
                    char: ' ',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'ASCII punctuation and symbols',
                },
                { char: 'お', block: 'Hiragana', subblock: 'Hiragana letters' },
                { char: 'は', block: 'Hiragana', subblock: 'Hiragana letters' },
                { char: 'よ', block: 'Hiragana', subblock: 'Hiragana letters' },
                { char: 'う', block: 'Hiragana', subblock: 'Hiragana letters' },
                {
                    char: '、',
                    block: 'CJK Symbols and Punctuation',
                    subblock: 'CJK symbols and punctuation',
                },
                { char: '田', block: 'CJK Unified Ideographs', subblock: undefined },
                { char: '中', block: 'CJK Unified Ideographs', subblock: undefined },
                { char: 'さ', block: 'Hiragana', subblock: 'Hiragana letters' },
                { char: 'ん', block: 'Hiragana', subblock: 'Hiragana letters' },
                {
                    char: '！',
                    block: 'Halfwidth and Fullwidth Forms',
                    subblock: 'Fullwidth ASCII variants',
                },
                {
                    char: ' ',
                    block: 'C0 Controls and Basic Latin (Basic Latin)',
                    subblock: 'ASCII punctuation and symbols',
                },
                { char: '😁', block: 'Emoticons', subblock: 'Faces' },
                {
                    char: '👋',
                    block: 'Miscellaneous Symbols and Pictographs',
                    subblock: 'Hand symbols',
                },
            ],
        );

        // Extremes
        assert.deepStrictEqual(
            kyarakuta.getBlockNames(''),
            [],
        );
    });

    it('runs some', () => {
        assert.deepStrictEqual(kyarakuta.some('A 食 🧐', [
            {
                block: 'C0 Controls and Basic Latin (Basic Latin)',
                subblock: undefined, // 'undefined' means any subblock
            },
        ]), true);

        assert.deepStrictEqual(kyarakuta.some('abcあいう', [
            {
                block: 'Hiragana',
                subblock: 'Hiragana letters',
            },
        ]), true);

        assert.deepStrictEqual(kyarakuta.some('abcあいう', [
            {
                block: 'Arabic',
                subblock: undefined,
            },
        ]), false);

        assert.deepStrictEqual(kyarakuta.some('アパート', [
            { block: 'Hiragana' },
            { block: 'Katakana' },
        ]), true);

        // Extremes
        assert.deepStrictEqual(kyarakuta.some('アパート', []), true);
        assert.deepStrictEqual(kyarakuta.some('', []), true);
        assert.deepStrictEqual(kyarakuta.some('', [
            { block: 'Hiragana' },
            { block: 'Katakana' },
        ]), true);
    });

    it('runs every', () => {
        assert.deepStrictEqual(kyarakuta.every('アパート', [
            { block: 'Hiragana' },
            { block: 'Katakana' },
        ]), true);

        assert.deepStrictEqual(kyarakuta.every('アパート Apartment', [
            { block: 'Hiragana' },
            { block: 'Katakana' },
        ]), false);

        assert.deepStrictEqual(kyarakuta.every('Aa食', [
            {
                block: undefined, // 'undefined' means any block
                subblock: 'Uppercase Latin alphabet',
            },
            {
                block: undefined,
                subblock: 'Lowercase Latin alphabet',
            },
        ]), false);

        assert.deepStrictEqual(kyarakuta.every('ABcd', [
            {
                subblock: 'Uppercase Latin alphabet',
            },
            {
                subblock: 'Lowercase Latin alphabet',
            },
        ]), true);

        // Extremes Test
        assert.deepStrictEqual(kyarakuta.every('AB 穂', []), true);
        assert.deepStrictEqual(kyarakuta.every('', [
            {
                subblock: 'Uppercase Latin alphabet',
            },
            {
                subblock: 'Lowercase Latin alphabet',
            },
        ]), true);
        assert.deepStrictEqual(kyarakuta.every('', [
            { block: 'Hiragana' },
            { block: 'Katakana' },
        ]), true);
    });

    it('runs isKana', () => {
        assert.deepStrictEqual(kyarakuta.isKana('アパート'), true);
        assert.deepStrictEqual(kyarakuta.isKana('これはアパートです'), true);
        assert.deepStrictEqual(kyarakuta.isKana('アパート Apartment'), false);
        assert.deepStrictEqual(kyarakuta.isKana('お願い'), false);
        assert.deepStrictEqual(kyarakuta.isKana(''), true);

        // Spaces are not allowed
        assert.deepStrictEqual(kyarakuta.isKana(' '), false);
        assert.deepStrictEqual(kyarakuta.isKana('　'), false);
    });

    it('runs isCJK', () => {
        assert.deepStrictEqual(kyarakuta.isCJK('全国'), true);
        assert.deepStrictEqual(kyarakuta.isCJK('𠚢𠀋'), true);
        assert.deepStrictEqual(kyarakuta.isCJK(''), true);
        assert.deepStrictEqual(kyarakuta.isCJK('a'), false);
        assert.deepStrictEqual(kyarakuta.isCJK('はよ'), false);
        assert.deepStrictEqual(kyarakuta.isCJK('全国は'), false);
        assert.deepStrictEqual(kyarakuta.isCJK('　'), false);
    });

    it('runs isJapanese', () => {
        assert.deepStrictEqual(kyarakuta.isJapanese('全国は'), true);
        assert.deepStrictEqual(kyarakuta.isJapanese('このハンバーガはめっちゃうまい'), true);
        assert.deepStrictEqual(kyarakuta.isJapanese('すごい！'), false);
        assert.deepStrictEqual(kyarakuta.isJapanese('・・！！'), false);
        assert.deepStrictEqual(kyarakuta.isJapanese('　'), false);
        assert.deepStrictEqual(kyarakuta.isJapanese('Hello'), false);
        assert.deepStrictEqual(kyarakuta.isJapanese('Hello世界'), false);
    });

    describe('kana converter', () => {
        it('passes basic conversion', () => {
            assert.deepStrictEqual(kyarakuta.toHiragana('インドネシア'), 'いんどねしあ');
            assert.deepStrictEqual(kyarakuta.toKatakana('いんどねしあ'), 'インドネシア');
            assert.deepStrictEqual(kyarakuta.toHiragana('じゃかるた'), 'じゃかるた');
            assert.deepStrictEqual(kyarakuta.toKatakana('ジャカルタ'), 'ジャカルタ');
            assert.deepStrictEqual(kyarakuta.toHiragana('ばー'), 'ばー');
            assert.deepStrictEqual(kyarakuta.toKatakana('バー'), 'バー');
            assert.deepStrictEqual(kyarakuta.toHiragana('コレはおいしい'), 'これはおいしい');
            assert.deepStrictEqual(kyarakuta.toKatakana('コレはおいしい'), 'コレハオイシイ');
        });

        it('converts katakana dash to vowel in toHiragana conversion', () => {
            // Convert Katakana dash to vowel
            assert.deepStrictEqual(kyarakuta.toHiragana('バー'), 'ばあ');
            assert.deepStrictEqual(kyarakuta.toHiragana('ジー'), 'じい');
            assert.deepStrictEqual(kyarakuta.toHiragana('グー'), 'ぐう');
            assert.deepStrictEqual(kyarakuta.toHiragana('ケー'), 'けえ');
            // Could be おお or おう. But we'll stick with the first one.
            assert.deepStrictEqual(kyarakuta.toHiragana('オー'), 'おお');

            // Should not convert letter one kanji
            assert.deepStrictEqual(kyarakuta.toHiragana('バ一'), 'ば一');
            assert.deepStrictEqual(kyarakuta.toHiragana('ジ一'), 'じ一');
            assert.deepStrictEqual(kyarakuta.toHiragana('グ一'), 'ぐ一');
            assert.deepStrictEqual(kyarakuta.toHiragana('ケ一'), 'け一');
            assert.deepStrictEqual(kyarakuta.toHiragana('オ一'), 'お一');

            // Should not convert if the original is hiragana
            assert.deepStrictEqual(kyarakuta.toHiragana('ばー'), 'ばー');
            assert.deepStrictEqual(kyarakuta.toHiragana('じー'), 'じー');
            assert.deepStrictEqual(kyarakuta.toHiragana('ぐー'), 'ぐー');
            assert.deepStrictEqual(kyarakuta.toHiragana('けー'), 'けー');
            assert.deepStrictEqual(kyarakuta.toHiragana('おー'), 'おー');
        });

        it('passes some random tests', () => {
            assert.deepStrictEqual(kyarakuta.toHiragana('食事用フォーク'), '食事用ふぉおく');
            assert.deepStrictEqual(kyarakuta.toHiragana('ABCリード'), 'ABCりいど');
            assert.deepStrictEqual(kyarakuta.toKatakana('とてもおいしい'), 'トテモオイシイ');
            assert.deepStrictEqual(kyarakuta.toKatakana('ABCりいど'), 'ABCリイド');
        });
    });
});
