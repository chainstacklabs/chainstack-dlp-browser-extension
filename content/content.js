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
  const alwaysChecked = [
    "creditCard",
    "jwt",
    "ethPrivateKey",
    "phoneNumber",
  ]; 

  function redactAndCount(text) {
    const dataRedactor = new window.data_redactor(
      redactSettings,
      alwaysChecked
    );
    const redactedText = dataRedactor.redact(text);
    const tokenCount = dataRedactor.countTokens(redactedText);

    return { redactedText, tokenCount };
  }

  function cleanUp() {
    if (previewBox) previewBox.remove();
    if (toggleButton) toggleButton.remove();
    if (clearButton) clearButton.remove(); 
    if (tokenCountElement) tokenCountElement.remove();
  
    previewBox = null;
    toggleButton = null;
    clearButton = null;
    tokenCountElement = null;
    inputBox = null;
  }
  
  let clearButton = null;

  function updateInputBox() {
    chrome.storage.sync.get(["enabled", "redactSettings"], function (items) {
      enabled = items.enabled;
      redactSettings = items.redactSettings;

      if (!enabled) {
        cleanUp();
        return;
      }

      console.log("Settings: ", redactSettings);

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
      previewBox.style.height = 'auto';
      previewBox.style.maxHeight = "300px";
      previewBox.style.overflow = "auto";
      inputBox.parentNode.insertBefore(previewBox, inputBox);

      // Create Toggle Button
      toggleButton = document.createElement("button");
      toggleButton.id = "toggleButton";
      toggleButton.textContent = "↕";
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

      // Create Clear Button
      clearButton = document.createElement("button");
      clearButton.id = "clearButton";
      clearButton.textContent = "Clear";
      clearButton.style.position = "absolute";
      clearButton.style.left = "60px";
      clearButton.style.top = "-30px";
      clearButton.style.backgroundColor = "#40414f";
      clearButton.style.color = "white";
      clearButton.style.width = "60px";
      clearButton.style.height = "20px";
      clearButton.style.border = "none";
      clearButton.style.borderRadius = "10px";
      clearButton.style.fontSize = "12px";
      clearButton.style.lineHeight = "20px";
      clearButton.style.display = "flex";
      clearButton.style.justifyContent = "center";
      clearButton.style.alignItems = "center";

      clearButton.addEventListener("click", function (e) {
        e.preventDefault();
        inputBox.value = "";
        previewBox.textContent = "";
        tokenCountElement.textContent = "Token count: 0";
      });

      inputBox.parentNode.insertBefore(clearButton, toggleButton.nextSibling);

      // Create Token Counter
      tokenCountElement = document.createElement("div");
      tokenCountElement.id = "tokenCount";
      tokenCountElement.style.color = "#808080";
      tokenCountElement.style.fontSize = "12px";
      tokenCountElement.style.marginTop = "10px";
      tokenCountElement.textContent = "Token count: 0";
      inputBox.parentNode.insertBefore(tokenCountElement, inputBox.nextSibling);

      // Input Event Listener
      inputBox.addEventListener("input", function () {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(function () {
          const text = inputBox.value;
          if (text !== lastInput) {
            const { redactedText, tokenCount } = redactAndCount(text); 

            previewBox.textContent = redactedText;
            tokenCountElement.textContent = "Token count: " + tokenCount;

            lastInput = text;
          }
        }, DEBOUNCE_DELAY);
      });

      // Keydown Event Listener
      inputBox.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          const { redactedText } = redactAndCount(inputBox.value); 

          inputBox.value = redactedText;
          previewBox.textContent = "";
          lastInput = "";
          tokenCountElement.textContent = "Token count: 0";
        }
      });

  // Returns the first element matching the XPath expression
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

document.body.addEventListener("click", function (e) {
  let sendButton = getElementByXpath('//button[contains(@class, "enabled:bg-brand-purple")]');
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
        const { redactedText } = redactAndCount(inputBox.value);

        // Clear the textbox
        inputBox.value = '';
        inputBox.dispatchEvent(new Event('input', { bubbles: true }));

        // Insert the redacted text
        inputBox.focus();
        document.execCommand('insertText', false, redactedText);

        // Reset other UI elements
        previewBox.textContent = "";
        lastInput = "";
        tokenCountElement.textContent = "Token count: 0";

        // Programmatically trigger a 'Enter' key press event
        let enterKeyEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
        });
        inputBox.dispatchEvent(enterKeyEvent);
      }
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

  startObserver();

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let key in changes) {
      if (key === "redactSettings" || key === "enabled") {
        updateInputBox();
      }
    }
  });
}
