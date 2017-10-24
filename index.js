const path = require('path');
const fs = require('fs');
const lineReader = require('readline');
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

function rootCleanup(content){
    let rootIndex = content.indexOf(':root');
    if (rootIndex !== -1) {
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
        content = content.replace(ROOT, '');

        return content;
    }

}

function variableCleanup(content){
    let variableIndex = content.indexOf(VAR);
    if (variableIndex !== -1) {
        let variableOpening = content.indexOf(OPENING_BRACKET, variableIndex),
            opening = 0,
            closing = 0;
        for (let i = variableOpening; i < content.length; i++) {

            if (content[i] === OPENING_BRACKET) {
                opening++;
            }
            else if (content[i] === CLOSING_BRACKET) {
                closing++;
                if (closing === opening) { //we found root closing parentheses
                    content = replaceAt(content, variableOpening);
                    content = replaceAt(content, i, EMPTY);
                    break;
                }
            }
        }
        content = content.replace(VAR, '');

        return content;
    }
}


function calcCleanup(content){
    let calcIndex = content.indexOf(CALC);
    if (calcIndex !== -1) {
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
        content = content.replace(CALC, '');

        return content;
    }
}

module.exports = {

    convert: function (src, dest) {

        return new Promise((resolve, reject) => {

            let content = fs.readFileSync(src, 'utf8');

            content = rootCleanup(content);
            while(content.indexOf(VAR) !== -1){
                content = variableCleanup(content);
            }

            while(content.indexOf(CALC) !== -1){
                content = calcCleanup(content);
            }

            content = content.replace(/--/g, '$');


            let rebuiltFile = content;

            if (dest) {
                let outputFile = fs.createWriteStream(dest);

                outputFile.once('open', function (fd) {
                    outputFile.write(rebuiltFile);
                    outputFile.end();
                });
                outputFile.on('close', function () {
                    resolve(dest)
                });
            } else {
                let outputFile = fs.createWriteStream(src);

                outputFile.once('open', function (fd) {
                    outputFile.write(rebuiltFile);
                    outputFile.end();
                });
                outputFile.on('close', function () {
                    resolve(src);
                });
            }


        });

    }
};