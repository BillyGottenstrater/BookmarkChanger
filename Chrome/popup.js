function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

//Just for testing/Finding out what the ids of certain bookmarks are.
function printBookmarks(id, array, callback) {
    chrome.bookmarks.getChildren(id, function(children) {
      children.forEach(function(bookmark) { 
        array.push({title:String(bookmark.title),id:String(bookmark.id)});
      });
      callback(array);
    });
  }

//Just for testing/Finding out what the ids of certain bookmarks are.
function showBookmarks(id){
  var arr = [];
  printBookmarks(id, arr, function(array){
    array.forEach(function(element){
    console.debug("Title: "+element.title+" ID: "+element.id)});
  });
}

function changeBookmark(id){
  getCurrentTabUrl(function(url){
    chrome.bookmarks.update(id,{url:url});
  });
}

function changeButton(id, buttonId){
  chrome.bookmarks.get(id,function(arr){
    var b = document.getElementById(buttonId);
    b.innerHTML=arr[0].title;
  });
}

function changeB(id, button){
  chrome.bookmarks.get(id,function(arr){
    button.innerHTML=arr[0].title;
  });
}

function initButton(id){
  var b = document.getElementById(id);
  //changeButton(id,buttonId);
  b.onclick = function(){
    changeBookmark(id);
  }
}

function truncString(str, maxLen){
  return str.substring(0,maxLen-3)+"...";
}


function prepButtons(){
  var maxLen = 23
  chrome.storage.sync.get('BMC_Folders', function(storage) {
    var things = storage["BMC_Folders"];
    things.forEach(function(id){
      chrome.bookmarks.getChildren(id,function(children){
        children.forEach(function(child){
          isFolder(child,function(val){
            if(!val){
              var btn = document.createElement("button");
              btn.title= child.title +"\n"+child.url;
              btn.id=child.id;
              btn.className += "b";
              btn.className += " bmark";
              if((child.title).length>maxLen){
                btn.innerHTML=truncString(child.title,maxLen);
              }else{
                btn.innerHTML=child.title;
              }
              document.body.insertBefore(btn,document.getElementById("loc"));
              initButton(child.id);
            }
          }); 
        });
      });
    });
  });
  chrome.storage.sync.get('BMC_Bookmarks', function(storage) {
    var things = storage["BMC_Bookmarks"];
    if(things){
    things.forEach(function(id){
      chrome.bookmarks.get(id,function(theBookmark){
        var bmark = theBookmark[0]
        debugger;
        var btn = document.createElement("button");
        btn.title= bmark.title +"\n"+bmark.url;
        btn.id=bmark.id;
        btn.className += "b";
        btn.className += " bmark";
        if((bmark.title).length>maxLen){
        btn.innerHTML=truncString(bmark.title,maxLen);
        }else{
          btn.innerHTML=bmark.title;
        }
        // count++;
        document.body.insertBefore(btn,document.getElementById("loc"));
        initButton(bmark.id);
      });
    });
  }
  });
}


//Takes a string id returns true if it is a folder
function isFolder(bookmark,callback){
  var tree;
  chrome.bookmarks.getSubTree(bookmark.id,function(arr){
    tree = arr[0];
    callback(Boolean(tree.children),bookmark)
  });
}

window.onload = function(){
  prepButtons();
}
