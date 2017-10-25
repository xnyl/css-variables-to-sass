# CSS Variables to SASS/SCSS

This plugin converts new var(---variableName) standard to 'old' SASS/SCSS style $variable. It will read your specified file and either overwrite it or output to a new file.

## Installation
With [npm](https://www.npmjs.com) do:
```
npm install css-variables-to-sass
```


## How to use
The package can be run from either a node script or directly in the command line. Both provide the ability to pass options to the package.

### - Javascript

The `convert` function returns a promise.

```
var cssVarsToSass = require('css-variables-to-sass');

cssVarsToSass.convert(<path to file>, <path to destination>);
```

### - CLI 

Using the CLI you can specifiy the source and output files

```
css-variables-to-sass path/to/files.css -o path/to/output.scss
```
or with globbing
```
css-variables-to-sass path/to/all/**/*.css
```

Note: Currently globbing only allows you to overwrite existing files

## Contribute

Once you've cloned the Github repository, you will need to run `npm install` to install the required dependencies to build the package. There are basic tests in `test/test.js` which can be run to check that the code works as required.

Feel free to make it better :heart:

Built by [@xnyl](http://github.com/xnyl)

Inspired by [sass-to-css-variables](https://github.com/samuelthomps0n/sass-to-css-variables)