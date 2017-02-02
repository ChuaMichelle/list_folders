/**
 * Eventhandler for spreadsheet opening - add a menu.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Custom Menu')
      .addItem('Run', 'main')
      .addItem('API', 'getFolders')
      .addToUi();
}

function getFolders() {
  console.log('inside get folders');
  var p = 0;
  Logger.log(DriveApp.getRootFolder().getId());
  var folders = Drive.Children.list(DriveApp.getRootFolder().getId()).items;
  var files = Drive.Files.list().items;
  for(var i = 0; i < files.length; i++) {
    if(files[i].mimeType == "application/vnd.google-apps.folder") {
      console.log(p++, files[i].title);
      
     
    }
  }
}

function getPath(folder, path) {
  /*
  try {
    //Logger.log(folder.getParents().next().getName());
    //getPath(folder, path+folder.getParents().next().getName());
  } catch(e) { 
   return path;
  } */
  while(folder.next()) {
    Logger.log('next: ' + folder.getParents().next().getName());

  }
  /*
  Logger.log('parent: ' + folder.getParents());
  if(folder.getParents().next()) {
    Logger.log('next: ' + folder.getParents().next().getName());
  } else {
    return path;
  }
  */
  return path;
}

