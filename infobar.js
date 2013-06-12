window.addEventListener('load', function() {

	document.getElementById('YesButton').addEventListener('click', function() {
	
		chrome.extension.sendMessage({enable: true});
		window.close();
		
	});
	
	document.getElementById('NoButton').addEventListener('click', function() {
		window.close();
	});

});