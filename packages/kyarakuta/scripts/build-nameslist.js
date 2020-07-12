const fs = require('fs');

const namesListRaw = fs.readFileSync(
    __dirname + '/../raw-data/NamesList.txt', {
    encoding: 'utf-8'
}).toString().split('\n');

/** @type {Map<{name: string, subname: string}, number>} */
const block2id = new Map();

/** @type {import('./../src/types/types').SubBlocksLibraryInterface} */
const SubBlocksLibrary = {
    blocks: {},
    codePoints: {}
};

/** @type {import('./../src/types/types').BlockRange[]} */
const BlockRangesList = [];

let currentBlock = '';
let currentSubBlock = '';
let currentId = 0;

for (let i = 0; i < namesListRaw.length; i++) {
    let matchBlock = namesListRaw[i].match(/^@@\t(.*?)\t(.*?)\t(.*?)$/);
    let matchSubBlock = namesListRaw[i].match(/^@\t\t(.*?)$/);
    let matchLetter = namesListRaw[i].match(/^([0-9a-fA-F]+)\t(.*?)$/);

    if (matchBlock) {
        currentBlock = matchBlock[2];

        BlockRangesList.push({
            block: matchBlock[2],
            start: parseInt(matchBlock[1], 16),
            end: parseInt(matchBlock[3], 16),
        });
    }

    if (matchSubBlock) {
        currentSubBlock = matchSubBlock[1];
        const name = currentSubBlock;

        if (!Object.values(SubBlocksLibrary.blocks).some((el) => el === name)) {
            currentId += 1;
            SubBlocksLibrary.blocks[currentId] = name;
            block2id.set(name, currentId);
        }
    }

    if (matchLetter) {
        const name = currentSubBlock;
        const letterId = parseInt(matchLetter[1], 16);

        if (block2id.get(name) === undefined) throw new Error('Can\'t find name ' + name);
        const nameId = block2id.get(name);

        SubBlocksLibrary.codePoints[letterId] = nameId;
    }
}

const script = `
// Generated code, don't edit this file.

import { SubBlocksLibraryInterface, BlockRange } from '../types/types';

export const SubBlocksLibrary: SubBlocksLibraryInterface = JSON.parse(\`
${JSON.stringify(SubBlocksLibrary)}
\`);

export const BlockRangesList: ReadonlyArray<BlockRange> = JSON.parse(\`
${JSON.stringify(BlockRangesList)}
\`);
`;

fs.mkdirSync(__dirname + '/../src/gen', { recursive: true });
fs.writeFileSync(__dirname + '/../src/gen/blocks-library.ts', script);
