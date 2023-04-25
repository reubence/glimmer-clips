// Helper function to generate unique IDs for highlights
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Save highlights to the storage
function saveHighlight(highlight) {
  chrome.storage.sync.get("highlights", (data) => {
    const highlights = data.highlights || [];
    highlights.push(highlight);
    chrome.storage.sync.set({ highlights }, () => {
      console.log("Highlight saved");
    });
  });
}

// Create a new element to wrap the highlighted text
function createHighlightElement(text, id) {
  const span = document.createElement("span");
  span.innerText = text;
  span.className = "saved-highlight";
  span.dataset.id = id;
  return span;
}

// Handle the Cmd+Ctrl+S keypress event
document.addEventListener("keydown", (event) => {
  if (event.metaKey && event.ctrlKey && event.key === "s") {
    event.preventDefault();
    const selectedText = window.getSelection();
    const selectedRange = selectedText?.getRangeAt(0);
    if (selectedText && selectedRange) {
      const text = selectedText.toString().trim();
      const id = generateId();
      const url = window.location.href;

      const highlightElement = createHighlightElement(text, id);
      selectedRange.surroundContents(highlightElement);
      selectedText.removeAllRanges();

      saveHighlight({
        id,
        text,
        url,
        timestamp: Date.now(),
      });
    }
  }
});

// Restore highlights when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("highlights", (data) => {
    const highlights = data.highlights || [];
    const currentUrl = window.location.href;

    highlights
      .filter((highlight) => highlight.url === currentUrl)
      .forEach((highlight) => {
        const regex = new RegExp(
          `(${highlight.text.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")})`,
          "g"
        );
        document.body.innerHTML = document.body.innerHTML.replace(
          regex,
          `<span class="saved-highlight" data-id="${highlight.id}">$1</span>`
        );
      });
  });
});
