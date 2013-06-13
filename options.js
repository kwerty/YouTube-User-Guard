
window.addEventListener('load', function() {

	if (localStorage['firstTime']) {
		document.getElementById('FirstTime').style.display = null;
        localStorage.removeItem('firstTime');
    }
    
	updateStatus(localStorage['active']);
		
	document.getElementById('DeactivateButton').addEventListener('click', function() {
        chrome.extension.sendMessage({disableGuard: true});
        updateStatus(false);
    });

});

function updateStatus(active) {
	document.getElementById('Active').style.display = active ? null : 'none';
	document.getElementById('NotActive').style.display = !active ? null : 'none';
}

