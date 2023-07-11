const compromise = require("./lib/compromise");
const { encode } = require("./lib/Encoder");

class DataRedactor {
  constructor(settings) {
    this.settings = settings;

    // Define the sensitive data patterns and their placeholders
    this.sensitive_patterns = [
      {
        setting: "creditCard",
        pattern: /\b\d{16}\b|(\b(\d{4}[- ]){3}\d{4}\b)/g,
        placeholder: "**CREDIT_CARD**",
      },
      {
        setting: "jwt",
        pattern: /eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.?[a-zA-Z0-9-_]+/g,
        placeholder: "**JWT**",
      },
      {
        setting: "rpcEndpoint",
        pattern: /(http(s)?:\/\/).*infura\.io/g,
        placeholder: "**RPC_ENDPOINT**",
      },
      {
        setting: "ethPrivateKey",
        pattern: /[a-fA-F0-9]{64}/g,
        placeholder: "**ETH_PRIVATE_KEY**",
      },
      {
        setting: "ethAddress",
        pattern: /0x[a-fA-F0-9]{40}/g,
        placeholder: "**ETH_ADDRESS**",
      },
      {
        setting: "apiKey",
        pattern: /\b(0x)?[0-9a-fA-F]{32}\b/g,
        placeholder: "**API_KEY**",
      },
      {
        setting: "phoneNumber",
        pattern:
          /\(?\+?([0-9]{1,3}?)\)?[-. ]?(\(?[0-9]{1,3}?\)?[-. ]?[0-9]{1,3}[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,4})/g,
        placeholder: "**PHONE_NUMBER**",
      },
    ];
    this.replacements = {
      person: this.settings.names ? "**PERSON_NAME**" : null,
      place: this.settings.locations ? "**LOCATION**" : null,
    };
  }

  redact(text) {
    let redacted_text = text;

    // Replace each sensitive data pattern with its placeholder
    this.sensitive_patterns.forEach(({ setting, pattern, placeholder }) => {
      // Only apply the redaction if the setting is true
      if (this.settings[setting]) {
        redacted_text = redacted_text.replace(pattern, placeholder);
      }
    });

    // Use compromise to parse the text
    let doc = compromise(redacted_text);

    // Identify and redact people's names
    let people = doc.people().out("array");
    for (let person of people) {
      if (this.replacements.person) {
        redacted_text = redacted_text.replace(
          new RegExp(person, "g"),
          this.replacements.person
        );
      }
    }

    // Identify and redact addresses
    let places = doc.places().out("array");
    for (let place of places) {
      if (this.replacements.place) {
        redacted_text = redacted_text.replace(
          new RegExp(place, "g"),
          this.replacements.place
        );
      }
    }

    // Identify and redact organization names
    let organizations = doc.organizations().out("array");
    for (let organization of organizations) {
      redacted_text = redacted_text.replace(
        new RegExp(organization, "g"),
        "REDACTED_ORGANIZATION"
      );
    }

    return redacted_text;
  }

  // Use gpt-3-encoder to calculate tokens in the redacted text
  countTokens(text) {
    // Encode the text
    const tokens = encode(text);
    // Return the number of tokens
    return tokens.length;
  }
}

// Main function to test the script
function main() {
  // Create a new DataRedactor instance with all settings enabled
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

  // Define the text to be redacted
  let text =
    "My name is John Doe, I work at Chainstack, I live at 123 Elm Street, my phone number is (123) 456-7890, my API key is 123e4567e89b12d3a4566a1f625a465a, my Ethereum address is 0x32Be343B94f860124dC4fEe278FDCBD38C102D88, my private key is 0x9fd3c5c27aaaed0d002f386fc6e36d10b5a5a9f3a3c4a739ae6099845cd18027 and my RPC endpoint is https://mainnet.infura.io/v3/088a8ec0b2b812dff4e8c6484e8f90b2, and my credit card is 8345 4756 2837 0497";

  // Use the data_redactor instance to redact the sensitive data from the text
  const redactedText = data_redactor.redact(text);
  console.log(`DLP safe text: ${redactedText}`);

  // Count the tokens
  let token_count = data_redactor.countTokens(redactedText);

  console.log(`The redacted text contains ${token_count} tokens.`);
}

// Run the main function
main();
