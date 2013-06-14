
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
        chrome.cookies.get({url: 'https://youtube.com', name: 'APISID'}, saveYoutubeCookies);
        chrome.cookies.get({url: 'https://youtube.com', name: 'SAPISID'}, saveYoutubeCookies);
	}
	
	else if (request['disableGuard']) {
        localStorage.removeItem('active');
        localStorage.removeItem('SID');
        localStorage.removeItem('HSID');
        localStorage.removeItem('SSID');
        localStorage.removeItem('APISID');
        localStorage.removeItem('SAPISID');
	}
	

});
 
chrome.cookies.onChanged.addListener(function(info) {

	if (!localStorage['active'] ||
		info.cookie.domain.slice(-12) != '.youtube.com' || 
		[ 'SID', 'HSID', 'SSID', 'APISID', 'SAPISID' ].indexOf(info.cookie.name) == -1)
        return;
        
	chrome.cookies.get({url: getScheme(info.cookie.name) + '://youtube.com', name: info.cookie.name}, function(cookie) {
		
		if (cookie && 
            cookie.value == localStorage[info.cookie.name] &&
			cookie.expirationDate == 3133333337)
			return;

		chrome.cookies.set({
			name: info.cookie.name,
			value: localStorage[info.cookie.name],
			url: getScheme(info.cookie.name) + '://youtube.com',
			domain: '.youtube.com',
			path: '/',
            secure: getScheme(info.cookie.name) == 'https',
			expirationDate: 3133333337,
		});

		
	});
	
	
});

function getScheme(cookieName) {
    return ['SSID', 'SAPISID'].indexOf(cookieName) != -1 ? 'https' : 'http';
}

function saveYoutubeCookies(cookie) {

    if (!cookie)
        return;
        
    localStorage[cookie.name] = cookie.value;
    
    if (localStorage['SID'] && 
        localStorage['HSID'] && 
        localStorage['SSID'] &&
        localStorage['APISID'] && 
        localStorage['SAPISID']) {
    
        localStorage['active'] = true;
        
        chrome.cookies.getAll({name: 'SID'}, removeGoogleCookies);
        chrome.cookies.getAll({name: 'HSID'}, removeGoogleCookies);
        chrome.cookies.getAll({name: 'SSID'}, removeGoogleCookies);
        chrome.cookies.getAll({name: 'APISID'}, removeGoogleCookies);
        chrome.cookies.getAll({name: 'SAPISID'}, removeGoogleCookies);
        
        chrome.cookies.remove({url: 'https://accounts.google.com', name: 'GAPS'});
        chrome.cookies.remove({url: 'https://accounts.google.com', name: 'GALX'});
        chrome.cookies.remove({url: 'https://accounts.google.com', name: 'LSID'});

    }
}

function removeGoogleCookies(cookies) {

    cookies.forEach(function(cookie) {

        if (cookie.value != localStorage[cookie.name] &&
            cookie.domain.slice(-12) == '.youtube.com')
            return;

        chrome.cookies.remove({url: getScheme(cookie.name) + '://' + cookie.domain, name: cookie.name});

    });
    
}

