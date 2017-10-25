const fs = require('fs'),
    path = require('path'),
    plugin = require('../'),
    chai = require('chai');

    chai.use(require('chai-string'));
    const expect = chai.expect;


let jsTest = function (fixture, options, done) {
    "use strict";

    let expectedPath = path.join(__dirname, 'fixtures', fixture,  'expected.scss')
    let sourcePath = path.join(__dirname, 'fixtures', fixture,  'source.css')
    let destinationPath = path.join(__dirname, 'fixtures', fixture,  'result.scss')

    let expected = fs.readFileSync(expectedPath, 'utf8');

    plugin.convert(sourcePath, destinationPath).then(function(file) {

        let result = fs.readFileSync(destinationPath, 'utf8');
        compareIgnoringWhiteCharacters(result, expected);
        done();
    }).catch(function(err) {
        console.log(err);
    })
};


let sanitize = function(content){
    return content.replace(/\s/g, " ");
};

let compareIgnoringWhiteCharacters = function(result, expected){
    chai.expect(sanitize(result)).to.equalIgnoreSpaces(sanitize(expected));
};

describe('css-variables-to-sass', function () {

    it('removes :root {...} entry', function (done) {
        jsTest('root', {}, done);
    });

    it('converts var(--xxx) variables to $xxx variables', function (done) {
        jsTest('var', {}, done);
    });

    it('removes calc(...) statements', function (done) {
        jsTest('calc', {}, done);
    });

    it('respects BEM-like element--modifiers', function (done) {
        jsTest('bem', {}, done);
    });

});


