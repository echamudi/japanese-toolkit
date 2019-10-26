/**
 * Show kanji tree in CLI
 */

const char = process.argv[2];
const kanji = require('../');
const root = kanji.kanjiTree(char);

function printTree(node, path = ['└─ '], depth = 1, lastChild = true) {
    let element;
    if (node.element) element = node.element;
    else element = '？';

    console.log(path.slice(0, depth).join('') + element);

    if (!lastChild) path[depth - 1] = '│  '; // Still have sibling, previous is straight line
    else path[depth - 1] = '   '; // No more sibling previous is empty

    if　(node.g) {
        const lastIndex = node.g.length - 1;

        node.g.forEach((element, index) => {
            let lastChild = index === lastIndex;

            if (!lastChild) path[depth] = '├─ ';
            else path[depth] = '└─ ';

            printTree(element, path, depth + 1, lastChild);
        });
    }
}
printTree(root);