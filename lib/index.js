const compromise = require("./compromise");
const { encode } = require("./Encoder");

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

// Expose DataRedactor to the global scope for use in the browser
window.DataRedactor = DataRedactor;
//module.exports = DataRedactor;

// Log the window object
console.log(`window: ${window.DataRedactor}`);
