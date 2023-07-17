if (!window.hasRun) {
  window.hasRun = true;

  let inputBox = null;
  let previewBox = null;
  let toggleButton = null;
  let tokenCountElement = null;
  let enabled = true;
  let redactSettings = null;

  let lastInput = "";
  let debounceTimeout = null;
  const DEBOUNCE_DELAY = 70; // Adjust this value as needed

  function cleanUp() {
    if (previewBox) previewBox.remove();
    if (toggleButton) toggleButton.remove();
    if (tokenCountElement) tokenCountElement.remove();

    previewBox = null;
    toggleButton = null;
    tokenCountElement = null;
    inputBox = null;
  }

  function updateInputBox() {
    chrome.storage.sync.get(["enabled", "redactSettings"], function (items) {
      enabled = items.enabled;
      redactSettings = items.redactSettings;

      // If enabled is unchecked, clean up and stop the functionality
      if (!enabled) {
        cleanUp();
        return;
      }

      // Continue with the normal functionality if enabled is checked
      console.log("Settings: ", redactSettings);

      // Clean up any previous UI
      cleanUp();

      inputBox = document.querySelector("#prompt-textarea");
      if (!inputBox) {
        console.error("Input box not found");
        return;
      }

      // Create Preview Box
      previewBox = document.createElement("div");
      previewBox.id = "previewBox";
      previewBox.style.border = "1px solid #ccc";
      previewBox.style.color = "white";
      previewBox.style.padding = "5px";
      previewBox.style.marginBottom = "10px";
      previewBox.style.borderRadius = "5px";
      previewBox.style.width = "calc(100% - 10px)";
      previewBox.style.display = "none";
      inputBox.parentNode.insertBefore(previewBox, inputBox);

      // Create Toggle Button
      toggleButton = document.createElement("button");
      toggleButton.id = "toggleButton";
      toggleButton.textContent = "⇕";
      toggleButton.style.position = "absolute";
      toggleButton.style.left = "10px";
      toggleButton.style.top = "-30px";
      toggleButton.style.backgroundColor = "#40414f";
      toggleButton.style.color = "white";
      toggleButton.style.width = "40px";
      toggleButton.style.height = "20px";
      toggleButton.style.border = "none";
      toggleButton.style.borderRadius = "10px";
      toggleButton.style.fontSize = "12px";
      toggleButton.style.lineHeight = "20px";
      toggleButton.style.display = "flex";
      toggleButton.style.justifyContent = "center";
      toggleButton.style.alignItems = "center";

      toggleButton.addEventListener("click", function (e) {
        e.preventDefault();
        previewBox.style.display =
          previewBox.style.display === "none" ? "block" : "none";
      });

      inputBox.parentNode.insertBefore(toggleButton, previewBox);

      // Create Token Counter
      tokenCountElement = document.createElement("div");
      tokenCountElement.id = "tokenCount";
      tokenCountElement.style.color = "#808080";
      tokenCountElement.style.fontSize = "12px";
      tokenCountElement.style.marginTop = "10px";
      tokenCountElement.textContent = "Token count: 0";
      inputBox.parentNode.insertBefore(
        tokenCountElement,
        inputBox.nextSibling
      );

      // Input Event Listener
      inputBox.addEventListener("input", function () {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(function () {
          let alwaysChecked = [
            "creditCard",
            "jwt",
            "ethPrivateKey",
            "apiKey",
            "phoneNumber",
          ];
          let dataRedactor = new window.data_redactor(
            redactSettings,
            alwaysChecked
          );
          let text = inputBox.value;
          if (text !== lastInput) {
            let redactedText = dataRedactor.redact(text);
            let token_count = dataRedactor.countTokens(redactedText);

            previewBox.textContent = redactedText;
            tokenCountElement.textContent = "Token count: " + token_count;

            lastInput = text;
          }
        }, DEBOUNCE_DELAY);
      });

      // Keydown Event Listener
      inputBox.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          let alwaysChecked = [
            "creditCard",
            "jwt",
            "ethPrivateKey",
            "apiKey",
            "phoneNumber",
          ];
          let dataRedactor = new window.data_redactor(
            redactSettings,
            alwaysChecked
          );
          let text = inputBox.value;
          let redactedText = dataRedactor.redact(text);
          let token_count = dataRedactor.countTokens(redactedText);

          inputBox.value = redactedText;
          previewBox.textContent = "";
          lastInput = "";
          tokenCountElement.textContent = "Token count: 0"; // Reset the token count
        }
      });

      // Send Button Click Event Listener
      document.body.addEventListener("click", function (e) {
        let sendButton = document.querySelector(
          'button svg path[d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"]').parentNode.parentNode;
        if (!sendButton) {
          return;
        }

        let targetElement = e.target;
        do {
          if (targetElement === sendButton) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();

            if (enabled) {
              let alwaysChecked = [
                "creditCard",
                "jwt",
                "ethPrivateKey",
                "apiKey",
                "phoneNumber",
              ];
              let dataRedactor = new window.data_redactor(
                redactSettings,
                alwaysChecked
              );
              let text = inputBox.value;
              let redactedText = dataRedactor.redact(text);
              let token_count = dataRedactor.countTokens(redactedText);

              inputBox.value = redactedText;
              previewBox.textContent = "";
              lastInput = "";
              tokenCountElement.textContent = "Token count: 0"; // Reset the token count
            }

            // Programmatically trigger a 'Enter' key press event
            let enterKeyEvent = new KeyboardEvent("keydown", {
              key: "Enter",
              bubbles: true,
            });
            inputBox.dispatchEvent(enterKeyEvent);
            return;
          }
          targetElement = targetElement.parentNode;
        } while (targetElement);
      });
    });
  }

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      for (let node of mutation.removedNodes) {
        if (node === inputBox || node.contains(inputBox)) {
          cleanUp();
          return;
        }
      }
      if (mutation.addedNodes.length && !inputBox) {
        inputBox = document.querySelector("#prompt-textarea");
        if (inputBox) {
          updateInputBox();
        }
      }
    });
  });

function startObserver() {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

startObserver(); // Start observing initially

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let key in changes) {
    if (key === "redactSettings" || key === "enabled") {
      updateInputBox(); // re-initialize with new settings
    }
  }
});
}
