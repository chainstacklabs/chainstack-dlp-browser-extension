document.addEventListener("DOMContentLoaded", function () {
  // List of checkbox IDs
  let checkboxes = [
    "enabledCheckbox",
    "creditCard",
    "jwt",
    "rpcEndpoint",
    "ethPrivateKey",
    "ethAddress",
    "apiKey",
    "phoneNumber",
    "names",
    "locations",
  ];

  // Checkboxes that are always checked
  let alwaysChecked = [
    "creditCard",
    "jwt",
    "ethPrivateKey",
    "apiKey",
    "phoneNumber",
  ];

  // Initialize redactSettings if it does not exist
  chrome.storage.sync.get("redactSettings", function (items) {
    if (!items.redactSettings) {
      let initialRedactSettings = {};
      for (let checkboxID of checkboxes) {
        if (checkboxID !== "enabledCheckbox") {
          initialRedactSettings[checkboxID] =
            alwaysChecked.includes(checkboxID);
        }
      }
      chrome.storage.sync.set({ redactSettings: initialRedactSettings });
    }
  });

  // Load the settings
  chrome.storage.sync.get(["enabled", "redactSettings"], function (items) {
    // Set the state of the checkboxes based on the settings
    for (let checkboxID of checkboxes) {
      if (checkboxID === "enabledCheckbox") {
        document.querySelector(`#${checkboxID}`).checked = items.enabled;
      } else {
        document.querySelector(`#${checkboxID}`).checked =
          items.redactSettings[checkboxID];
      }
    }

    // Ensure alwaysChecked checkboxes are checked and disabled
    alwaysChecked.forEach(function (checkboxID) {
      let checkbox = document.querySelector(`#${checkboxID}`);
      checkbox.checked = true;
      checkbox.disabled = true;
    });
  });

  // When a checkbox is clicked, update the settings
  checkboxes.forEach(function (checkboxID) {
    document.querySelector(`#${checkboxID}`).onclick = function () {
      if (checkboxID === "enabledCheckbox") {
        chrome.storage.sync.set({ enabled: this.checked });
      } else if (!alwaysChecked.includes(checkboxID)) {
        chrome.storage.sync.get(
          "redactSettings",
          function (items) {
            items.redactSettings[checkboxID] = this.checked;
            chrome.storage.sync.set({ redactSettings: items.redactSettings });
          }.bind(this)
        );
      }
    };
  });

  // When the Select All button is clicked, check or uncheck all checkboxes
  document.querySelector("#selectAll").onclick = function () {
    let allChecked = true;
    for (let checkboxID of checkboxes) {
      if (
        checkboxID !== "enabledCheckbox" &&
        !alwaysChecked.includes(checkboxID)
      ) {
        if (!document.querySelector(`#${checkboxID}`).checked) {
          allChecked = false;
          break;
        }
      }
    }

    for (let checkboxID of checkboxes) {
      if (
        checkboxID !== "enabledCheckbox" &&
        !alwaysChecked.includes(checkboxID)
      ) {
        document.querySelector(`#${checkboxID}`).checked = !allChecked;
      }
    }

    let newSettings = {};
    for (let checkboxID of checkboxes) {
      if (
        checkboxID !== "enabledCheckbox" &&
        !alwaysChecked.includes(checkboxID)
      ) {
        newSettings[checkboxID] = document.querySelector(
          `#${checkboxID}`
        ).checked;
      }
    }

    chrome.storage.sync.set({ redactSettings: newSettings });
  };
});
