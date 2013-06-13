
document.logoutForm.originalSubmit = document.logoutForm.submit;

document.logoutForm.submit = function() {
	this.onsubmit();
	this.originalSubmit();
};