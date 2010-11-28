/**
 * -------------------------------------------------------------------
 * @author Ferdinand E. Silva
 * @email six519@phpugph.com, ferdie_v143@yahoo.com, six519@yahoo.com
 * 
 * -------------------------------------------------------------------
 * This is a simple WebGeekPH Firefox Toolbar
 * -------------------------------------------------------------------
 * */

WebGeek = {
	
	FORUM_URL: "http://webgeekph.com/forum/",
	BLOG_FEED_URL: "http://feeds.feedburner.com/webgeekph-blog",
	CURRENT_TAB: 0,
	NEW_TAB: 1,
	A_POST: "POST",
	A_GET: "GET",
	
	LoginMessage: "",
	
	openURL: function(url,tab) {
		
		if(tab == WebGeek.CURRENT_TAB) {
			
			window._content.document.location = url;
			window.content.focus();
						
		} else if(tab == WebGeek.NEW_TAB) {
			
			var newTab = window.getBrowser().addTab(url,null,null);
			window.getBrowser().selectedTab = newTab;
			
		}
		
	},
	
	textBoxValue: function(txtObject,txtValue,clearTxtValue) {
		
		if(clearTxtValue) {
			
			if(txtObject.value == txtValue) {

				txtObject.value = "";
				
			}
			
		} else {
			
			if(txtObject.value == "") {

				txtObject.value = txtValue;
				
			}			
			
		}
		
	},
	
	clearAllChild: function(elementID) {
		
		var cell = document.getElementById(elementID);

		if(cell.hasChildNodes()) {
			
				while (cell.childNodes.length >= 1) {
					
					cell.removeChild(cell.firstChild);
					       
				}
				 
		}		
		
	},
	
	onPressEnter: function(event,func) {
		
		if(event.keyCode == 13) {
			
			func();
			
		}
		
	},
	
	ajax: function(ajaxMethod,ajaxUrl,parameters,onSuccess) {
		
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			
			if(xmlhttp.readyState == 4) {
				
				if(xmlhttp.status == 200) {
					
					
					onSuccess(xmlhttp);
					
				}
				
			} 
			
		}
		

		xmlhttp.open(ajaxMethod,ajaxUrl,true);
		
		if(ajaxMethod == WebGeek.A_POST) {
			
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");	
			xmlhttp.setRequestHeader("Content-length", parameters.length);	
		}
		
		xmlhttp.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");

		if(ajaxMethod == WebGeek.A_POST) {
			
			xmlhttp.setRequestHeader("Connection", "close");
			
		}

		
		if(ajaxMethod == WebGeek.A_GET) {
		
			xmlhttp.send(null);
		
		}else if(ajaxMethod == WebGeek.A_POST) {
			
			xmlhttp.send(parameters);
			
		}
					
	},
	
	setProfilePic: function(url,nuM) {
		
		var num = nuM;
		
		WebGeek.ajax(WebGeek.A_GET,url,null,function(xmlhttp){
						
			var txtResponse = xmlhttp.responseText;
			var txtPattern1 = '';
			var txtPattern2 = '';
			
			txtPattern1=txtResponse.match(/http:\/\/webgeekph\.com\/forum\/index\.php\?action=dlattach;attach=.+;type=avatar/);
			txtPattern2=txtResponse.match(/http:\/\/webgeekph.com\/forum\/avatars\/.+" alt="" class="avatar"/);
			
			document.getElementById('hiddenPicText' + num).value = '';

			if(txtPattern1 != null) { 

				document.getElementById('hiddenPicText' + num).value = txtPattern1;
			
			} else if(txtPattern2 != null) {

				document.getElementById('hiddenText4').value = txtPattern2;
				document.getElementById('hiddenPicText' + num).value = document.getElementById('hiddenText4').value.replace('" alt="" class="avatar"','');
			
			} else { 

				document.getElementById('hiddenPicText' + num).value = 'chrome://webgeek/content/webgeek.png';
			
			}			
						
							
		});
		
	},	

	getForum: function() {
				
		WebGeek.ajax(WebGeek.A_GET,WebGeek.FORUM_URL + "index.php?action=.xml&limit=20",null,function(xmlhttp) {
			
			WebGeek.clearAllChild('forumItem');
			
			var xmlDoc = xmlhttp.responseXML.documentElement;
			var x2 = 0;
			var forumItem = document.getElementById('forumItem');

			for(x=0;x<xmlDoc.getElementsByTagName("recent-post").length;x++) {

				var newElement = document.createElement("menuitem");
				newElement.setAttribute('label',xmlDoc.getElementsByTagName('subject')[x2].childNodes[0].nodeValue);
				
				var poster = xmlDoc.getElementsByTagName('poster');
				poster=poster[x].getElementsByTagName('name')[0].childNodes[0].nodeValue;

				var posterURL = xmlDoc.getElementsByTagName('poster');
				posterURL = posterURL[x].getElementsByTagName('link')[0].childNodes[0].nodeValue;

				var topic = xmlDoc.getElementsByTagName('topic');
				topic = topic[x].getElementsByTagName('id')[0].childNodes[0].nodeValue;

				var recentPost = xmlDoc.getElementsByTagName('recent-post');
				recentPost = recentPost[x].getElementsByTagName('id')[0].childNodes[0].nodeValue;
					
				var toolTip = document.createElement("tooltip");
				toolTip.setAttribute('id','picTip' + x2);
				toolTip.setAttribute('align','center');

				var label = document.createElement("label"); //this is the tooltip text
				label.setAttribute('value',xmlDoc.getElementsByTagName('time')[x].childNodes[0].nodeValue + ' by ' + poster);

				var image = document.createElement("image"); //this is the image in tooltip

				WebGeek.setProfilePic(posterURL,x);

				image.setAttribute('src',document.getElementById('hiddenPicText' + x).value);

				toolTip.appendChild(label);
				toolTip.appendChild(image);

				forumItem.appendChild(toolTip); //tooltip element (testing only)

				newElement.setAttribute('tooltip','picTip' + x2);
				newElement.setAttribute('id',WebGeek.FORUM_URL + 'index.php?topic=' + topic + '.msg' + recentPost + '#msg' + recentPost);

				if(newElement.getAttribute('id') == window.content.location.href) {
					
					newElement.setAttribute('class','menuitem-iconic');
					newElement.setAttribute('image','chrome://webgeek/content/ok.png');

					var hBox = document.createElement("hbox");
					var eImage = document.createElement("image");
					var eLabel = document.createElement("label");
					eLabel.style.paddingLeft='8px';
					eImage.setAttribute('src','chrome://webgeek/content/ok.png');
					eLabel.setAttribute('value',xmlDoc.getElementsByTagName('subject')[x2].childNodes[0].nodeValue);
					hBox.appendChild(eImage);
					hBox.appendChild(eLabel);
					newElement.appendChild(hBox);
						
				}

				x2+=2;
				
				newElement.addEventListener("click", function(event){
				
					if(event.button == 0) {
						
						WebGeek.openURL(this.getAttribute('id'),WebGeek.CURRENT_TAB);
						
					} else if(event.button == 2) {
						
						WebGeek.openURL(this.getAttribute('id'),WebGeek.NEW_TAB);
						
					}
					
				}, false);

				forumItem.appendChild(newElement);
			}
				
			//end of onsuccess			
			
		});
		
	},
	
	getBlog: function() {
		
		WebGeek.ajax(WebGeek.A_GET,WebGeek.BLOG_FEED_URL,null,function(xmlhttp){
			
			WebGeek.clearAllChild('blogItem');

			var xmlDoc = xmlhttp.responseXML.documentElement;

			for(x=0;x<xmlDoc.getElementsByTagName("item").length;x++) {
				
				var item = xmlDoc.getElementsByTagName('item');
				var title = item[x].getElementsByTagName('title')[0].childNodes[0].nodeValue;
				var link = item[x].getElementsByTagName('link')[0].childNodes[0].nodeValue;
				var pubDate = item[x].getElementsByTagName('pubDate')[0].childNodes[0].nodeValue;
				var creator = item[x].getElementsByTagName('dc:creator')[0].childNodes[0].nodeValue;
					
				var newElement = document.createElement("menuitem");
				newElement.setAttribute('label',title);
				newElement.setAttribute('id',link);
				newElement.setAttribute('tooltiptext',pubDate + ' by ' + creator);

				if(newElement.getAttribute('id') == window.content.location.href) { 
					
					newElement.setAttribute('class','menuitem-iconic');
					newElement.setAttribute('image','chrome://webgeek/content/ok.png');
					var hBox=document.createElement("hbox");
					var image=document.createElement("image");
					var label=document.createElement("label");
					label.style.paddingLeft='8px';
					image.setAttribute('src','chrome://webgeek/content/ok.png');
					label.setAttribute('value',title);
					hBox.appendChild(image);
					hBox.appendChild(label);
					newElement.appendChild(hBox);
					
				}

					newElement.addEventListener("click", function(event){ 

						if(event.button == 0) {
							
							WebGeek.openURL(this.getAttribute('id'),WebGeek.CURRENT_TAB);
							
						} else if(event.button == 2) {
							
							WebGeek.openURL(this.getAttribute('id'),WebGeek.NEW_TAB);
							
						}						
						
					}, false);

					var blogItem=document.getElementById('blogItem');
					blogItem.appendChild(newElement);
			}
		
		});
		
	},
	
	getTotalOnline: function() {
		
		WebGeek.ajax(WebGeek.A_GET,WebGeek.FORUM_URL + "SSI.php?ssi_function=whosOnline",null,function(xmlhttp){
			
			var txt=xmlhttp.responseText;
			txt=txt.match(/[0-9]+ Users|[0-9]+ User/);
					
			document.getElementById('onlineButton').setAttribute('label',txt + ' Online');		
		
		});
		
		setTimeout('WebGeek.getTotalOnline()',5000);		
		
	},
	
	isOnline: function() {
	
		WebGeek.ajax(WebGeek.A_GET,WebGeek.FORUM_URL + "SSI.php?ssi_function=welcome",null,function(xmlhttp){
			
			var txt = xmlhttp.responseText;

			if(txt.match(/Welcome, <b>Guest<\/b>/)) { 
				
				document.getElementById('userLogin').setAttribute('hidden','false');
				document.getElementById('userLogout').setAttribute('hidden','true');

			} else { 
				
				var uname = txt.match(/Hey, <b>.+<\/b>/);
				document.getElementById('hiddenText2').value = uname;
				uname = document.getElementById('hiddenText2').value.replace('Hey, <b>','').replace('</b>','');

				var msg = txt.match(/[0-9]+ message/);

				document.getElementById('userMsg').setAttribute('label',msg);
				document.getElementById('userLabel').setAttribute('label','Logout (' + uname + ')');
					
				document.getElementById('userLogin').setAttribute('hidden','true');
				document.getElementById('userLogout').setAttribute('hidden','false');
					
			}	
		
		});
		
		setTimeout('WebGeek.isOnline()',2000);	
		
	},
	
	loggingOut: function() {
		
		document.getElementById('userLabel').disabled = true;
		
		WebGeek.ajax(WebGeek.A_GET,WebGeek.FORUM_URL + "SSI.php?ssi_function=logout",null,function(xmlhttp){

			var txt = xmlhttp.responseText;
			var txt2 = txt;
			txt = txt.match(/<a href=".+">Logout<\/a>/);

			document.getElementById('hiddenText3').value = txt;

			if(txt2.match(/<a href=".+">Logout<\/a>/)) {
				
				WebGeek.openURL(document.getElementById('hiddenText3').value.replace('<a href="','').replace('">Logout</a>',''),WebGeek.CURRENT_TAB);					
					
			}


			document.getElementById('userLogin').setAttribute('hidden','false');
			document.getElementById('userLogout').setAttribute('hidden','true');
			document.getElementById('userLabel').disabled = false;
			
		});		
		
	},
		
	loggingIn: function() {
		
		var params = "cookielength=-1&user=" + document.getElementById('username').value + "&passwrd=" + document.getElementById('password').value ;

		document.getElementById('username').disabled = true;
		document.getElementById('password').disabled = true;
		document.getElementById('loggingBut').disabled = true;
		
		WebGeek.ajax(WebGeek.A_POST,WebGeek.FORUM_URL + "index.php?action=login2",params,function(xmlhttp){

			var txt = xmlhttp.responseText;

			if(txt.match("You should fill in a username")) {

				WebGeek.LoginMessage = 'You should fill in a username';
				window.open('chrome://webgeek/content/alerter.xul','','chrome,dialog,modal');

			}else if(txt.match("That username does not exist")) {
					
				WebGeek.LoginMessage = "That username does not exist";
				window.open('chrome://webgeek/content/alerter.xul','','chrome,dialog,modal');
					
			}else if(txt.match("Password incorrect")) {
					
				WebGeek.LoginMessage = 'Password incorrect';
				window.open('chrome://webgeek/content/alerter.xul','','chrome,dialog,modal');
				
			}else if(txt.match("You didn't enter your password")) {
					
				WebGeek.LoginMessage = "You didn't enter your password";
				window.open('chrome://webgeek/content/alerter.xul','','chrome,dialog,modal');
				
			}else{
				
				document.getElementById('userLogin').setAttribute('hidden','true');
				document.getElementById('userLogout').setAttribute('hidden','false');
				WebGeek.openURL(WebGeek.FORUM_URL,WebGeek.CURRENT_TAB);

			}

			document.getElementById('username').disabled = false;
			document.getElementById('password').disabled = false;
			document.getElementById('loggingBut').disabled = false;			
			
		});		
		
	},
	
	searchWG: function() {
		
		var params = "submit=Search&advanced=0&search=" + document.getElementById('searchQuery').value;

		document.getElementById('searchButton').disabled = true;
		document.getElementById('searchQuery').disabled = true;

		WebGeek.ajax(WebGeek.A_POST,WebGeek.FORUM_URL + "index.php?action=search2",params,function(xmlhttp){

			var txt=xmlhttp.responseText;

			txt=txt.match(/action=search2;params=.+>Search Results<\/a>/);

			document.getElementById('hiddenText').value=txt;
			WebGeek.openURL('http://webgeekph.com/forum/index.php?' + document.getElementById('hiddenText').value.replace('">Search Results</a>',''),WebGeek.CURRENT_TAB);

			document.getElementById('searchButton').disabled=false;
			document.getElementById('searchQuery').disabled=false;			
			
		});
		
	},
	
	run: function() {
		window.addEventListener("load", function(e) { WebGeek.getBlog();WebGeek.getForum();WebGeek.getTotalOnline();WebGeek.isOnline(); }, false);
	}
	
};

WebGeek.run();

