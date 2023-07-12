window.addEventListener(
  "message",
  console.log("message"),
  function (event) {
    // We only accept messages from ourselves
    if (event.source != window) return;

    if (event.data.type && event.data.type == "DATA_REDACTOR") {
      console.log("Content script received: " + event.data.text);
    }
  },
  false
);

// Create a Promise that resolves when the bundle.js script is loaded
let bundlePromise = new Promise((resolve) => {
  fetch(chrome.runtime.getURL("dist/bundle.js"))
    .then((r) => r.text())
    .then((text) => {
      let script = document.createElement("script");
      script.textContent = text;
      (document.head || document.documentElement).appendChild(script);

      console.log("Script injected:", script);

      resolve(); // Resolve the Promise
      console.log("this", Window.data_redactor);
    });
});

bundlePromise.then(() => {
  // The bundle.js script has been loaded
  // Now load the settings and setup the input box
  chrome.storage.sync.get(["enabled", "redactSettings"], function (items) {
    console.log("Settings loaded:", items); // Log the loaded settings
    if (items.enabled) {
      console.log("window:", window); // Check if window.data_redactor is defined
      console.log("window.data_redactor:", window.data_redactor); // Check if window.data_redactor is defined
      let dataRedactor = window.data_redactor; // Try to capture window.data_redactor in a closure

      // Create the new input box
      let newInputBox = document.createElement("textarea");
      newInputBox.id = "newInputBox";
      newInputBox.style.color = "black";

      // Find the existing input box
      let oldInputBox = document.querySelector("#prompt-textarea");
      if (!oldInputBox) {
        console.error("Old input box not found");
        return;
      }

      // Insert the new input box above the old one
      oldInputBox.parentNode.insertBefore(newInputBox, oldInputBox);

      // When the new input box loses focus, redact the text and put it in the old input box
      newInputBox.onblur = function () {
        console.log("New input box blurred"); // Log when the input box loses focus

        // Get the text from the new input box
        let text = newInputBox.value;
        console.log(`text passed: ${text}`);
        console.log(dataRedactor);
        // Redact the text
        let redactedText = dataRedactor.redact(text); // Use captured dataRedactor

        // Put the redacted text in the old input box
        oldInputBox.value = redactedText;
      };
    }
  });
});
