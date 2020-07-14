/* eslint-disable no-underscore-dangle */

const fs = require('fs');

const _ノ_ = null;
const _正_ = true;
// const _不_ = false;

let kanaArray = [
    ['ぁ', { hiragana: _正_, katakana: 'ァ', vocal: 'あ' }],
    ['あ', { hiragana: _正_, katakana: 'ア', vocal: 'あ' }],
    ['ぃ', { hiragana: _正_, katakana: 'ィ', vocal: 'い' }],
    ['い', { hiragana: _正_, katakana: 'イ', vocal: 'い' }],
    ['ぅ', { hiragana: _正_, katakana: 'ゥ', vocal: 'う' }],
    ['う', { hiragana: _正_, katakana: 'ウ', vocal: 'う' }],
    ['ぇ', { hiragana: _正_, katakana: 'ェ', vocal: 'え' }],
    ['え', { hiragana: _正_, katakana: 'エ', vocal: 'え' }],
    ['ぉ', { hiragana: _正_, katakana: 'ォ', vocal: 'お' }],
    ['お', { hiragana: _正_, katakana: 'オ', vocal: 'お' }],
    ['か', { hiragana: _正_, katakana: 'カ', vocal: 'あ' }],
    ['が', { hiragana: _正_, katakana: 'ガ', vocal: 'あ' }],
    ['き', { hiragana: _正_, katakana: 'キ', vocal: 'い' }],
    ['ぎ', { hiragana: _正_, katakana: 'ギ', vocal: 'い' }],
    ['く', { hiragana: _正_, katakana: 'ク', vocal: 'う' }],
    ['ぐ', { hiragana: _正_, katakana: 'グ', vocal: 'う' }],
    ['け', { hiragana: _正_, katakana: 'ケ', vocal: 'え' }],
    ['げ', { hiragana: _正_, katakana: 'ゲ', vocal: 'え' }],
    ['こ', { hiragana: _正_, katakana: 'コ', vocal: 'お' }],
    ['ご', { hiragana: _正_, katakana: 'ゴ', vocal: 'お' }],
    ['さ', { hiragana: _正_, katakana: 'サ', vocal: 'あ' }],
    ['ざ', { hiragana: _正_, katakana: 'ザ', vocal: 'あ' }],
    ['し', { hiragana: _正_, katakana: 'シ', vocal: 'い' }],
    ['じ', { hiragana: _正_, katakana: 'ジ', vocal: 'い' }],
    ['す', { hiragana: _正_, katakana: 'ス', vocal: 'う' }],
    ['ず', { hiragana: _正_, katakana: 'ズ', vocal: 'う' }],
    ['せ', { hiragana: _正_, katakana: 'セ', vocal: 'え' }],
    ['ぜ', { hiragana: _正_, katakana: 'ゼ', vocal: 'え' }],
    ['そ', { hiragana: _正_, katakana: 'ソ', vocal: 'お' }],
    ['ぞ', { hiragana: _正_, katakana: 'ゾ', vocal: 'お' }],
    ['た', { hiragana: _正_, katakana: 'タ', vocal: 'あ' }],
    ['だ', { hiragana: _正_, katakana: 'ダ', vocal: 'あ' }],
    ['ち', { hiragana: _正_, katakana: 'チ', vocal: 'い' }],
    ['ぢ', { hiragana: _正_, katakana: 'ヂ', vocal: 'い' }],
    ['っ', { hiragana: _正_, katakana: 'ッ', vocal: _ノ_ }],
    ['つ', { hiragana: _正_, katakana: 'ツ', vocal: 'う' }],
    ['づ', { hiragana: _正_, katakana: 'ヅ', vocal: 'う' }],
    ['て', { hiragana: _正_, katakana: 'テ', vocal: 'え' }],
    ['で', { hiragana: _正_, katakana: 'デ', vocal: 'え' }],
    ['と', { hiragana: _正_, katakana: 'ト', vocal: 'お' }],
    ['ど', { hiragana: _正_, katakana: 'ド', vocal: 'お' }],
    ['な', { hiragana: _正_, katakana: 'ナ', vocal: 'あ' }],
    ['に', { hiragana: _正_, katakana: 'ニ', vocal: 'い' }],
    ['ぬ', { hiragana: _正_, katakana: 'ヌ', vocal: 'う' }],
    ['ね', { hiragana: _正_, katakana: 'ネ', vocal: 'え' }],
    ['の', { hiragana: _正_, katakana: 'ノ', vocal: 'お' }],
    ['は', { hiragana: _正_, katakana: 'ハ', vocal: 'あ' }],
    ['ば', { hiragana: _正_, katakana: 'バ', vocal: 'あ' }],
    ['ぱ', { hiragana: _正_, katakana: 'パ', vocal: 'あ' }],
    ['ひ', { hiragana: _正_, katakana: 'ヒ', vocal: 'い' }],
    ['び', { hiragana: _正_, katakana: 'ビ', vocal: 'い' }],
    ['ぴ', { hiragana: _正_, katakana: 'ピ', vocal: 'い' }],
    ['ふ', { hiragana: _正_, katakana: 'フ', vocal: 'う' }],
    ['ぶ', { hiragana: _正_, katakana: 'ブ', vocal: 'う' }],
    ['ぷ', { hiragana: _正_, katakana: 'プ', vocal: 'う' }],
    ['へ', { hiragana: _正_, katakana: 'ヘ', vocal: 'え' }],
    ['べ', { hiragana: _正_, katakana: 'ベ', vocal: 'え' }],
    ['ぺ', { hiragana: _正_, katakana: 'ペ', vocal: 'え' }],
    ['ほ', { hiragana: _正_, katakana: 'ホ', vocal: 'お' }],
    ['ぼ', { hiragana: _正_, katakana: 'ボ', vocal: 'お' }],
    ['ぽ', { hiragana: _正_, katakana: 'ポ', vocal: 'お' }],
    ['ま', { hiragana: _正_, katakana: 'マ', vocal: 'あ' }],
    ['み', { hiragana: _正_, katakana: 'ミ', vocal: 'い' }],
    ['む', { hiragana: _正_, katakana: 'ム', vocal: 'う' }],
    ['め', { hiragana: _正_, katakana: 'メ', vocal: 'え' }],
    ['も', { hiragana: _正_, katakana: 'モ', vocal: 'お' }],
    ['ゃ', { hiragana: _正_, katakana: 'ャ', vocal: 'あ' }],
    ['や', { hiragana: _正_, katakana: 'ヤ', vocal: 'あ' }],
    ['ゅ', { hiragana: _正_, katakana: 'ュ', vocal: 'う' }],
    ['ゆ', { hiragana: _正_, katakana: 'ユ', vocal: 'う' }],
    ['ょ', { hiragana: _正_, katakana: 'ョ', vocal: 'お' }],
    ['よ', { hiragana: _正_, katakana: 'ヨ', vocal: 'お' }],
    ['ら', { hiragana: _正_, katakana: 'ラ', vocal: 'あ' }],
    ['り', { hiragana: _正_, katakana: 'リ', vocal: 'い' }],
    ['る', { hiragana: _正_, katakana: 'ル', vocal: 'う' }],
    ['れ', { hiragana: _正_, katakana: 'レ', vocal: 'え' }],
    ['ろ', { hiragana: _正_, katakana: 'ロ', vocal: 'お' }],
    ['ゎ', { hiragana: _正_, katakana: 'ヮ', vocal: 'あ' }],
    ['わ', { hiragana: _正_, katakana: 'ワ', vocal: 'あ' }],
    ['ゐ', { hiragana: _正_, katakana: 'ヰ', vocal: 'い' }],
    ['ゑ', { hiragana: _正_, katakana: 'ヱ', vocal: 'え' }],
    ['を', { hiragana: _正_, katakana: 'ヲ', vocal: 'お' }],
    ['ん', { hiragana: _正_, katakana: 'ン', vocal: _ノ_ }],
    ['ゔ', { hiragana: _正_, katakana: 'ヴ', vocal: 'う' }],
    ['ゕ', { hiragana: _正_, katakana: 'ヵ', vocal: 'あ' }],
    ['ゖ', { hiragana: _正_, katakana: 'ヶ', vocal: 'え' }],
    ['゛', { hiragana: _正_, katakana: _ノ_, vocal: _ノ_ }],
    ['゜', { hiragana: _正_, katakana: _ノ_, vocal: _ノ_ }],
    ['ゝ', { hiragana: _正_, katakana: 'ヽ', vocal: _ノ_ }],
    ['ゞ', { hiragana: _正_, katakana: 'ヾ', vocal: _ノ_ }],
    ['ゟ', { hiragana: _正_, katakana: _ノ_, vocal: _ノ_ }],

    ['゠', { hiragana: _ノ_, katakana: _正_, vocal: _ノ_ }],
    ['ァ', { hiragana: 'ぁ', katakana: _正_, vocal: 'あ' }],
    ['ア', { hiragana: 'あ', katakana: _正_, vocal: 'あ' }],
    ['ィ', { hiragana: 'ぃ', katakana: _正_, vocal: 'い' }],
    ['イ', { hiragana: 'い', katakana: _正_, vocal: 'い' }],
    ['ゥ', { hiragana: 'ぅ', katakana: _正_, vocal: 'う' }],
    ['ウ', { hiragana: 'う', katakana: _正_, vocal: 'う' }],
    ['ェ', { hiragana: 'ぇ', katakana: _正_, vocal: 'え' }],
    ['エ', { hiragana: 'え', katakana: _正_, vocal: 'え' }],
    ['ォ', { hiragana: 'ぉ', katakana: _正_, vocal: 'お' }],
    ['オ', { hiragana: 'お', katakana: _正_, vocal: 'お' }],
    ['カ', { hiragana: 'か', katakana: _正_, vocal: 'あ' }],
    ['ガ', { hiragana: 'が', katakana: _正_, vocal: 'あ' }],
    ['キ', { hiragana: 'き', katakana: _正_, vocal: 'い' }],
    ['ギ', { hiragana: 'ぎ', katakana: _正_, vocal: 'い' }],
    ['ク', { hiragana: 'く', katakana: _正_, vocal: 'う' }],
    ['グ', { hiragana: 'ぐ', katakana: _正_, vocal: 'う' }],
    ['ケ', { hiragana: 'け', katakana: _正_, vocal: 'え' }],
    ['ゲ', { hiragana: 'げ', katakana: _正_, vocal: 'え' }],
    ['コ', { hiragana: 'こ', katakana: _正_, vocal: 'お' }],
    ['ゴ', { hiragana: 'ご', katakana: _正_, vocal: 'お' }],
    ['サ', { hiragana: 'さ', katakana: _正_, vocal: 'あ' }],
    ['ザ', { hiragana: 'ざ', katakana: _正_, vocal: 'あ' }],
    ['シ', { hiragana: 'し', katakana: _正_, vocal: 'い' }],
    ['ジ', { hiragana: 'じ', katakana: _正_, vocal: 'い' }],
    ['ス', { hiragana: 'す', katakana: _正_, vocal: 'う' }],
    ['ズ', { hiragana: 'ず', katakana: _正_, vocal: 'う' }],
    ['セ', { hiragana: 'せ', katakana: _正_, vocal: 'え' }],
    ['ゼ', { hiragana: 'ぜ', katakana: _正_, vocal: 'え' }],
    ['ソ', { hiragana: 'そ', katakana: _正_, vocal: 'お' }],
    ['ゾ', { hiragana: 'ぞ', katakana: _正_, vocal: 'お' }],
    ['タ', { hiragana: 'た', katakana: _正_, vocal: 'あ' }],
    ['ダ', { hiragana: 'だ', katakana: _正_, vocal: 'あ' }],
    ['チ', { hiragana: 'ち', katakana: _正_, vocal: 'い' }],
    ['ヂ', { hiragana: 'ぢ', katakana: _正_, vocal: 'い' }],
    ['ッ', { hiragana: 'っ', katakana: _正_, vocal: _ノ_ }],
    ['ツ', { hiragana: 'つ', katakana: _正_, vocal: 'う' }],
    ['ヅ', { hiragana: 'づ', katakana: _正_, vocal: 'う' }],
    ['テ', { hiragana: 'て', katakana: _正_, vocal: 'え' }],
    ['デ', { hiragana: 'で', katakana: _正_, vocal: 'え' }],
    ['ト', { hiragana: 'と', katakana: _正_, vocal: 'お' }],
    ['ド', { hiragana: 'ど', katakana: _正_, vocal: 'お' }],
    ['ナ', { hiragana: 'な', katakana: _正_, vocal: 'あ' }],
    ['ニ', { hiragana: 'に', katakana: _正_, vocal: 'い' }],
    ['ヌ', { hiragana: 'ぬ', katakana: _正_, vocal: 'う' }],
    ['ネ', { hiragana: 'ね', katakana: _正_, vocal: 'え' }],
    ['ノ', { hiragana: 'の', katakana: _正_, vocal: 'お' }],
    ['ハ', { hiragana: 'は', katakana: _正_, vocal: 'あ' }],
    ['バ', { hiragana: 'ば', katakana: _正_, vocal: 'あ' }],
    ['パ', { hiragana: 'ぱ', katakana: _正_, vocal: 'あ' }],
    ['ヒ', { hiragana: 'ひ', katakana: _正_, vocal: 'い' }],
    ['ビ', { hiragana: 'び', katakana: _正_, vocal: 'い' }],
    ['ピ', { hiragana: 'ぴ', katakana: _正_, vocal: 'い' }],
    ['フ', { hiragana: 'ふ', katakana: _正_, vocal: 'う' }],
    ['ブ', { hiragana: 'ぶ', katakana: _正_, vocal: 'う' }],
    ['プ', { hiragana: 'ぷ', katakana: _正_, vocal: 'う' }],
    ['ヘ', { hiragana: 'へ', katakana: _正_, vocal: 'え' }],
    ['ベ', { hiragana: 'べ', katakana: _正_, vocal: 'え' }],
    ['ペ', { hiragana: 'ぺ', katakana: _正_, vocal: 'え' }],
    ['ホ', { hiragana: 'ほ', katakana: _正_, vocal: 'お' }],
    ['ボ', { hiragana: 'ぼ', katakana: _正_, vocal: 'お' }],
    ['ポ', { hiragana: 'ぽ', katakana: _正_, vocal: 'お' }],
    ['マ', { hiragana: 'ま', katakana: _正_, vocal: 'あ' }],
    ['ミ', { hiragana: 'み', katakana: _正_, vocal: 'い' }],
    ['ム', { hiragana: 'む', katakana: _正_, vocal: 'う' }],
    ['メ', { hiragana: 'め', katakana: _正_, vocal: 'え' }],
    ['モ', { hiragana: 'も', katakana: _正_, vocal: 'お' }],
    ['ャ', { hiragana: 'ゃ', katakana: _正_, vocal: 'あ' }],
    ['ヤ', { hiragana: 'や', katakana: _正_, vocal: 'あ' }],
    ['ュ', { hiragana: 'ゅ', katakana: _正_, vocal: 'う' }],
    ['ユ', { hiragana: 'ゆ', katakana: _正_, vocal: 'う' }],
    ['ョ', { hiragana: 'ょ', katakana: _正_, vocal: 'お' }],
    ['ヨ', { hiragana: 'よ', katakana: _正_, vocal: 'お' }],
    ['ラ', { hiragana: 'ら', katakana: _正_, vocal: 'あ' }],
    ['リ', { hiragana: 'り', katakana: _正_, vocal: 'い' }],
    ['ル', { hiragana: 'る', katakana: _正_, vocal: 'う' }],
    ['レ', { hiragana: 'れ', katakana: _正_, vocal: 'え' }],
    ['ロ', { hiragana: 'ろ', katakana: _正_, vocal: 'お' }],
    ['ヮ', { hiragana: 'ゎ', katakana: _正_, vocal: 'あ' }],
    ['ワ', { hiragana: 'わ', katakana: _正_, vocal: 'あ' }],
    ['ヰ', { hiragana: 'ゐ', katakana: _正_, vocal: 'い' }],
    ['ヱ', { hiragana: 'ゑ', katakana: _正_, vocal: 'え' }],
    ['ヲ', { hiragana: 'を', katakana: _正_, vocal: 'お' }],
    ['ン', { hiragana: 'ん', katakana: _正_, vocal: _ノ_ }],
    ['ヴ', { hiragana: 'ゔ', katakana: _正_, vocal: 'う' }],
    ['ヵ', { hiragana: 'ゕ', katakana: _正_, vocal: 'あ' }],
    ['ヶ', { hiragana: 'ゖ', katakana: _正_, vocal: 'え' }],
    ['ヷ', { hiragana: 'ゔ', katakana: _正_, vocal: 'あ' }],
    ['ヸ', { hiragana: _ノ_, katakana: _正_, vocal: 'い' }],
    ['ヹ', { hiragana: _ノ_, katakana: _正_, vocal: 'え' }],
    ['ヺ', { hiragana: _ノ_, katakana: _正_, vocal: 'お' }],
    ['・', { hiragana: _ノ_, katakana: _正_, vocal: _ノ_ }],
    ['ー', { hiragana: _ノ_, katakana: _正_, vocal: _ノ_ }],
    ['ヽ', { hiragana: 'ゝ', katakana: _正_, vocal: _ノ_ }],
    ['ヾ', { hiragana: 'ゞ', katakana: _正_, vocal: _ノ_ }],
    ['ヿ', { hiragana: _ノ_, katakana: _正_, vocal: _ノ_ }],
];

