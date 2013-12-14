function FormSubmit(formData) {
  // Load the sheets for processing
  var debug = JSON.stringify(formData);
  var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses");
  var supData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Support Data"); 
  var rowID = formData.range["rowStart"];
  
  // Create and send the Email
  // Description is used to make the email
  var description = supData.getRange(2,1).getValue();
  var name = formData.namedValues["Name"];
  
  // Note the date fields have to be correctly formatted e.g. August 2 2011
  var startDate = formData.namedValues["Start Date"];
  var start = new Date(startDate + " 08:00:00");
  var endDate = formData.namedValues["End Date"];
  var end = new Date(endDate + " 17:00:00");
  
  // consider other cases
  // half day same day
  if (formData.namedValues["Start Date"] == formData.namedValues["End Date"]){
    if (formData.namedValues["Start Date Type"] == formData.namedValues["End Date Type"]){
      if (formData.namedValues["Start Date Type"] == "Half Day AM" ){
        end = new Date(endDate + " 13:00:00");
      }
      if (formData.namedValues["Start Date Type"] == "Half Day PM" ){
        start = new Date(startDate + " 13:00:00");
      }
    }
  }
  // half day end or half day start
  else{
    if (formData.namedValues["Start Date Type"] == "Half Day PM" ){
        start = new Date(startDate + " 13:00:00");
    }
    if (formData.namedValues["End Date Type"] == "Half Day AM" ){
        end = new Date(endDate + " 13:00:00");
    }
  }
  
  //Create the Calendar entry in the TEMP calendar. NB the startDate and end Dates submitted have to be in the correct format
  // creates in the 'request' calendar
  var cal = CalendarApp.getCalendarById("ZZZZ");
  var event = cal.createEvent(name + " - REQUEST Leave", start, end); 
  var eventID = event.getId();
  event.setTag("startDate", start.toString());
  event.setTag("endDate", end.toString());
  event.setTag("name", name);
  event.setTag("rowID", rowID);
  
  //make email
  var to = "XXXX";
  var subject = "Notice: for " + name + " LEAVE NOTICE (Automail)";
  var message = "Leave details: " + "\n" + "\n";
  message += rowID;
  message += description + "\n" + "\n";
  message += "The company leave calendar can be viewed by clicking on the following link" + "\n";
  message += "https://www.google.com/calendar/b/0/embed?src=YYYY&gsessionid=OK \n\n"
  message += "To accept, click on the following link \n";
  message += ScriptApp.getService().getUrl() + "?action=accept&id=" + eventID + "\n";
  message += "To reject, click on the following link \n"; 
  message += ScriptApp.getService().getUrl() + "?action=reject&id=" + eventID;
  MailApp.sendEmail(to, subject, message);
}