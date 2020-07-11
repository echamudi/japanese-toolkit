/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { SubBlocksLibrary, BlockRangesList } from './gen/blocks-library';

function getBlockNames(string: string): {char: string, block: string | undefined, subblock: string | undefined}[] {
    const charArray = [...string];
    const result: ReturnType<typeof getBlockNames> = [];

    charArray.forEach((char) => {
        const codePoint = char.codePointAt(0);
        if (codePoint === undefined) throw new Error('Hmm, please open an issue in the github repo.');
        
        // TODO: add guessing by the last used characters

        // Get block name
        let block = undefined;

        for (let i = 0; i < BlockRangesList.length; i++) {
            if (BlockRangesList[i].start <= codePoint && codePoint <= BlockRangesList[i].end) {
                block = BlockRangesList[i].block;
                break;
            }
        }

        // Get subblock name
        const blockId = SubBlocksLibrary.codePoints[codePoint];
        const subblock = SubBlocksLibrary.blocks[blockId];

        result.push({ char, block, subblock });
    });

    return result;
}

export default getBlockNames;
