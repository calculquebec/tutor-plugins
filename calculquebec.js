function setLanguage(lang) {
	var expires = "";
	var date = new Date();
	date.setTime(date.getTime() + (14*24*60*60*1000));
	expires = "; expires=" + date.toUTCString();
	document.cookie = "openedx-language-preference=" + lang + expires + "; path=/";
	reload();
}
