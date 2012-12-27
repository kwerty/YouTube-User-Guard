
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	if (request.show) {
	
		if (localStorage['enabled']) return;
		
		getCookies(function(sid, hsid) {
			if (!sid) return;
			chrome.experimental.infobars.show({tabId: sender.tab.id, path: 'infobar.html'});
		});
		
	}
	
	else if (request.dismiss) {
		
		getCookies(function(sid, hsid) {
		
			if (!sid) return;
			
			if (request.action) localStorage['enabled'] = true;
			localStorage['SID'] = sid.value;
			localStorage['HSID'] = hsid.value;
			
			removeGoogleCookies();
		
		});

	}
	
	else if (request.logout) {
		
		disable();
		
	}
	

});

chrome.cookies.onChanged.addListener(function(info) {

	if (!localStorage['enabled'])
		return;
	
	if (info.cookie.domain != '.youtube.com')
		return;
	
	if ((info.cookie.name != 'SID') && (info.cookie.name != 'HSID'))
		return;
		
	console.log(info.cookie.name + ' has changed');

	console.log(info.cookie.name + ' getting new details');
	
	chrome.cookies.get({url: 'http://youtube.com', name: info.cookie.name}, function(c) {
		
		console.log(info.cookie.name + ' got details');
		
		if (c && 
			(c.value == localStorage[info.cookie.name]) &&
			(c.expirationDate == 1999999999)) {
		
			console.log(info.cookie.name + ' value and expiration match stored values, nothing will be changed');
			
			return;
		}
		
		console.log(info.cookie.name + ' value/expiration do not match stored values, will be changed');
		
		var cookie = {
			name: info.cookie.name,
			value: localStorage[info.cookie.name],
			url: 'http://youtube.com',
			domain: '.youtube.com',
			path: '/',
			expirationDate: 1999999999
		};
		
		console.log(info.cookie.name + ' replacing cookie with our own');
		
		chrome.cookies.set(cookie, function(info) {
		
			if (!info)
				console.log(cookie.name + ' could not be set');
			
		});

		
	});
	
	
});

function disable() {

	localStorage.removeItem('enabled');
	localStorage.removeItem('SID');
	localStorage.removeItem('HSID');
	
	chrome.cookies.remove({url: 'http://youtube.com', name: 'SID'});
	chrome.cookies.remove({url: 'http://youtube.com', name: 'HSID'});
	
}

function removeGoogleCookies() {

	chrome.cookies.getAll({}, function(cookies) {
	
		cookies.forEach(function(cookie) {

			if (((cookie.name == 'HSID') || (cookie.name == 'SID')) && isGoogle(cookie.domain)) {
			
				console.log('Removing cookie ' + cookie.domain + ' ' + cookie.name);
				
				chrome.cookies.remove({url: 'http://' + cookie.domain, name: cookie.name});
				
			}
			
		});
	

	});

}

function isGoogle(domain) {
	if (domain.split('.', 2)[1] == 'google')
		return true;
}

function getCookies(callback) {
	chrome.cookies.get({url: 'http://youtube.com', name: 'SID'}, function(sid) {
		if (!sid) callback();
		chrome.cookies.get({url: 'http://youtube.com', name: 'HSID'}, function(hsid) {
			if (!hsid) callback();
			callback(sid, hsid);
		});
	});
}

window.addEventListener('load', function() {

	if (!localStorage['notfirst'])
		chrome.tabs.create({url:chrome.extension.getURL('options.html'), selected: true});

});
