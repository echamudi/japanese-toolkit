#!/usr/bin/env node

/**
 * Show kanji tree in CLI
 */

const string = process.argv[2];
const kanji = require('../');

function printTree(node, path = [], depth = 0, lastChild = true) {
    let element;

    if (node.element) element = node.element;
    else element = '？';

    if (!lastChild) path[depth] = '├─ '; // still has sibling
    else path[depth] = '└─ '; // last item

    console.log(path.slice(0, depth + 1).join('') + element);

    if (!lastChild) path[depth] = '│  '; // still has sibling
    else path[depth] = '   '; // no more item

    if　(node.g) {
        const lastIndex = node.g.length - 1;

        node.g.forEach((element, index) => {
            printTree(element, path, depth + 1, index === lastIndex);
        });
    }
}

// Allow argument of multiple characterrs
string.split('').forEach((char, index) => {
    const root = kanji.kanjiTree(char);
    printTree(root, [], 0, index === string.length - 1);
});
