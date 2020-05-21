document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', () => {
        chrome.tabs.query({currentWindow: true, active : true}, tabArray => {
            const tabID = tabArray[0].id;   // gets the current tab ID (vrv)

            chrome.tabs.sendMessage(tabID, {message: 'hi'});
        });
    });
});