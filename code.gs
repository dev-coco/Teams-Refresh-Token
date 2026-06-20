function doPost (request) {
  const json = request.parameter
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getRange('A1').setValue(json.token)
  return ContentService.createTextOutput('ok')
}
