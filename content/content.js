fetch(chrome.runtime.getURL("dist/bundle.js"))
  .then((r) => r.text())
  .then((text) => {
    let script = document.createElement("script");
    script.textContent = text;
    (document.head || document.documentElement).appendChild(script);

    console.log("Script injected:", script);
    console.log("DataRedactor on window:", DataRedactor);

    // Load the settings
    chrome.storage.sync.get(["enabled", "redactSettings"], function (items) {
      console.log("Settings loaded:", items); // Log the loaded settings
      if (items.enabled) {
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
          // Create a new DataRedactor instance
          let data_redactor = new window.DataRedactor(items.redactSettings);

          // Get the text from the new input box
          let text = newInputBox.value;

          // Redact the text
          let redactedText = data_redactor.redact(text);

          // Put the redacted text in the old input box
          oldInputBox.value = redactedText;
        };
      }
    });
  });
