// content.js

let inputBox = null;
let lastInput = "";

function updateInputBox() {
  chrome.storage.sync.get("redactSettings", function (items) {
    let dataRedactor = new window.data_redactor(items.redactSettings);

    inputBox = document.querySelector("#prompt-textarea");
    if (!inputBox) {
      console.error("Input box not found");
      return;
    }

    let previewBox = document.querySelector("#previewBox");
    if (!previewBox) {
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
    }

    let toggleButton = document.querySelector("#toggleButton");
    if (!toggleButton) {
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
    }

    let tokenCountElement = document.querySelector("#tokenCount");
    if (!tokenCountElement) {
      tokenCountElement = document.createElement("div");
      tokenCountElement.id = "tokenCount";
      tokenCountElement.style.color = "#808080";
      tokenCountElement.style.fontSize = "12px";
      tokenCountElement.style.marginTop = "10px";
      tokenCountElement.textContent = "Token count: 0";
      inputBox.parentNode.insertBefore(tokenCountElement, inputBox.nextSibling);
    }

    inputBox.addEventListener("input", function () {
      let text = inputBox.value;
      if (text !== lastInput) {
        let redactedText = dataRedactor.redact(text);
        let token_count = dataRedactor.countTokens(redactedText);

        previewBox.textContent = redactedText;
        tokenCountElement.textContent = "Token count: " + token_count;

        lastInput = text;
      }
    });

    inputBox.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        let text = inputBox.value;
        let redactedText = dataRedactor.redact(text);
        let token_count = dataRedactor.countTokens(redactedText);

        inputBox.value = redactedText;
        previewBox.textContent = "";
        lastInput = "";
      }
    });
  });
}

let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length && !inputBox) {
      inputBox = document.querySelector("#prompt-textarea");
      if (inputBox) {
        observer.disconnect();
        updateInputBox();
        startObserver(); // Restart the observer
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
