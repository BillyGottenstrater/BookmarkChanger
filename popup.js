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
        //console.debug(bookmark.title+" "+bookmark.id+ " | ");
        array.push({title:String(bookmark.title),id:String(bookmark.id)});
        printBookmarks(bookmark.id,array,callback);
      });
    });
    callback(array);
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

function prepButtons(){
  var b1 = document.getElementById("button1");
  b1.onclick = function() {
    changeBookmark("190");
  };

  var b2 = document.getElementById("button2");
  b2.onclick = function() {
    changeBookmark("189");
  };

  var b3 = document.getElementById("button3");
  b3.onclick = function() {
    changeBookmark("188");
  };

  var b4 = document.getElementById("button4");
  b4.onclick = function() {
    changeBookmark("77");
  };

  var b4 = document.getElementById("button5");
  b4.onclick = function() {
    changeBookmark("202");
  };
}

window.onload = function(){
  prepButtons();
}
