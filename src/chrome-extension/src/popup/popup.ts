document.addEventListener("DOMContentLoaded", () => {
  const currentUrlEl = document.getElementById("current-url");
  const saveHighlightBtn = document.getElementById("save-highlight");

  // Display the current URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab && tab.url) {
      currentUrlEl.innerText = tab.url;
    }
  });

  // Save highlight on button click
  saveHighlightBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: "SAVE_HIGHLIGHT_FROM_POPUP" });
      }
    });
  });
});

document
  .getElementById("login-form")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    chrome.runtime.sendMessage({ type: "LOGIN", payload: { email, password } });
  });
