# SpoilerFree

SpoilerFree is a Chrome extension that blocks unwanted spoilers and content from ruining your web browsing experience. It works on all webpages including social media sites, like Facebook and Twitter.

File descriptions:

content.js - Main Javascript file that searches through the loaded webpage and if a term that is on the "blocked words list" is found, it covers the relevant HTML element. An event listener is used to run the search again when any HTML elements are altered or if any new nodes are added.

popup.html (.js .css) - HTML file and associated JS and CSS files for the popup window that displays when the Chrome extension icon is clicked. It allows you to add words to the "blocked words list" and to toggle an optional full screen warning if a webpage contains any blocked terms.

background.js - Background script that stores the blocked words list and handles message passing between the popup window and the content script.




