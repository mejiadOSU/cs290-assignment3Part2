/* THIS CODE IS A MIX BETWEEN THE CODE IN THE CLASS VIDEOS FOUND HERE: https://oregonstate.instructure.com/courses/1516847/pages/week-4-javascript-part-2?module_item_id=16245970 */ 

var settings = null;

/* ON LOADING OF THE PAGE */
window.onload = function () {
  var settingsStr = localStorage.getItem('userSettings');
    if( settingsStr === null ) {
	  settings = { 'gists':[]};
	  localStorage.setItem('userSettings', JSON.stringify(settings));
    }
  else {
    settings = JSON.parse(settingsStr);
  }
  	getGistData();
}

/* CREATE LIST AND STORE IN SETTINGS */
function createGistList(url, description) {
	this.url = url;
	this.description = description;
}

function addGist(settings, gist) {
	if(gist instanceof createGistList) {
		settings.gists.push(gist);
		localStorage.setItem('userSettings', JSON.stringify(settings));
		return true;
	}
	console.error('Attempted to add non-GIST.');
	return false;
}

/* CREATE LIST OF THE REQUESTED GIST */

function liGist(gistList) {
	var dl = document.createElement('dl');
	var entry = dlEntry('Description: ' + gistList.description, gistList.url);
	dl.appendChild(entry.dt);
	dl.appendChild(entry.a);
	return dl;
}

function dlEntry(term, definition) {
	var dt = document.createElement('dt');
	var dd = document.createElement('dd');
	var a = document.createElement('a');
	dt.innerText = term;
	a.setAttribute('href', definition);
	a.innerText = definition;
	return {'dt':dt, 'a':a};	
}	

function generate_table() {
	var htmlList = document.getElementById('gist-list')
	settings.gists.forEach(function(gistList) {
		var li = document.createElement('li');
		li.appendChild(liGist(gistList));
		htmlList.appendChild(li); 
	});
}

/* START OF CALL FOR DATA */

function getGistData(){
	var req = new XMLHttpRequest();
	var gist = [];
	var gistList;
	if(!req) { // Mozilla, Safari, IE7+
		throw 'Unable to create HttpRequest. ';
	} else if (window.ActiveXObject) { // IE 6 and older
		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	var url = 'https://api.github.com/gists';

	var params = {
		mode: 'json'
	};
	url += '?' + urlStringify(params);
	req.onreadystatechange = function(){
		if(this.readyState === 4){
			var gist = JSON.parse(this.responseText)
				for (i=0; i !== gist.length; i++){
					var gUrl = gist[i].url;
					var gDescription = gist[i].description;
					gistList= new createGistList(gUrl, gDescription);
					addGist(settings, gistList);
				}
		}
	};
	req.open('GET', url);
	req.send();
}

function urlStringify(obj){
	var str = []
	for(var prop in obj){
		var s = encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]);
		str.push(s);
	}
	return str.join('&');
}

