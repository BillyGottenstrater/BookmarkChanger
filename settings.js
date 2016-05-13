
function search(){
	clearButtons();
	var query = document.getElementById("bookmarkQuery").value;
	chrome.bookmarks.search(query,function(result){
		result.forEach(function(each){
			isFolder(each,function(val){
				if(val){
					var btn = document.createElement("button");
					var btnHTML = "Add: "+ each.title;
					btn.title="Add Folder: "+each.title;
					btn.id=each.id;
					btn.className += "b";
					btn.className += " folder";
					chrome.storage.sync.get('BMC_Folders', function(folders) {
						var things = folders["BMC_Folders"];
						if(things){
							if(things.indexOf(each.id)>=0){
						 		btn.className += " pressed";
						 		btnHTML = btnHTML.slice(3,btnHTML.length+1);
						 		btnHTML = "Remove".concat(btnHTML);
						 		btn.title="Remove Folder: "+each.title;
							}else{

							}
						}
						if(btnHTML.length>23){
							btnHTML = truncString(btnHTML,23);
						}
						btn.innerHTML=btnHTML;
        			});
					document.body.insertBefore(btn,document.getElementById("loc2"));
					var b = document.getElementById(each.id);
					b.onclick = function(){
						// clearBMCFolders();
						chrome.storage.sync.get('BMC_Folders', function(folders) {
							var things = folders["BMC_Folders"];
							if(things){
								debugger;
								if(things.indexOf(each.id)==-1){
									things.push(each.id); 
									btn.className += " pressed";
						 			btnHTML = btnHTML.slice(3,btnHTML.length+1);
						 			btnHTML = "Remove".concat(btnHTML);
						 			btn.title="Remove Folder: "+each.title;
								}else{
									var idx = things.indexOf(each.id);
									things = things.splice(idx,idx);
									$("#"+btn.id).removeClass("pressed");
									btnHTML="Add: ".concat(each.title);
								}
							}else{
								things=[each.id];
								btn.className += " pressed";
						 		btnHTML = btnHTML.slice(3,btnHTML.length+1);
						 		btnHTML = "Remove".concat(btnHTML);
						 		btn.title="Remove Folder: "+each.title;
							}
							chrome.storage.sync.set({'BMC_Folders': things}, function() {
								console.log(things);
          					console.log('Consider it stored.');
        					});
        				if(btnHTML.length>23){
							btnHTML = truncString(btnHTML,23);
						}
        				btn.innerHTML=btnHTML;
        				});
					}
  				}
			});
		});
	});
	chrome.bookmarks.search(query,function(result){
		result.forEach(function(each){
			isFolder(each,function(val){
				if(!val){
					var btn = document.createElement("button");
					var btnHTML = "Add: "+ each.title;
					btn.title="Add Bookmark: "+each.title +"\n"+each.url;
					if(btnHTML.length>23){
						btnHTML = truncString(btnHTML,23);
					}
					btn.innerHTML = btnHTML;
					btn.id=each.id;
					btn.className += "b";
					btn.className += " bmark";
					chrome.storage.sync.get('BMC_Bookmarks', function(bookmarks) {
						var things = bookmarks["BMC_Bookmarks"];
						if(things){
							if(things.indexOf(each.id)>=0){
								btn.className += " pressed";
						 		btnHTML = btnHTML.slice(3,btnHTML.length+1);
						 		btnHTML = "Remove".concat(btnHTML);
						 		btn.title="Remove Bookmark: "+each.title;
							}else{
						
							}
						}	
						btn.innerHTML=btnHTML;
        			});
					document.body.insertBefore(btn,document.getElementById("loc2"));
					var b = document.getElementById(each.id);
					b.onclick = function(){
						// clearBMCFolders();
						chrome.storage.sync.get('BMC_Bookmarks', function(bookmarks) {
							var things = bookmarks["BMC_Bookmarks"];
							if(things){
								if(things.indexOf(each.id)==-1){
									things.push(each.id); 
									btn.className += " pressed";
						 			btnHTML = btnHTML.slice(3,btnHTML.length+1);
						 			btnHTML = "Remove".concat(btnHTML);
						 			btn.title="Remove Folder: "+each.title;
								}else{
									var idx = things.indexOf(each.id);
									things = things.splice(idx,idx);
									$("#"+btn.id).removeClass("pressed");
									btnHTML="Add: ".concat(each.title);
									btn.title="Add Bookmark".concat(each.title+"\n"+each.url)
								}
							}else{
								things=[each.id];
								btn.className += " pressed";
						 		btnHTML = btnHTML.slice(3,btnHTML.length+1);
						 		btnHTML = "Remove".concat(btnHTML);
						 		btn.title="Remove Bookmark: "+each.title+"\n"+each.url;
							}
							chrome.storage.sync.set({'BMC_Bookmarks': things}, function() {
								console.log(things);
          						console.log('Consider it stored.');
        					});
        				});
  					}
  				}
			});
		});
	});
}

function clearBMCFolders(){
	chrome.storage.sync.set({'BMC_Folders': null}, function() {
        console.log('Consider it cleared.');
	});
	chrome.storage.sync.set({'BMC_Bookmarks': null}, function() {
        console.log('Consider it cleared.');
	});
}

function clearButtons(){
	$(".b").remove();
}

function truncString(str, maxLen){
  return str.substring(0,maxLen-3)+"...";
}


//Takes a string id returns true if it is a folder
function isFolder(bookmark,callback){
	var tree;
	chrome.bookmarks.getSubTree(bookmark.id,function(arr){
		tree = arr[0];
		callback(Boolean(tree.children),bookmark)
	});
}

function initSearch(){
	var b = document.getElementById("search");
	b.onclick = function(){
		search();
	}
	var c = document.getElementById("clear");
	c.onclick = function(){
		clearBMCFolders();
	}
	$(document).keypress(function(e) {
    	if(e.which == 13) {
        	search();
    	}
	});
}

window.onload = function(){
  //initialize();
  initSearch();
  $("#bookmarkQuery").trigger( "focus" );
}