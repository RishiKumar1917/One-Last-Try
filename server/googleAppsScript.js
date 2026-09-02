/**
 * GOOGLE APPS SCRIPT WEBHOOK FOR "One Last Try" SPREADSHEET
 * 
 * Instructions:
 * 1. In your Google Sheet ("One Last Try"), click on: Extensions > Apps Script
 * 2. Delete any existing code and paste the code below.
 * 3. Click "Deploy" > "New deployment"
 * 4. Select type: "Web app"
 * 5. Set:
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Click "Deploy" and copy the Web App URL (ends with /exec).
 * 7. Paste that URL into .env as SHEET_WEBHOOK_URL=<your_url>
 */

/*
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Set headers if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (ISO)",
        "Date & Time",
        "Device Token",
        "Step #",
        "Question",
        "Selected Option",
        "Category",
        "IP Address"
      ]);
      sheet.getRange("A1:H1").setFontWeight("bold").setBackground("#007AFF").setFontColor("#FFFFFF");
    }

    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.deviceToken || "Unknown",
      data.stepIndex || "-",
      data.questionText || "-",
      data.selectedOption || "-",
      data.category || "-",
      data.ip || "Direct"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
*/
