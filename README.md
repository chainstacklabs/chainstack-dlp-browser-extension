# Chainstack DLP

In the digital age, data privacy and security have become paramount. As we increasingly rely on artificial intelligence (AI) models for various tasks, we must ensure that our interactions with these models do not inadvertently expose sensitive information. This is particularly relevant when using AI-powered chatbots like ChatGPT, where users often input data that could be personal or sensitive.

The Chatinstack DLP browser extension is designed to enhance the privacy and security of your interactions with ChatGPT. This extension works by redacting potentially sensitive information before it's sent to ChatGPT for processing, including names, addresses, API keys, JWT tokens, etc.

## Processing sensitive data

To function as a genuine Data Loss Prevention (DLP) tool, the Chainstack DLP performs all processing locally. This means the extension does not rely on any external APIs, ensuring that your data never leaves your local environment. Trust is a critical factor in data security, and to uphold this trust, we've made our tool 100% open-source. This transparency allows you to verify the security measures we've implemented. You can install the extension directly from the store, or, for those who prefer, you can also install it locally using this repository.

The Chainstack DLP tool employs regular expression patterns to detect potentially sensitive data, such as API keys, credit card numbers, JWT tokens, and more. Additionally, it utilizes the [compromise package](https://github.com/spencermountain/compromise), a robust JavaScript library for natural language processing (NLP). This library aids in the identification of personal and business identifiers, including names, addresses, and company names.

> The extension uses a bundled version of the compromise library V 14.9.0.

## Quickstart

1. **Install Browserify**: Browserify is a tool that allows you to use `require()` style CommonJS modules in the browser. It bundles up all of your dependencies into one JavaScript file so that you can include it in your HTML file. Install it globally using npm with the following command:

   ```
   npm install -g browserify
   ```

2. **Bundle `index.js`**: Once Browserify is installed, you can use it to bundle your `index.js` file. Navigate to the root directory of your project and run the following command:

   ```
   browserify lib/index.js -o dist/bundle.js
   ```

   This command tells Browserify to take `lib/index.js` as the entry point of your application, bundle up all its dependencies, and output the result to `dist/bundle.js`. The `-o` flag is used to specify the output file.

3. **Install the Extension from Developer Tools**: After bundling your JavaScript files, the next step is to install the extension in your browser. This process can vary depending on the browser you're using. For Chrome, you can do this by:

   - Open the Extension Management page by navigating to `chrome://extensions`. Alternatively, open this page by clicking on the Extensions menu button and selecting Manage Extensions at the bottom of the menu.
   - Enable Developer Mode by clicking the toggle switch next to Developer mode.
   - Click the Load unpacked button and select the extension directory (`dist` in this case).

Now, your browser extension is installed and ready to use.

> Note that you will need to re-run the bundle command every time you edit `index.js`.
