
window.addEventListener('load', function() {

    version = chrome.app.getDetails().version;
    
    if (localStorage['version'] != version) {
    
        localStorage['version'] = version;
        localStorage['firstTime'] = version;
        
        chrome.tabs.create({url:chrome.extension.getURL('options.html'), selected: true});
        
    }

});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	if (request['showInfobar'] && !localStorage['active']) {

        chrome.cookies.get({url: 'http://youtube.com', name: 'SID'}, function(cookie) {
            if (cookie)
                chrome.experimental.infobars.show({tabId: sender.tab.id, path: 'infobar.html'});
        });

	}
	
	else if (request['enableGuard']) {
        chrome.cookies.get({url: 'http://youtube.com', name: 'SID'}, saveYoutubeCookies);
        chrome.cookies.get({url: 'http://youtube.com', name: 'HSID'}, saveYoutubeCookies);
        chrome.cookies.get({url: 'https://youtube.com', name: 'SSID'}, saveYoutubeCookies);
	}
	
	else if (request['disableGuard']) {
        localStorage.removeItem('active');
        localStorage.removeItem('SID');
        localStorage.removeItem('HSID');
        localStorage.removeItem('SSID');
	}
	

});
 
chrome.cookies.onChanged.addListener(function(info) {

	if (!localStorage['active'] ||
		info.cookie.domain.slice(-12) != '.youtube.com' || 
		[ 'SID', 'HSID', 'SSID' ].indexOf(info.cookie.name) == -1)
        return;
        
    scheme = info.cookie.name != 'SSID' ? 'http' : 'https';
    
	chrome.cookies.get({url: scheme + '://youtube.com', name: info.cookie.name}, function(cookie) {
		
		if (cookie && 
            cookie.value == localStorage[info.cookie.name] &&
			cookie.expirationDate == 3133333337)
			return;

		chrome.cookies.set({
			name: info.cookie.name,
			value: localStorage[info.cookie.name],
			url: (info.cookie.name != 'SSID' ? 'http' : 'https') + '://youtube.com',
			domain: '.youtube.com',
			path: '/',
            secure: info.cookie.name == 'SSID',
			expirationDate: 3133333337,
		});

		
	});
	
	
});

function saveYoutubeCookies(cookie) {

    if (!cookie)
        return;
        
    localStorage[cookie.name] = cookie.value;
    
    if (localStorage['SID'] && localStorage['HSID'] && localStorage['SSID']) {
    
        localStorage['active'] = true;
        
        chrome.cookies.getAll({name: 'SID'}, removeGoogleCookies);
        chrome.cookies.getAll({name: 'HSID'}, removeGoogleCookies);
        chrome.cookies.getAll({name: 'SSID'}, removeGoogleCookies);
        
    }
}

function removeGoogleCookies(cookies) {

    cookies.forEach(function(cookie) {

        if (cookie.value != localStorage[cookie.name] ||
            cookie.domain.slice(-12) == '.youtube.com')
            return;

        scheme = cookie.name != 'SSID' ? 'http' : 'https';
        
        chrome.cookies.remove({url: scheme + '://' + cookie.domain, name: cookie.name});

    });
    
}

