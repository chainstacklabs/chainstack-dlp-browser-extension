# Chainstack DLP

Chrome extention that redacts potentially sensitive information before quering ChatGPT.

## Quickstart

Install browserify

- `npm install -g browserify`

From the root directory, run command to bundle `index.js`

- `browserify lib/index.js -o dist/bundle.js`

Install the extension from the developer tools

The `index.js` file is where the logic happens, for now is a bit broken so the `index.js` file init an instance of `dataRedactor` and exposes it directly as `window.data_redactor`. It works in the browser console but for some reason it doesn't work with inputs from the page itself.

The `content.js` file has the logic for that, it's probably wrong. `background.js` also has something going on I think.
