const compromise = require("./minified/compromise.min.js");
const { encode } = require("./minified/encoded.min.js");
const patterns = require("./patterns");

class DataRedactor {
  constructor(settings, alwaysChecked) {
    this.settings = settings;
    this.sensitive_patterns = patterns;
    this.alwaysChecked = alwaysChecked;

    // Sort the patterns by the length of the placeholder, in descending order
    this.sensitive_patterns.sort((a, b) => {
      return b.placeholder.length - a.placeholder.length;
    });

    this.replacements = {
      person: this.settings.names ? "**PERSON_NAME**" : null,
      place: this.settings.locations ? "**LOCATION**" : null,
    };
    this.redact = this.redact.bind(this);
  }

  redact(text) {
    let redacted_text = text;
    let patterns = this.sensitive_patterns.map((p) => p.pattern.source);

    redacted_text = redacted_text.replace(
      new RegExp(patterns.join("|"), "g"),
      function (match) {
        for (let pattern of this.sensitive_patterns) {
          if (new RegExp(pattern.pattern).test(match)) {
            if (this.settings[pattern.setting]) {
              return pattern.placeholder;
            } else {
              // Only return the original match when the setting is off and the pattern is not always enabled
              if (!this.alwaysChecked.includes(pattern.setting)) {
                return match;
              }
            }
          }
        }
      }.bind(this)
    );

    let doc = compromise(redacted_text);

    let people = doc.people().out("array");
    for (let person of people) {
      if (this.replacements.person) {
        redacted_text = redacted_text.replace(
          new RegExp(person, "g"),
          this.replacements.person
        );
      }
    }

    let places = doc.places().out("array");
    for (let place of places) {
      if (this.replacements.place) {
        redacted_text = redacted_text.replace(
          new RegExp(place, "g"),
          this.replacements.place
        );
      }
    }

    let organizations = doc.organizations().out("array");
    for (let organization of organizations) {
      redacted_text = redacted_text.replace(
        new RegExp(organization, "g"),
        "**REDACTED_ORGANIZATION**"
      );
    }

    return redacted_text;
  }

  countTokens(text) {
    const tokens = encode(text);
    return tokens.length;
  }
}

let data_redactor = new DataRedactor({
  creditCard: true,
  jwt: true,
  rpcEndpoint: true,
  ethPrivateKey: true,
  ethAddress: true,
  apiKey: true,
  phoneNumber: true,
  names: true,
  locations: true,
});

let text =
  "My name is John Doe, I work at Chainstack, I live at 123 Elm Street, my phone number is (123) 456-7890, my API key is 123e4567e89b12d3a4566a1f625a465a, my Ethereum address is 0x32Be343B94f860124dC4fEe278FDCBD38C102D88, my private key is 0x9fd3c5c27aaaed0d002f386fc6e36d10b5a5a9f3a3c4a739ae6099845cd18027 and my RPC endpoint is https://mainnet.infura.io/v3/088a8ec0b2b812dff4e8c6484e8f90b2, and my credit card is 8345 4756 2837 0497";

const redactedText = data_redactor.redact(text);
console.log(`DLP safe text: ${redactedText}`);

let token_count = data_redactor.countTokens(redactedText);
console.log(`The redacted text contains ${token_count} tokens.`);

window.data_redactor = DataRedactor;
