
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	if (request.showInfobar) {

		if (localStorage['enabled'])
			return;

		getCookie('SID', function(cookie) {

			if (!cookie) {
				console.log("SID not found, infobar will not be shown");
				return;
			}
			
			console.log("SID found, displaying infobar");
			
			chrome.experimental.infobars.show({
				tabId: sender.tab.id, 
				path: 'infobar.html'
			});
			
		});
		
	}
	
	else if (request.enable) {

		removeGoogleCookies();
	
		console.log('Saving a copy of cookies to storage');
		
		localStorage['enabled'] = true;
		
		getCookie('SID', function(cookie) {
			if (!cookie)
				console.log('Could not get SID cookie');
				
			localStorage['SID'] = JSON.stringify(cookie);
		});
	
		getCookie('SSID', function(cookie) {
			if (!cookie)
				console.log('Could not get SSID cookie');
				
			localStorage['SSID'] = JSON.stringify(cookie);
		});
		
		getCookie('HSID', function(cookie) {
			if (!cookie)
				console.log('Could not get HSID cookie');
				
			localStorage['HSID'] = JSON.stringify(cookie);
		});
	
	}
	
	else if (request.logout) {
		disable();
	}
	
});

function setCookieFromStorage(cookieName) {

	console.log(cookieName + " restoring stored cookie");
	
	cookie = JSON.parse(localStorage[cookieName]);
	
	cookie["url"] = "http://youtube.com";
	delete cookie["hostOnly"];
	delete cookie["session"];
	
	chrome.cookies.set(cookie, function(result) {
	
		if (!result)
			console.log(cookieName + " error while setting cookie");
		
	});

}

chrome.cookies.onChanged.addListener(function(info) {

	if (!localStorage['enabled'])
		return;
	
	if (info.cookie.domain.slice(-12) != '.youtube.com')
		return;
	
	console.log("cookie name = " + info.cookie.name);
	
	if (info.cookie.name != "HSID" && info.cookie.name != "SID" && info.cookie.name != "SSID") {
		console.log("returning " + info.cookie.name);
		return;
		}
		
	console.log(info.cookie.name + " change event");

	getCookie(info.cookie.name, function(cookie) {
	
		if (!cookie) {
			console.log(info.cookie.name + " has been removed");
		}
		
		if (localStorage[info.cookie.name].value != cookie.value || localStorage[info.cookie.name].expirationDate || cookie.expirationDate) {
			console.log(info.cookie.name + " matches stored cookie, no further action");
			return;
		}
		
		setCookieFromStorage(info.cookie.name);

	});
	
	
});

function disable() {
	localStorage.removeItem('enabled');
	localStorage.removeItem('SID');
	localStorage.removeItem('HSID');
	localStorage.removeItem('SSID');
}

function removeGoogleCookies() {

	console.log('Removing Google cookies');
	
	chrome.cookies.getAll({}, function(cookies) {
	
		cookies.forEach(function(cookie) {

			if ((cookie.name == "HSID" || cookie.name == "SID" || cookie.name == "SSID") && isGoogle(cookie.domain)) {
			
				console.log('Removing cookie ' + cookie.domain + ' ' + cookie.name);
				
				chrome.cookies.remove({url: 'http://' + cookie.domain, name: cookie.name});
				chrome.cookies.remove({url: 'https://' + cookie.domain, name: cookie.name});
				
			}
			
		});
	

	});

}

//todo: make this work better
function isGoogle(domain) {
	if (domain.split('.', 2)[1] == 'google')
		return true;
}

function getCookie(name, callback) {
	console.log(name + "---------------");
	chrome.cookies.getAll({domain: 'youtube.com', name: name}, function (cookies) {
	
		if (!cookies)
			callback();
			
		callback({
			path: "http://youtube.com",
			name: cookies[0].name,
			value: cookies[0].value,
			domain: cookies[0].domain,
			path: cookies[0].path,
			secure: cookies[0].secure,
			expirationDate: cookies[0].expirationDate,
		});
		
	});
}

window.addEventListener('load', function() {

	if (localStorage.hasRunBefore)
		return;
		
	chrome.tabs.create({
		url: chrome.extension.getURL('options.html'), 
		selected: true,
	});
	
	localStorage.hasRunBefore = true;

});
