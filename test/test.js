const assert = require('assert');
const furigana = require('..');

describe('fitObj', () => {
    it('passes single letter tests', () => {
        assert.deepStrictEqual(furigana.fit('く', 'く', { type: 'object' }), [
            { w: 'く', r: 'く' },
        ]);

        assert.deepStrictEqual(furigana.fit('コヤ', 'こや', { type: 'object' }), [
            { w: 'コヤ', r: 'こや' },
        ]);

        assert.deepStrictEqual(furigana.fit('食', 'しょく', { type: 'object' }), [
            { w: '食', r: 'しょく' },
        ]);

        assert.deepStrictEqual(furigana.fit('一', 'ひろし', { type: 'object' }), [
            { w: '一', r: 'ひろし' },
        ]);
    });

    it('passes null tests', () => {
        assert.deepStrictEqual(furigana.fit('ひ', 'は', { type: 'object' }), null);
        assert.deepStrictEqual(furigana.fit('はは', 'は', { type: 'object' }), null);
        assert.deepStrictEqual(furigana.fit('は', 'はた', { type: 'object' }), null);
    });

    it('passes multi-letter kanji letters', () => {
        assert.deepStrictEqual(furigana.fit('九段下', 'くだんした', { type: 'object' }), [
            { w: '九', r: 'く' },
            { w: '段', r: 'だん' },
            { w: '下', r: 'した' },
        ]);

        assert.deepStrictEqual(furigana.fit('軍畑駅', 'いくさばたえき', { type: 'object' }), [
            { w: '軍', r: 'いくさ' },
            { w: '畑', r: 'はた' },
            { w: '駅', r: 'えき' },
        ]);
    });

    it('passes merge kana tests', () => {
        assert.deepStrictEqual(furigana.fit('田中さんはすごいと思います', 'たなかさんはすごいとおもいます', { type: 'object' }), [
            { w: '田', r: 'た' },
            { w: '中', r: 'なか' },
            { w: 'さんはすごいと', r: 'さんはすごいと' },
            { w: '思', r: 'おも' },
            { w: 'います', r: 'います' },
        ]);
    });

    it('passes some basic tests', () => {
        assert.deepStrictEqual(furigana.fit('私は', 'わたしは', { type: 'object' }), [
            { w: '私', r: 'わたし' },
            { w: 'は', r: 'は' },
        ]);

        assert.deepStrictEqual(furigana.fit('彼女は一番です', 'かのじょはいちばんです', { type: 'object' }), [
            { w: '彼', r: 'かの' },
            { w: '女', r: 'じょ' },
            { w: 'は', r: 'は' },
            { w: '一', r: 'いち' },
            { w: '番', r: 'ばん' },
            { w: 'です', r: 'です' },
        ]);

        assert.deepStrictEqual(furigana.fit('一は一と行っています', 'よこいちはにのまえといっています', { type: 'object' }), [
            { w: '一', r: 'よこいち' },
            { w: 'は', r: 'は' },
            { w: '一', r: 'にのまえ' },
            { w: 'と', r: 'と' },
            { w: '行', r: 'い' },
            { w: 'っています', r: 'っています' },
        ]);
    });

    it('passes unmatched kanji tests', () => {
        assert.deepStrictEqual(furigana.fit('食一二三午後', 'しょくあいうえおごご', { type: 'object' }), [
            { w: '食', r: 'しょく' },
            { w: '一二三', r: 'あいうえお' },
            { w: '午', r: 'ご' },
            { w: '後', r: 'ご' },
        ]);

        assert.deepStrictEqual(furigana.fit('安足間駅と風合瀬駅はすごい', 'あんたろまえきとかそせえきはすごい', { type: 'object' }), [
            { w: '安', r: 'あん' },
            { w: '足', r: 'た' },
            { w: '間', r: 'ろま' },
            { w: '駅', r: 'えき' },
            { w: 'と', r: 'と' },
            { w: '風合', r: 'かそ' },
            { w: '瀬', r: 'せ' },
            { w: '駅', r: 'えき' },
            { w: 'はすごい', r: 'はすごい' },
        ]);
    });

    it('passes number tests', () => {
        assert.deepStrictEqual(furigana.fit('５０人', 'ごじゅうにん', { type: 'object' }), [
            { w: '５０', r: 'ごじゅう' },
            { w: '人', r: 'にん' },
        ]);

        assert.deepStrictEqual(furigana.fit('五十人', 'ごじゅうにん', { type: 'object' }), [
            { w: '五', r: 'ご' },
            { w: '十', r: 'じゅう' },
            { w: '人', r: 'にん' },
        ]);

        assert.deepStrictEqual(furigana.fit('50人', 'ごじゅうにん', { type: 'object' }), [
            { w: '50', r: 'ごじゅう' },
            { w: '人', r: 'にん' },
        ]);
    });

    it('passes long string tests', () => {
        assert.deepStrictEqual(
            furigana.fit(
                '田中さんは安足間駅と風合瀬駅と小牛田駅に行ったことがある',
                'たなかさんはあんたろまえきとかそせえきとこごたえきにいったことがある',
                { type: 'object' },
            ),
            [
                { w: '田', r: 'た' },
                { w: '中', r: 'なか' },
                { w: 'さんは', r: 'さんは' },
                { w: '安', r: 'あん' },
                { w: '足', r: 'た' },
                { w: '間', r: 'ろま' },
                { w: '駅', r: 'えき' },
                { w: 'と', r: 'と' },
                { w: '風合', r: 'かそ' },
                { w: '瀬', r: 'せ' },
                { w: '駅', r: 'えき' },
                { w: 'と', r: 'と' },
                { w: '小', r: 'こ' },
                { w: '牛', r: 'ご' },
                { w: '田', r: 'た' },
                { w: '駅', r: 'えき' },
                { w: 'に', r: 'に' },
                { w: '行', r: 'い' },
                { w: 'ったことがある', r: 'ったことがある' },
            ],
        );

        assert.deepStrictEqual(
            furigana.fit(
                '東江と審と安居院と生明と安栖と馬酔木と東奥と明父と旦来と流井と行町と雷と五百蔵',
                'あがりえとあきらとあぐいとあざみとあずまいとあせびとあちおくとあぢちとあっそとあらいとあるきまちといかづちといおろい',
                { type: 'object' },
            ),
            [
                { w: '東', r: 'あがり' }, { w: '江', r: 'え' },
                { w: 'と', r: 'と' }, { w: '審', r: 'あきら' },
                { w: 'と', r: 'と' }, { w: '安', r: 'あ' },
                { w: '居', r: 'ぐ' }, { w: '院', r: 'い' },
                { w: 'と', r: 'と' }, { w: '生', r: 'あざ' },
                { w: '明', r: 'み' }, { w: 'と', r: 'と' },
                { w: '安', r: 'あ' }, { w: '栖', r: 'ずまい' },
                { w: 'と', r: 'と' }, { w: '馬酔木', r: 'あせび' },
                { w: 'と', r: 'と' }, { w: '東', r: 'あち' },
                { w: '奥', r: 'おく' }, { w: 'と', r: 'と' },
                { w: '明', r: 'あ' }, { w: '父', r: 'ちち' },
                { w: 'と', r: 'と' }, { w: '旦来', r: 'あっそ' },
                { w: 'と', r: 'と' }, { w: '流', r: 'あら' },
                { w: '井', r: 'い' }, { w: 'と', r: 'と' },
                { w: '行', r: 'あるき' }, { w: '町', r: 'まち' },
                { w: 'と', r: 'と' }, { w: '雷', r: 'いかづち' },
                { w: 'と', r: 'と' }, { w: '五', r: 'い' },
                { w: '百', r: 'お' }, { w: '蔵', r: 'ろい' },
            ],
        );
    });

    it('passes long reading tests', () => {
        assert.deepStrictEqual(
            furigana.fit(
                '十十です',
                'かきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこです',
                { type: 'object' },
            ),
            [
                { w: '十', r: 'か' },
                {
                    w: '十',
                    r: 'きくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこ',
                },
                { w: 'です', r: 'です' },
            ],
        );
    });

    // Known issues
    // console.log(fitObj('今日50,000人がいます', 'きょうごじゅうまんにんがいます'));
    // console.log(fitObj('勿来駅', 'なこそ駅'));
});
