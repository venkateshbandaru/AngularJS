"use strict";

require("../pages/table_page.js");
require("../pages/revisions_page.js");
require("../pages/debugger_page.js");

var new_tables_page = function () {

  var decisionCreateButton = element.all(by.className('table-decision-column-add ng-isolate-scope')).first();
  var buttonSuccess = element.all(by.className('btn btn-success btn-loading')).first();

  this.createNewTable = function (tableName, tableDesc, testData, testData2, testData3, rowData, rowData2, fieldTitle, fieldKey, option) {
    decisionCreateButton.click();
    browser.isElementPresent(by.model('field.title'));
    element(by.model('field.title')).sendKeys(fieldTitle);
    element(by.model('field.key')).sendKeys(fieldKey);
    element(by.model('isEnablePreset')).click();
    element(by.model('$parent.condition')).click();
    element.all(by.cssContainingText('option', option)).click();
    element.all(by.model('$parent.$parent.value')).click();
    element(by.model('$parent.$parent.value')).sendKeys('true');
    element(by.className('btn btn-primary')).click();
    browser.isElementPresent(by.model('table.title'));
    element(by.model('table.title')).sendKeys(tableName);
    element(by.model('table.description')).sendKeys(tableDesc);
    element(by.model('variant.defaultTitle')).sendKeys(testData);
    element(by.model('variant.defaultDescription')).sendKeys(testData2);
    element(by.model('$parent.model')).sendKeys(testData3);
    element(by.className('plus')).click();
    element(by.model('rule.title')).sendKeys(rowData);
    element(by.model('rule.description')).sendKeys(rowData2);
    buttonSuccess.click();
    return require("./table_page.js");
  };


  this.createNewScoringTable = function (tableName, tableDesc, testData, testData2, testData3, rowData, rowData2, fieldTitle, fieldKey) {
    element(by.className('table-decision-column-add ng-isolate-scope')).click();
    browser.isElementPresent(by.model('field.title'));
    element(by.model('field.title')).sendKeys(fieldTitle);
    element(by.model('field.key')).sendKeys(fieldKey);
    element(by.className('btn btn-primary')).click();
    browser.isElementPresent(by.model('table.title'));
    element(by.model('table.title')).sendKeys(tableName);
    element(by.model('table.description')).sendKeys(tableDesc);
    element(by.model('matchingType')).click();
    element(by.xpath('/html/body/div[1]/div/div/div[3]/button[2]')).click();
    element(by.model('$parent.model')).clear();
    element(by.model('$parent.model')).sendKeys(testData);
    element(by.model('table.defaultTitle')).sendKeys(testData2);
    element(by.model('table.defaultDescription')).sendKeys(testData3);
    element(by.className('plus')).click();
    element(by.model('rule.title')).sendKeys(rowData);
    element(by.model('table.defaultDescription')).sendKeys(rowData2);
    buttonSuccess.click();
    return require("./table_page.js");
  };

  this.createNewTableWithoutColumn = function (data1, data2, data3, data4, data5, data6, data7) {
    browser.isElementPresent(by.model('table.title'));
    element(by.model('table.title')).sendKeys(data1);
    element(by.model('table.description')).sendKeys(data2);
    element(by.model('variant.defaultTitle')).sendKeys(data3);
    element(by.model('variant.defaultDescription')).sendKeys(data4);
    element(by.model('$parent.model')).sendKeys(data5);
    element(by.className('plus')).click();
    element(by.model('rule.title')).sendKeys(data6);
    element(by.model('rule.description')).sendKeys(data7);
    buttonSuccess.click();
  };

  this.assertAlertMessage = function (alert) {
    var message = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/form/div[2]/decision-table/div[1]/div[1]/table[1]/thead/tr/th[3]/div/div[2]/div[2]/div')).getText();
    expect(message).toBe(alert);
    return require("./table_page.js");
  };

  this.cloneRows = function () {
    element(by.className('glyphicon glyphicon-duplicate')).click();
    buttonSuccess.click();
  };

  this.assertRowIsCloned = function (row1) {
    element.all(by.linkText(row1)).isDisplayed();
  };

  this.createEmptyTable = function () {
    browser.isElementPresent(by.model('table.title'));
    buttonSuccess.click();
    buttonSuccess.click();
    buttonSuccess.isDisplayed();
  };

  this.assertNewTable = function (name) {
    element(by.className('logo-img')).click();
    browser.isElementPresent(by.css('[ui-sref="tables-create"]'));
    var tableName = element(by.css('[ui-sref="tables-create"]')).getText();
    expect(tableName).toBe(name);
  };

  this.deleteTable = function (data) {
    var danger = element.all(by.className('btn btn-danger')).first();
    danger.click();
    element(by.model('model.code')).sendKeys(data);
    danger.click();
    browser.isElementPresent(by.className('list-group'));
    return require("./table_page.js");
  };

  this.editTable = function (title, description, text) {
    element(by.css('[ng-if="rule.description"]')).click();
    element(by.model('rule.title')).sendKeys(title);
    element(by.model('rule.description')).sendKeys(description);
    browser.isElementPresent(by.linkText('This table have unsaved data. You need to save changes manually.'));
    buttonSuccess.click();
    var editTable = element(by.css('[ng-if="rule.title"]')).getText();
    expect(editTable).toBe(text);
  };

  this.deleteRow = function (text) {
    element(by.className('glyphicon glyphicon-remove')).click();
    browser.isElementPresent(by.linkText('This table have unsaved data. You need to save changes manually.'));
    buttonSuccess.click();
    var editTable = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/ui-view/form/div[2]/decision-table/div[1]/div[1]/table[1]/tbody/tr[1]/td[2]/div/b')).getText();
    expect(editTable).toBe(text);
  };

  this.getRevision = function () {
    return require("./revisions_page.js");
  };

  this.getDebugger = function () {
    return require("./debugger_page.js");
  };

  this.assertRevision = function () {
    browser.isElementPresent(by.model('field.title'));
  };
};

module.exports = new new_tables_page();



