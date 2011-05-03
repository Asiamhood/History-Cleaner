var EXPORTED_SYMBOLS = ['gHistCleanObserverInit'];

var gHistoryService = Components
    .classes["@mozilla.org/browser/nav-history-service;1"]
    .getService(Components.interfaces.nsINavHistoryService);

var gInitDone = false;
function gHistCleanObserverInit() {
  if (gInitDone) return;
  gInitDone = true;

  gHistoryService.addObserver(observer, false);
}

// https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsINavHistoryObserver
var observer = {
  onBeforeDeleteURI: function(aUri) { },
  onBeginUpdateBatch: function() { },
  onClearHistory: function() { },
  onDeleteURI: function(aUri) {
    openDialog(
        null, 'chrome://histclean/content/addglob.xul', null, null, aUri.spec);
  },
  onDeleteVisits: function(aUri, aVisitTime) { },
  onEndUpdateBatch: function() { },
  onPageChanged: function(aUri, aWhat, aValue) { },
  onTitleChanged: function(aUri, aPageTitle) { },
  onVisit: function(
      aUri, aVisitID, aTime, aSessionID, aReferringID, aTransitionType, aAdded
  ) {
    Components.utils.reportError('visit...');
    onUri(aUri);
  }
};

function onUri(aUri) {
  Components.utils.reportError('Saw a URI: ' + aUri.spec);
}

// http://goo.gl/UpWa0
function openDialog(parentWindow, url, windowName, features) {
    var array = Components.classes["@mozilla.org/array;1"]
        .createInstance(Components.interfaces.nsIMutableArray);
    for (var i = 4; i < arguments.length; i++) {
        var variant = Components.classes["@mozilla.org/variant;1"]
            .createInstance(Components.interfaces.nsIWritableVariant);
        variant.setFromVariant(arguments[i]);
        array.appendElement(variant, false);
    }

    var watcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
        .getService(Components.interfaces.nsIWindowWatcher);
    return watcher.openWindow(parentWindow, url, windowName, features, array);
}