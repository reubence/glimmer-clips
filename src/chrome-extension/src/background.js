chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "LOGIN") {
    const { email, password } = message.payload;
    const { error, user } = await supabase.auth.signIn({ email, password });

    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      console.log("User logged in:", user);
    }
  }

  if (message.type === "SAVE_HIGHLIGHT") {
    chrome.storage.sync.get("highlights", (data) => {
      const highlights = data.highlights || [];
      highlights.push({
        text: message.payload,
        url: sender.tab?.url,
        timestamp: Date.now(),
      });
      chrome.storage.sync.set({ highlights }, () => {
        console.log("Highlight saved");
      });
    });
  }
});
