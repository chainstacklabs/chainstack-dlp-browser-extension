// content.js

let hasUpdated = false; // <-- Add a flag here

function updateInputBox() {
  // Initialize dataRedactor with the current settings
  chrome.storage.sync.get("redactSettings", function (items) {
    let dataRedactor = new window.data_redactor(items.redactSettings);
    console.log("Settings:", items.redactSettings);
    console.log("Test text:", dataRedactor.redact("My name is David"));

    let oldInputBox = document.querySelector("#prompt-textarea");
    if (!oldInputBox) {
      console.error("Old input box not found");
      return;
    }

    // Insert the new input box if it doesn't exist yet
    let newInputBox = document.querySelector("#newInputBox");
    let tokenCountElement = document.querySelector("#tokenCount"); // <-- Get the token count element
    if (!newInputBox) {
      newInputBox = document.createElement("textarea");
      newInputBox.id = "newInputBox";
      newInputBox.style.color = "black";

      // Create a token count element
      tokenCountElement = document.createElement("div");
      tokenCountElement.id = "tokenCount";
      tokenCountElement.style.color = "white";

      // Insert the new elements
      oldInputBox.parentNode.insertBefore(newInputBox, oldInputBox);
      oldInputBox.parentNode.insertBefore(tokenCountElement, newInputBox); // <-- Insert it before the new input box
    }

    // When the new input box loses focus, redact the text and put it in the old input box
    newInputBox.onblur = function () {
      let text = newInputBox.value;
      let redactedText = dataRedactor.redact(text);
      let token_count = dataRedactor.countTokens(redactedText);
      console.log("Redacted text:", redactedText);
      console.log("Tokens count:", token_count);

      // Set the value and dispatch an input event to notify any listeners that the value has changed
      oldInputBox.value = redactedText;
      oldInputBox.dispatchEvent(new Event("input", { bubbles: true }));

      // Update the token count element
      tokenCountElement.textContent = "Token count: " + token_count;

      // Clear the new input box
      newInputBox.value = "";
    };
  });
}

// Create a MutationObserver to watch for changes in the DOM
let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // If the addedNodes property has one or more nodes
    if (!hasUpdated && mutation.addedNodes.length) {
      // <-- Check the flag here
      let oldInputBox = document.querySelector("#prompt-textarea");
      if (oldInputBox) {
        // The input box has been added, update it
        updateInputBox();
        // Stop observing changes to the DOM
        observer.disconnect();
        hasUpdated = true; // <-- Set the flag here
      }
    }
  });
});

// Start observing changes to the DOM
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
