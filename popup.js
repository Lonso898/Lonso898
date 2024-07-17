document.getElementById('highlightButton').addEventListener('click', function() {
  const wordList = document.getElementById('wordList').value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "highlight", words: wordList});
  });
});

document.getElementById('findButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "findNext"});
  });
});

document.getElementById('clearButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "clearHighlights"});
  });
});

// Load saved words when popup opens
chrome.storage.sync.get('highlightWords', function(data) {
  if (data.highlightWords) {
    document.getElementById('wordList').value = data.highlightWords;
  }
});