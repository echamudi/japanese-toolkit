#!/usr/bin/env node

/**
 * Copyright (c) 2020 Ezzat Chamudi
 * Copyright (c) 2020 Project Authors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 */

/**
 * Show kanji tree in CLI
 */

const string = process.argv[2];
const kanji = require('..');

function printTree(node, path = [], depth = 0, lastChild = true) {
    let element;
    const pathArray = path;

    if (node.element) element = node.element;
    else element = '？';

    if (!lastChild) pathArray[depth] = '├─ '; // still has sibling
    else pathArray[depth] = '└─ '; // last item

    console.log(path.slice(0, depth + 1).join('') + element);

    if (!lastChild) pathArray[depth] = '│  '; // still has sibling
    else pathArray[depth] = '   '; // no more item

    if (node.g) {
        const lastIndex = node.g.length - 1;

        node.g.forEach((el, index) => {
            printTree(el, path, depth + 1, index === lastIndex);
        });
    }
}

// Allow argument of multiple characterrs
string.split('').forEach((char, index) => {
    const root = kanji.kanjiTree(char);
    printTree(root, [], 0, index === string.length - 1);
});
