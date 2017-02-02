function test() {
  //console.log('items : ', Drive.Children.list(DriveApp.getRootFolder().getId()).items);
  //console.log('length : ', Drive.Children.list(DriveApp.getRootFolder().getId()).items.length);
  
  console.log('items : ', Drive.Files.list())
}


var foldersInfo = new Array();

function main() {
  getFolderTree();
}

// =================
// Get Folder Tree

function getFolderTree() {
  try {
    // Get folder by id
    var rootFolder = DriveApp.getRootFolder();
    
    // Initialise the sheet
    
    SpreadsheetApp.getActiveSheet().clear();
    SpreadsheetApp.getActiveSheet().appendRow(["id", "Folder", "Size", "Viewers", "Editors"]);
    
    // Get files and folders
    getChildFolders(rootFolder.getName(), rootFolder);
    
  } catch (e) {
    Logger.log(e.toString());
  }
};

// global variables
var count = 0,
    mainFolderCount = 0,
    mainFolderChecker = 0,
    globalData = [];

// Get the list of files and folders and their metadata in recursive mode
function getChildFolders(parentName, parent, sheet) {
  mainFolderCount++;
  var childFolders = parent.getFolders();
  
  // List folders inside the folder
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    count++;
    // Write
    /*
    SpreadsheetApp.getActiveSheet().appendRow([ 
      childFolder.getId(),
      parentName + "/" + childFolder.getName(),
      childFolder.getSize(),      
      getUsersFromUserArray(childFolder.getViewers()),
      getUsersFromUserArray(childFolder.getEditors())
    ]);*/
    globalData.push([ 
      childFolder.getId(),
      parentName + "/" + childFolder.getName(),
      childFolder.getSize(),      
      getUsersFromUserArray(childFolder.getViewers()),
      getUsersFromUserArray(childFolder.getEditors())
    ]);
    console.log('globalData (after push): ', globalData);
    // Recursive call of the subfolder
    getChildFolders(parentName + "/" + childFolder.getName(), childFolder, sheet);  
    count--;
    if (count === 0) {
      //Logger.log("done");
      console.log("globalData:", globalData);
      console.log("globalData length:", globalData.length);
      console.log("mainFolderCount :", mainFolderCount);
      //Logger.log(globalData[childFolder.getId()]);
      //SpreadsheetApp.getActiveSheet().getRange(sheet.getLastRow() + 1, 1, globalData[childFolder.getId()].length, 5).setValues(data);
    }      
  }
};

function getUsersFromUserArray(userArray) {
  var array = [];
  for(var i = 0; i < userArray.length; i++) {
    array.push(userArray[i].getEmail());
  }
  return array.join();
}

function stockData(folderID, data) {
  if(globalData.hasOwnProperty(folderID)) {
    //console.log('id :', folderID, ' | globalData length(b4 push): ', globalData[folderID].length, ' | globalData data: ', globalData[folderID]);
    globalData[folderID].push(data);
    //console.log('id :', folderID, ' | globalData length(after push): ', globalData[folderID].length, ' | globalData data: ', globalData[folderID]);
    //kill();
  } else {
    globalData[folderID] = new Array();
    stockData(folderID, data);
  }
  Logger.log(globalData[folderID]);
}
