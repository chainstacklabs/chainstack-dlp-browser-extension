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
