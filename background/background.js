chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ enabled: true }, function () {
    console.log("DataRedactor is now enabled");
  });

  chrome.storage.sync.set({
    redactSettings: {
      creditCard: true,
      jwt: true,
      rpcEndpoint: true,
      ethPrivateKey: true,
      ethAddress: true,
      apiKey: true,
      phoneNumber: true,
      names: true,
      locations: true,
    },
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["dist/bundle.js"],
      })
      .then(() => {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["content/content.js"],
        });
      });
  }
});
