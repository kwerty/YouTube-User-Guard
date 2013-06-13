
//hack to add 'onsubmit' event to logout form
var patch = document.createElement('script');  
patch.src = chrome.extension.getURL('patch.js')
document.body.appendChild(patch);

document.forms['logoutForm'].onsubmit = function() {
	chrome.extension.sendMessage({disableGuard: true});
}

chrome.extension.sendMessage({showInfobar: true});