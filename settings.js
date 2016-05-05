
function search(){
	clearButtons();
	var query = document.getElementById("bookmarkQuery").value;
	chrome.bookmarks.search(query,function(result){
		result.forEach(function(each){
			isFolder(each,function(val){
				if(val){
					// var str = document.createElement("p");
					// str.innerHTML = each.title;
					var btn = document.createElement("button");
					var btnHTML = "Add: "+ each.title;
					if(btnHTML.length>23){
						btnHTML = truncString(btnHTML,23);
					}
					btn.innerHTML = btnHTML;
					btn.id=each.id;
					btn.className += "b";
					//document.body.insertBefore(str,document.getElementById("loc2"));
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
								}
							}else{
								things=[each.id];
							}
							chrome.storage.sync.set({'BMC_Folders': things}, function() {
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
/*
function node(title, id, children){
	this.title = title;
	this.id = id;
	this.children = children;
}

function step(root,rootNode){
	root.children.forEach(function(child){
		debugger;
		isFolder(child,function(val){
			if(val){
				var childNode = new node(child.title,child.id,[])
				createElement(childNode);
				rootNode.children.push(childNode);
				step(child,childNode)
			}
		});
	});
}

function createElement(node){
	var btn = document.createElement("button");
	btn.id = node.id;
	btn.className += "btn";
	btn.innerHTML = node.title;
	document.body.insertBefore(btn,document.getElementById("loc2"));
	btn = document.getElementById(String(node.id));
	btn.onClick(function(){
		chrome.storage.sync.get("folders", function(folders){
				if(folders=undefined){
					folders = [];
				}			
				if(folders.indexOf(node.id)==-1){
					folders.push(node.id);
					chrome.storage.sync.set({"folders":folders});
				}
		});
	});
}

function createTree(callback){
	chrome.bookmarks.getTree(function(nodes){
		var root = nodes[0].children[0];
		var rootNode = new node(root.title,root.id,[])
		step(root,rootNode);
		console.log(rootNode);
		callback(rootNode);
	});
}

function prepButtons(level,bookmarkNode){ //should take 0 and tree the one time it isn't called recursively
	var spaces="";
 	for(var i=0;i<level;i++){
 		spaces +="  ";
 	}
	createElement(bookmarkNode);
	console.log(bookmarkNode.title);
	bookmarkNode.children.forEach(function(child){
		prepButtons(level+1,child);
	});

}

function initialize(){
	var theTree;
	var promise = new Promise(function(resolve,reject){
		createTree(function(tree){
  		theTree = tree;
  		});
  		if(theTree.children){
  			resolve("HEYYYOOO!");
  		}else{
  			reject("rejection sucks, bud.");
  		}
	});
	promise.then(function(result){
		prepButtons(0,theTree);
	},function(err){
		console.log("Life's not so rad right now, but it will be.");
	});
}



/*
 * I could create an array of easily accessible (no async) nodes
 * 
 * So, create a tree
 * [{name: name, id: id, children: [array of children]}]
 * 
 *
 *
 */


// function displayChildren(bookmarks, index, level,callback){
// 	var done = false;
// 	var spaces="";
// 	for(var i=0;i<level;i++){
// 		spaces +="  ";
// 	}
// 	var children = bookmarks[index].children;
// 	isFolder(bookmarks[index],function(val){
// 		if(val){
// 			var elem = document.createElement("pre");
// 			elem.innerHTML = spaces + bookmark.title;
// 			document.body.insertBefore(elem,document.getElementById("loc2"));
// 			children.forEach(function(bmark){
// 				displayChildren(bookmarks, index, spaces+1,function(){
// 					displayChildren(bookmarks,index+1,spaces,function(){});
// 				});
// 			});

// 		}
// 	});
// 	callback();
// }



// function displayFolders(){
// 	chrome.bookmarks.getTree(function(nodes){
// 		var bookmarks = nodes[0].children[0].children;
// 		//bookmarks.forEach(function(bmark){ //For each bookmark on the main bookmarks bar
// 		displayChildren(bookmarks,0,0,function(){});





			// theId = bmark.id;
			// isFolder(bmark,function(val,theId){ 
			// 	if(val){ //if it is a folder
			// 		var elem = document.createElement("p");
			// 		elem.innerHTML = bmark.title;
			// 		document.body.insertBefore(elem,document.getElementById("loc2"));
			// 	}
			// });
		//});

// 	});
// }

function initSearch(){
	var b = document.getElementById("search");
	b.onclick = function(){
		search();
	}
	var c = document.getElementById("clear");
	c.onclick = function(){
		clearBMCFolders();
	}
}

window.onload = function(){
  //initialize();
  initSearch();
}