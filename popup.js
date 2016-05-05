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

function initButton(buttonId, id){
  var b = document.getElementById(buttonId);
  //changeButton(id,buttonId);
  b.onclick = function(){
    changeBookmark(id);
  }
}

function truncString(str, maxLen){
  return str.substring(0,maxLen-3)+"...";
}


function prepButtons(){
  // var count = 0
  var maxLen = 23
  chrome.storage.sync.get('BMC_Folders', function(folders) {
    var things = folders["BMC_Folders"];
    things.forEach(function(id){
      debugger;
      chrome.bookmarks.getChildren(id,function(children){
        children.forEach(function(child){
        var btn = document.createElement("button");
        btn.id=child.id;
        btn.className += "b";
        if((child.title).length>maxLen){
        btn.innerHTML=truncString(child.title,maxLen);
        }else{
          btn.innerHTML=child.title;
        }
        // count++;
        document.body.insertBefore(btn,document.getElementById("loc"));
        initButton(btn.id,child.id);
        });
      });
    });
  });
  // chrome.bookmarks.getChildren("186",function(children){
  //   children.forEach(function(child){
  //     var btn = document.createElement("button");
  //     btn.id=child.id;
  //     btn.className += "b";
  //     if((child.title).length>maxLen){
  //     btn.innerHTML=truncString(child.title,maxLen);
  //     }else{
  //       btn.innerHTML=child.title;
  //     }
  //     // count++;
  //     document.body.insertBefore(btn,document.getElementById("loc"));
  //     initButton(btn.id,child.id);
  //   });
  // });
}

window.onload = function(){
  prepButtons();
}
