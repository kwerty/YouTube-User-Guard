window.addEventListener('load', function() {

	document.getElementById('YesButton').addEventListener('click', function() {
        chrome.extension.sendMessage({'enableGuard': true});
        window.close();
	});
	
	document.getElementById('NoButton').addEventListener('click', function() {
        window.close();
	});

});