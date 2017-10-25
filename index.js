const path = require('path');
const fs = require('fs');
const glob = require('glob');


const ROOT = ':root';
const VAR = ' var';
const CALC = ' calc';
const OPENING_PARENTHESES = '{';
const CLOSING_PARENTHESES = '}';
const OPENING_BRACKET = '(';
const CLOSING_BRACKET = ')';
const SPACE = ' ';
const EMPTY = '';


function replaceAt(string, index, char = SPACE) {
    if (index > string.length - 1) return string;
    return string.substr(0, index) + char + string.substr(index + 1);
}

function cleanupRoot(content) {
    let rootIndex;
    while ((rootIndex = content.indexOf(ROOT)) !== -1) {
        let rootOpening = content.indexOf(OPENING_PARENTHESES, rootIndex),
            opening = 0,
            closing = 0;
        for (let i = rootOpening; i < content.length; i++) {

            if (content[i] === OPENING_PARENTHESES) {
                opening++;
            }
            else if (content[i] === CLOSING_PARENTHESES) {
                closing++;
                if (closing === opening) { //we found root closing parentheses
                    content = replaceAt(content, rootOpening);
                    content = replaceAt(content, i);
                    break;
                }
            }

        }
        content = content.replace(ROOT, EMPTY);
    }
    return content;
}

function cleanupVar(content) {
    let variableIndex;
    while ((variableIndex = content.indexOf(VAR)) !== -1) {
        let variableOpening = content.indexOf(OPENING_BRACKET, variableIndex),
            opening = 0,
            closing = 0;
        for (let i = variableOpening; i < content.length; i++) {

            if (content[i] === OPENING_BRACKET) {
                opening++;
            }
            else if (content[i] === CLOSING_BRACKET) {
                closing++;
                if (closing === opening) { //we found var closing bracket
                    content = replaceAt(content, variableOpening);
                    content = replaceAt(content, i, EMPTY);
                    break;
                }
            }
        }
        content = content.replace(VAR, EMPTY);

    }
    return content;
}


function cleanupCalc(content) {
    let calcIndex;
    while (calcIndex = content.indexOf(CALC) !== -1) {
        let calcOpening = content.indexOf(OPENING_BRACKET, calcIndex),
            opening = 0,
            closing = 0;
        for (let i = calcOpening; i < content.length; i++) {

            if (content[i] === OPENING_BRACKET) {
                opening++;
            }
            else if (content[i] === CLOSING_BRACKET) {
                closing++;
                if (closing === opening) { //we found root closing parentheses
                    content = replaceAt(content, calcOpening);
                    content = replaceAt(content, i, EMPTY);
                    break;
                }
            }
        }
        content = content.replace(CALC, EMPTY);

    }
    return content;

}

function replaceVars(content){
    const pattern = '([^a-zA-Z0-9])(--([a-zA-Z0-9]+))';
    let variableRegexp = new RegExp(pattern, "g");
    content = content.replace(variableRegexp, '$1$$$3');

    return content;
}

function processContent(content){

    content = cleanupRoot(content);

    content = cleanupVar(content);

    content = cleanupCalc(content);

    content = replaceVars(content);

    return content;
}

module.exports = {

    convert: function (src, dest) {

        return new Promise((resolve, reject) => {

            let content = fs.readFileSync(src, 'utf8');

            content = processContent(content);

            if (dest) {
                let outputFile = fs.createWriteStream(dest);

                outputFile.once('open', function (fd) {
                    outputFile.write(content);
                    outputFile.end();
                });
                outputFile.on('close', function () {
                    resolve(dest)
                });
            } else {
                let outputFile = fs.createWriteStream(src);

                outputFile.once('open', function (fd) {
                    outputFile.write(content);
                    outputFile.end();
                });
                outputFile.on('close', function () {
                    resolve(src);
                });
            }

        });

    }
};