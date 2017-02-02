/**
 * Eventhandler for spreadsheet opening - add a menu.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Custom Actions')
      .addItem('List Folders', 'main')
      .addToUi();
}


/**
 * Main function called to start listing the folders on spreadsheet
 */
function main() {
  try {
    // Clean spreadsheet
    SpreadsheetApp.getActiveSheet().clear();
    SpreadsheetApp.getActiveSheet().appendRow(["id", "Folder", "Viewers", "Editors"]);
    // If you want to search from the top (root) folder
    var parentFolder = DriveApp.getRootFolder();
    getSubFolders(parentFolder.getName(), parentFolder, new Array());
  } catch (e) {
    Logger.log(e.toString());
  }
}

/**
 * A recursive function that would pass through folders and subfolders.
 * Would collect necessary informations that will be printed on the spreadsheet later on.
 * @param {String} parentName | Name of parent folder
 * @param {Object} parent | Folder Object returned by DriveApp 
 * @param {Array} data | Array of information on folders
 */
function getSubFolders(parentName, parent, data) {
  var childFolders = parent.getFolders();
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    data.push([ 
      childFolder.getId(),
      parentName + "/" + childFolder.getName(),
      getUsersFromUserArray(childFolder.getViewers()),
      getUsersFromUserArray(childFolder.getEditors())
    ]);
    // Recursive call for any sub-folders
    getSubFolders(parentName + "/" + childFolder.getName(), childFolder, data);
  }
  print(data);
}

/**
 * Write data on spreadsheet
 * @param {Array} data | Array of information on folders
 */
function print(data) {
  if(SpreadsheetApp.getActiveSheet().getLastRow() === 1) {
    SpreadsheetApp.getActiveSheet().getRange(SpreadsheetApp.getActiveSheet().getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
  } else {
    //if(SpreadsheetApp.getActiveSheet().getLastRow() <= 20) {      // uncomment for testing
    var offset = SpreadsheetApp.getActiveSheet().getLastRow() - 1;
    data = data.slice(offset, data.length);
    if(data[0] != undefined) {
      SpreadsheetApp.getActiveSheet().getRange(SpreadsheetApp.getActiveSheet().getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
    }
    //}                                                             // uncomment for testing
    //else {                                                        // uncomment for testing
    //  kill();                                                     // uncomment for testing
    //}                                                             // uncomment for testing
  }
}

/**
 * Get email from the array of Users Object that is being returned by the function getViewers() and getEditors()
 * @param {Array} userArray | Array that contains User Object
 * @return {String} String of emails seperated by a comma and a space i.e: 'user0@devoteam.com, user1@devoteam.com, user2@devoteam.com'
 */
function getUsersFromUserArray(userArray) {
  var array = [];
  for(var i = 0; i < userArray.length; i++) {
    array.push(userArray[i].getEmail());
  }
  return array.join(", ");
}