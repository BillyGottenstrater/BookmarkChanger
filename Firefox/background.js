function onCreated() {
	if (browser.runtime.lastError) {
		console.log("Error adding context menu item");
	}else{
		console.log("Successfully created context menu item");
	}
}

function getCurrentTabUrl(callback){
	var queryInfo = {
		active: true,
		currentWindow: true
	};
	browser.tabs.query(queryInfo,(tabs) => {
		callback(tabs[0].url);
	});
}

function updateBookmark(id, tab){
	var func = function(url){
		console.log("Updating Bookmark to new url: "+url);
		let changes = {url:url};
		browser.bookmarks.update(id,changes);
	}
	getCurrentTabUrl(func);
}

browser.menus.create({
	id: "update-bookmark",
	title: "Update Bookmark",
	contexts: ["bookmark"]
}, onCreated);

browser.menus.onClicked.addListener((info, tab) => {
	var id = info.bookmarkId;
	switch (info.menuItemId) {
		case "update-bookmark":
			updateBookmark(id, tab);
			break;
	}
});
