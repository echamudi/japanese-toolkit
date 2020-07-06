/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { fit } = require('..');

describe('fitObj', () => {
    it('passes single letter tests', () => {
        assert.deepStrictEqual(fit('く', 'く', { type: 'object' }), [
            { w: 'く', r: 'く' },
        ]);

        assert.deepStrictEqual(
            fit('く', 'く'),
            'く',
        );

        assert.deepStrictEqual(fit('コヤ', 'こや', { type: 'object' }), [
            { w: 'コヤ', r: 'こや' },
        ]);

        assert.deepStrictEqual(
            fit('コヤ', 'こや'),
            'コヤ',
        );

        assert.deepStrictEqual(fit('食', 'しょく', { type: 'object' }), [
            { w: '食', r: 'しょく' },
        ]);

        assert.deepStrictEqual(
            fit('食', 'しょく'),
            '食[しょく]',
        );

        assert.deepStrictEqual(fit('裕', 'ひろし', { type: 'object' }), [
            { w: '裕', r: 'ひろし' },
        ]);

        assert.deepStrictEqual(
            fit('裕', 'ひろし'),
            '裕[ひろし]',
        );
    });

    it('passes null tests', () => {
        assert.deepStrictEqual(fit('ひ', 'は', { type: 'object' }), null);
        assert.deepStrictEqual(fit('ひ', 'は'), null);
        assert.deepStrictEqual(fit('はは', 'は', { type: 'object' }), null);
        assert.deepStrictEqual(fit('はは', 'は'), null);
        assert.deepStrictEqual(fit('は', 'はた', { type: 'object' }), null);
        assert.deepStrictEqual(fit('は', 'はた'), null);
    });

    it('passes multi-letter kanji letters', () => {
        assert.deepStrictEqual(fit('九段下', 'くだんした', { type: 'object' }), [
            { w: '九', r: 'く' },
            { w: '段', r: 'だん' },
            { w: '下', r: 'した' },
        ]);

        assert.deepStrictEqual(
            fit('九段下', 'くだんした'),
            '九[く] 段[だん] 下[した]',
        );

        assert.deepStrictEqual(fit('軍畑駅', 'いくさばたえき', { type: 'object' }), [
            { w: '軍', r: 'いくさ' },
            { w: '畑', r: 'はた' },
            { w: '駅', r: 'えき' },
        ]);

        assert.deepStrictEqual(
            fit('軍畑駅', 'いくさばたえき'),
            '軍[いくさ] 畑[はた] 駅[えき]',
        );
    });

    it('passes merge kana tests', () => {
        assert.deepStrictEqual(fit('田中さんとボーブさんはすごいと思います', 'たなかさんとぼーぶさんはすごいとおもいます', { type: 'object' }), [
            { w: '田', r: 'た' },
            { w: '中', r: 'なか' },
            { w: 'さんとボーブさんはすごいと', r: 'さんとぼーぶさんはすごいと' },
            { w: '思', r: 'おも' },
            { w: 'います', r: 'います' },
        ]);

        assert.deepStrictEqual(
            fit('田中さんとボーブさんはすごいと思います', 'たなかさんとぼーぶさんはすごいとおもいます'),
            '田[た] 中[なか]さんとボーブさんはすごいと 思[おも]います',
        );
    });

    it('passes some basic tests', () => {
        assert.deepStrictEqual(fit('私は', 'わたしは', { type: 'object' }), [
            { w: '私', r: 'わたし' },
            { w: 'は', r: 'は' },
        ]);

        assert.deepStrictEqual(fit('彼女は一番です', 'かのじょはいちばんです', { type: 'object' }), [
            { w: '彼', r: 'かの' },
            { w: '女', r: 'じょ' },
            { w: 'は', r: 'は' },
            { w: '一', r: 'いち' },
            { w: '番', r: 'ばん' },
            { w: 'です', r: 'です' },
        ]);

        assert.deepStrictEqual(fit('一は一と行っています', 'よこいちはにのまえといっています', { type: 'object' }), [
            { w: '一', r: 'よこいち' },
            { w: 'は', r: 'は' },
            { w: '一', r: 'にのまえ' },
            { w: 'と', r: 'と' },
            { w: '行', r: 'い' },
            { w: 'っています', r: 'っています' },
        ]);
    });

    it('passes unmatched kanji tests', () => {
        assert.deepStrictEqual(fit('食一二三午後', 'しょくあいうえおごご', { type: 'object' }), [
            { w: '食', r: 'しょく' },
            { w: '一二三', r: 'あいうえお' },
            { w: '午', r: 'ご' },
            { w: '後', r: 'ご' },
        ]);

        assert.deepStrictEqual(
            fit('食一二三午後', 'しょくあいうえおごご'),
            '食[しょく] 一二三[あいうえお] 午[ご] 後[ご]',
        );

        assert.deepStrictEqual(fit('高輪ゲートウェイ駅と風合瀬駅は大きい', 'たかなわゲートウェイえきとかそせえきはおおきい', { type: 'object' }), [
            { w: '高', r: 'たか' },
            { w: '輪', r: 'なわ' },
            { w: 'ゲートウェイ', r: 'げえとうぇい' },
            { w: '駅', r: 'えき' },
            { w: 'と', r: 'と' },
            { w: '風合', r: 'かそ' },
            { w: '瀬', r: 'せ' },
            { w: '駅', r: 'えき' },
            { w: 'は', r: 'は' },
            { w: '大', r: 'おお' },
            { w: 'きい', r: 'きい' },
        ]);

        assert.deepStrictEqual(
            fit('高輪ゲートウェイ駅と風合瀬駅は大きい', 'たかなわゲートウェイえきとかそせえきはおおきい'),
            '高[たか] 輪[なわ]ゲートウェイ 駅[えき]と 風合[かそ] 瀬[せ] 駅[えき]は 大[おお]きい',
        );
    });

    it('passes number tests', () => {
        assert.deepStrictEqual(fit('５０人', 'ごじゅうにん', { type: 'object' }), [
            { w: '５０', r: 'ごじゅう' },
            { w: '人', r: 'にん' },
        ]);

        assert.deepStrictEqual(
            fit('５０人', 'ごじゅうにん'),
            '５０[ごじゅう] 人[にん]',
        );

        assert.deepStrictEqual(fit('五十人', 'ごじゅうにん', { type: 'object' }), [
            { w: '五', r: 'ご' },
            { w: '十', r: 'じゅう' },
            { w: '人', r: 'にん' },
        ]);

        assert.deepStrictEqual(
            fit('五十人', 'ごじゅうにん', { type: 'string' }),
            '五[ご] 十[じゅう] 人[にん]',
        );

        assert.deepStrictEqual(fit('50人', 'ごじゅうにん', { type: 'object' }), [
            { w: '50', r: 'ごじゅう' },
            { w: '人', r: 'にん' },
        ]);

        assert.deepStrictEqual(
            fit('50人', 'ごじゅうにん', { type: 'string' }),
            '50[ごじゅう] 人[にん]',
        );
    });

    it('passes long string tests', () => {
        assert.deepStrictEqual(
            fit(
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
            fit(
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

        assert.deepStrictEqual(
            fit(
                '東江と審と安居院と生明と安栖と馬酔木と東奥と明父と旦来と流井と行町と雷と五百蔵',
                'あがりえとあきらとあぐいとあざみとあずまいとあせびとあちおくとあぢちとあっそとあらいとあるきまちといかづちといおろい',
                { type: 'string' },
            ),
            '東[あがり] 江[え]と 審[あきら]と 安[あ] 居[ぐ] 院[い]と 生[あざ] 明[み]と 安[あ] 栖[ずまい]と 馬酔木[あせび]と 東[あち] 奥[おく]と 明[あ] 父[ちち]と 旦来[あっそ]と 流[あら] 井[い]と 行[あるき] 町[まち]と 雷[いかづち]と 五[い] 百[お] 蔵[ろい]',
        );
    });

    it('passes long reading tests', () => {
        assert.deepStrictEqual(
            fit(
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
    // console.log(fit('学校に１０００人がいます', 'がっこうにせんにんがいます'))/
});
