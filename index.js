const compromise = require("compromise");
const { encode } = require("gpt-3-encoder");

class DataRedactor {
  constructor() {
    // Define the sensitive data patterns and their placeholders
    this.sensitive_patterns = [
      { pattern: /\b\d{16}\b/g, placeholder: "**CREDIT_CARD**" },
      {
        pattern: /eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.?[a-zA-Z0-9-_]+/g,
        placeholder: "**JWT**",
      },
      {
        pattern: /(http(s)?:\/\/).*infura\.io/g,
        placeholder: "**RPC_ENDPOINT**",
      },
      { pattern: /[a-fA-F0-9]{64}/g, placeholder: "**ETH_PRIVATE_KEY**" },
      { pattern: /0x[a-fA-F0-9]{40}/g, placeholder: "**ETH_ADDRESS**" },
      { pattern: /[0-9a-fA-F]{32}/g, placeholder: "**API_KEY**" },
      {
        pattern:
          /\(?\+?([0-9]{1,4}?)\)?[-. ]?(\(?[0-9]{1,3}?\)?[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,9})/g,
        placeholder: "**PHONE_NUMBER**",
      },
    ];
    this.replacements = {
      person: "REDACTED_PERSON",
      place: "REDACTED_PLACE",
    };
  }

  redact(text) {
    let redacted_text = text;

    // Replace each sensitive data pattern with its placeholder
    this.sensitive_patterns.forEach(({ pattern, placeholder }) => {
      redacted_text = redacted_text.replace(pattern, placeholder);
    });

    // Use compromise to parse the text
    let doc = compromise(redacted_text);

    // Identify and redact people's names
    let people = doc.people().out("array");
    for (let person of people) {
      redacted_text = redacted_text.replace(
        new RegExp(person, "g"),
        "REDACTED_PERSON"
      );
    }

    // Identify and redact addresses (note: this is not perfect and may not catch all addresses)
    let places = doc.places().out("array");
    for (let place of places) {
      redacted_text = redacted_text.replace(
        new RegExp(place, "g"),
        "REDACTED_PLACE"
      );
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
  // Create a new DataRedactor instance
  let data_redactor = new DataRedactor();

  // Define the text to be redacted
  let text =
    "My name is John Doe, I work at Apple, I live at 123 Elm Street, my phone number is (123) 456-7890, my API key is 123e4567e89b12d3a4566a1f625a465a, my Ethereum address is 0x32Be343B94f860124dC4fEe278FDCBD38C102D88, my private key is 0x9fd3c5c27aaaed0d002f386fc6e36d10b5a5a9f3a3c4a739ae6099845cd18027 and my RPC endpoint is https://mainnet.infura.io/v3/088a8ec0b2b812dff4e8c6484e8f90b2";

  // Use the data_redactor instance to redact the sensitive data from the text
  const redactedText = data_redactor.redact(text);
  console.log(`DLP safe text: ${redactedText}`);

  // Count the tokens
  let token_count = data_redactor.countTokens(redactedText);

  console.log(`The redacted text contains ${token_count} tokens.`);
}

// Run the main function
main();
