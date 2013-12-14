function Initialize() {
  doGet();
}

function accept(eventID){
  // idea is to create new event and delete the old one
  var calold = CalendarApp.getCalendarById("ZZZZ");
  var eventSeries = calold.getEventSeriesById(eventID);
  
  // update spreadsheet log
  var rowID = eventSeries.getTag("rowID");
  var sheet = SpreadsheetApp.openById("WWWW");
  var sheet = sheet.getSheetByName("Support Data");
  
  if (sheet.getRange(rowID,VVVV).getValue() != "") return; // prevent submitting twice
  sheet.getRange(rowID,VVVV).setValue("Approved");
  
  // Update actual calendar (after leave has been approved)
  var cal = CalendarApp.getCalendarById("YYYY");
  cal.createEvent(eventSeries.getTag("name") + " - Leave",new Date(eventSeries.getTag("startDate")) , new Date(eventSeries.getTag("endDate")));

  eventSeries.deleteEventSeries();
}

function reject(eventID){ 
  var calold = CalendarApp.getCalendarById("ZZZZ");
  var eventSeries = calold.getEventSeriesById(eventID);
  
  //update spreadsheet log
  var rowID = eventSeries.getTag("rowID");
  var sheet = SpreadsheetApp.openById("WWWW");
  var sheet = sheet.getSheetByName("Support Data");
  if (sheet.getRange(rowID,VVVV).getValue() != "") return; // prevent submitting twice
  sheet.getRange(rowID,VVVV).setValue("Rejected");
  
  eventSeries.deleteEventSeries();
}

// The doGet function is the one that is run when a user accesses the URL at which the script is deployed. Though it's not used in this simple example, notice that doGet takes a parameter, e. This e parameter contains any information that was passed in the URL's query string.
function doGet(e) {
//  var html = HtmlService.createTemplateFromFile("view_request.html");
//  html.id = e.parameter.id;
//  html.action = e.parameter.action;
  var id = e.parameter.id;
  var action = e.parameter.action;
  
  if (action === "accept") {accept(id); Logger.log("accepted id" + id);}
  else if (action === "reject") {reject(id); Logger.log("rejected id" + id);}
}
