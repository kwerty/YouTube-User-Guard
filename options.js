function loadOptions() {

	if (!localStorage['notfirst'])
		document.getElementById('MessageSpan').innerHTML = 'Thanks for downloading YouTube User Guard';
	
	localStorage['notfirst'] = true;

	updateStatus(localStorage['enabled'] ? true : false);
}

function updateStatus(enabled) {
	document.getElementById('EnabledMessage').style.display = enabled ? '' : 'none';
	document.getElementById('DisabledMessage').style.display = !enabled ? '' : 'none';
}

function disable() {
	chrome.extension.sendMessage({logout: true});
	updateStatus(false);
}

window.addEventListener('load', function() {

	loadOptions();
		
	document.getElementById('ResetButton').addEventListener('click', disable);

});

