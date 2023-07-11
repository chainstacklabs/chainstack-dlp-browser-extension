// popup.js
document.addEventListener("DOMContentLoaded", function () {
  // Load the settings
  chrome.storage.sync.get(["enabled", "redactSettings"], function (items) {
    // Set the state of the checkboxes based on the settings
    document.querySelector("#enabledCheckbox").checked = items.enabled;
    document.querySelector("#creditCard").checked =
      items.redactSettings.creditCard;
    // Do this for each type of data
    document.querySelector("#jwt").checked = items.redactSettings.jwt;
    document.querySelector("#rpcEndpoint").checked =
      items.redactSettings.rpcEndpoint;
    document.querySelector("#ethPrivateKey").checked =
      items.redactSettings.ethPrivateKey;
    document.querySelector("#ethAddress").checked =
      items.redactSettings.ethAddress;
    document.querySelector("#apiKey").checked = items.redactSettings.apiKey;
    document.querySelector("#phoneNumber").checked =
      items.redactSettings.phoneNumber;
    document.querySelector("#personNameCheckbox").checked =
      items.redactSettings.names;
    document.querySelector("#locationCheckbox").checked =
      items.redactSettings.locations;
  });

  // When a checkbox is clicked, update the settings
  document.querySelector("#enabledCheckbox").onclick = function () {
    chrome.storage.sync.set({ enabled: this.checked });
  };
  document.querySelector("#creditCard").onclick = function () {
    chrome.storage.sync.get(
      "redactSettings",
      function (items) {
        items.redactSettings.creditCard = this.checked;
        chrome.storage.sync.set({ redactSettings: items.redactSettings });
      }.bind(this)
    );
  };
  // Do this for each type of data
  document.querySelector("#jwt").onclick = function () {
    chrome.storage.sync.get(
      "redactSettings",
      function (items) {
        items.redactSettings.jwt = this.checked;
        chrome.storage.sync.set({ redactSettings: items.redactSettings });
      }.bind(this)
    );
  };
  // ... repeat for all other checkboxes ...
  document.querySelector("#personNameCheckbox").onclick = function () {
    chrome.storage.sync.get(
      "redactSettings",
      function (items) {
        items.redactSettings.names = this.checked;
        chrome.storage.sync.set({ redactSettings: items.redactSettings });
      }.bind(this)
    );
  };
  document.querySelector("#locationCheckbox").onclick = function () {
    chrome.storage.sync.get(
      "redactSettings",
      function (items) {
        items.redactSettings.locations = this.checked;
        chrome.storage.sync.set({ redactSettings: items.redactSettings });
      }.bind(this)
    );
  };
});
