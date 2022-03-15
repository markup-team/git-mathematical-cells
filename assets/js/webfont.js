(function () {
	var link = document.createElement('link');
    link.href = "https://fonts.gstatic.com";
    link.rel = 'preconnect';
    document.getElementsByTagName('head')[0].appendChild(link); // for IE6

	var link2 = document.createElement('link');
    link2.href = "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap";
    link2.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link2); // for IE6
})();
