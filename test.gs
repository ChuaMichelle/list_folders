/* Change the FOLDER NAME to generate tree for any specify folder */
function generateFolderTree2() {
  
  try {
    // If you want a tree of any sub folder
    //var parent = DriveApp.getFoldersByName("FOLDER_NAME").next();
    SpreadsheetApp.getActiveSheet().clear();
    SpreadsheetApp.getActiveSheet().appendRow(["id", "Folder", "Viewers", "Editors"]);
    // If you want to search from the top (root) folder
    var parentFolder = DriveApp.getRootFolder();
    getChildFolders2(parentFolder.getName(), parentFolder, new Array());
  } catch (e) {
    Logger.log(e.toString());
  }
  
}

// recursive function that calls itself for every folder
function getChildFolders2(parentName, parent, data) {
  
  var childFolders = parent.getFolders();
  
  while (childFolders.hasNext()) {
    
    var childFolder = childFolders.next();
    
    data.push([ 
      childFolder.getId(),
      parentName + "/" + childFolder.getName(),
      getUsersFromUserArray2(childFolder.getViewers()),
      getUsersFromUserArray2(childFolder.getEditors())
    ]);
       
    // Recursive call for any sub-folders
    getChildFolders2(parentName + "/" + childFolder.getName(), childFolder, data);
    
  }
  print(data);
}

function print(data) {
  if(SpreadsheetApp.getActiveSheet().getLastRow() === 1) {
    SpreadsheetApp.getActiveSheet().getRange(SpreadsheetApp.getActiveSheet().getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
  } else {
    //if(SpreadsheetApp.getActiveSheet().getLastRow() <= 20) {      // uncomment for testing
      var offset = SpreadsheetApp.getActiveSheet().getLastRow() - 1;
      data = data.slice(offset, data.length);
        if(data[0][1].split("/")[0] === "My Drive" && data[0][1].split("/").length === 2) {
          SpreadsheetApp.getActiveSheet().getRange(SpreadsheetApp.getActiveSheet().getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
        }
    //}                                                             // uncomment for testing
    //else {                                                        // uncomment for testing
    //  kill();                                                     // uncomment for testing
    //}                                                             // uncomment for testing
  }
}

function getUsersFromUserArray2(userArray) {
  var array = [];
  for(var i = 0; i < userArray.length; i++) {
    array.push(userArray[i].getEmail());
  }
  return array.join();
}