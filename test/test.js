const //should = require('should'),
    fs = require('fs'),
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

    plugin.convertFile(sourcePath, destinationPath).then(function(file) {

        let result = fs.readFileSync(destinationPath, 'utf8');
        compareWisely(result, expected);
        done();
    }).catch(function(err) {
        console.log(err);
    })
};


let sanitize = function(content){
    return content.replace(/\s/g, " ");
};

let compareWisely = function(result, expected){
    chai.expect(sanitize(result)).to.equalIgnoreSpaces(sanitize(expected));
};

describe('css-variables-to-sass', function () {

    it('removes :root { } entries', function (done) {
        jsTest('root', {}, done);
    });

    it('converts var(--xxx) variables to $ variables', function (done) {
        jsTest('simple', {}, done);
    });

    xit('converts calc(...) variables to #{...}  interpolations', function (done) {
        jsTest('calc', {}, done);
    });

});

