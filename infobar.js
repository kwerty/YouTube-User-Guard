function dismiss(action) {
	chrome.extension.sendMessage({'dismiss': true, 'action': action});
	window.close();
}

window.addEventListener('load', function() {

	document.getElementById('YesButton').addEventListener('click', function() {
		dismiss(true);
	});
	
	document.getElementById('NoButton').addEventListener('click', function() {
		dismiss(false);
	});

});