kanaArray = kanaArray.map((el) => {
    const key = el[0].codePointAt(0);
    const obj = el[1];

    const hiragana = typeof obj.hiragana === 'string' ? obj.hiragana.codePointAt(0) : obj.hiragana;
    const katakana = typeof obj.katakana === 'string' ? obj.katakana.codePointAt(0) : obj.katakana;
    const vocal = typeof obj.vocal === 'string' ? obj.vocal.codePointAt(0) : obj.vocal;

    return [key, { hiragana, katakana, vocal }];
});

const kanaMap = {};

kanaArray.forEach((el) => {
    kanaMap[el[0]] = el[1];
});

const script = `
// Generated code, don't edit this file.

export interface KanaDetails {
    /**
     * number = the codepoint of the hiragana counterpart\n
     * true = the key is already hiragana\n
     * null = no hiragana counterpart availabla
     */
    hiragana: number | true | null,

    /**
     * number = the codepoint of the katakana counterpart\n
     * true = the key is already katakana\n
     * null = no katakana counterpart availabla
     */
    katakana: number | true | null,

    /**
     * number = the codepoint of the vocal (あ、い、う、え、お)\n
     * null = no vocal available
     */
    vocal: number | null
}

export const KanaMap: Record<number, KanaDetails> = JSON.parse('${JSON.stringify(kanaMap)}');
`;

fs.mkdirSync(`${__dirname}/../src/gen`, { recursive: true });
fs.writeFileSync(`${__dirname}/../src/gen/kana-map.ts`, script);
