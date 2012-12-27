
// this is a little hack which forces the form to raise the onsubmit event
// we can then listen to the onsubmit event in our content script

document.logoutForm.submitOrig = document.logoutForm.submit;

document.logoutForm.submit = function() {
	this.onsubmit();
	this.submitOrig();
};