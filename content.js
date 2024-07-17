let currentFindIndex = -1;
let highlightedElements = [];

function highlightWords(words) {
  clearHighlights();
  const wordList = words.split(',').map(word => word.trim()).filter(word => word.length > 0);
  
  if (wordList.length === 0) return;

  const textNodes = getTextNodes(document.body);
  
  wordList.forEach((word, index) => {
    const regex = new RegExp(`(${word})`, 'gi');
    textNodes.forEach(node => {
      const matches = node.textContent.match(regex);
      if (matches) {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(regex, `<mark class="highlight highlight-${index}">$1</mark>`);
        node.parentNode.replaceChild(span, node);
        highlightedElements.push(...span.getElementsByTagName('mark'));
      }
    });
  });

  // Save highlights
  const highlightData = {
    url: window.location.href,
    words: words
  };
  chrome.storage.sync.set({[highlightData.url]: highlightData});
}

function getTextNodes(node) {
  const textNodes = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  let currentNode;
  while (currentNode = walker.nextNode()) {
    textNodes.push(currentNode);
  }
  return textNodes;
}

function findNext() {
  if (highlightedElements.length === 0) return;
  
  currentFindIndex = (currentFindIndex + 1) % highlightedElements.length;
  const element = highlightedElements[currentFindIndex];
  element.scrollIntoView({behavior: "smooth", block: "center"});
  element.classList.add('current-find');
  setTimeout(() => element.classList.remove('current-find'), 1000);
}

function clearHighlights() {
  document.querySelectorAll('mark.highlight').forEach(el => {
    el.outerHTML = el.innerHTML;
  });
  highlightedElements = [];
  currentFindIndex = -1;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case "highlight":
      highlightWords(request.words);
      break;
    case "findNext":
      findNext();
      break;
    case "clearHighlights":
      clearHighlights();
      break;
  }
});

// Load and apply saved highlights
chrome.storage.sync.get(window.location.href, function(data) {
  if (data[window.location.href]) {
    highlightWords(data[window.location.href].words);
  }
});