# SpoilerFree

SpoilerFree is a Chrome extension that blocks unwanted spoilers and content from ruining your web browsing experience. It works on all webpages including social media sites, like Facebook and Twitter.

File descriptions:

manifest.json - Specifies the files and logo icons to be used for the Chrome extension, as well as setting some options/permissions.

content.js - Main Javascript file that searches through the loaded webpage and if a term that is on the "blocked words list" is found, it covers the relevant HTML element. The DOM MutationObserver event listener is used to fire the search again if any HTML nodes are added to the webpage or if their text is altered.

popup.html (.js .css) - HTML file and associated JS and CSS files for the popup window that displays when the Chrome extension icon is clicked. It allows you to add words to the "blocked words list" and to toggle an optional full screen warning if a webpage contains any blocked terms.

background.js - Background script that stores the blocked words list and handles message passing between the popup window and the content script.

spoil_styles.css - Styling file for the full screen overlay and the spoiler blocking cover elements.



