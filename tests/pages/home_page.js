"use strict";

require("../pages/dashboard_page.js");
require("../pages/welcome_page.js");
require("../pages/home_page.js");

var home_page = function () {

  this.fillSignInForm = function (login, password) {
    browser.isElementPresent(by.model('model.username'));
    element(by.model('model.username')).sendKeys(login);
    element(by.model('model.password')).sendKeys(password);
  };

  this.fillSignUpForm = function (login, password, mail) {
    browser.isElementPresent(by.css('[ui-sref="sign-up"]'));
    var signUp = element.all(by.css('[ui-sref="sign-up"]')).first();
    signUp.click();
    element.all(by.model('model.username')).first().sendKeys(login);
    element.all(by.model('model.password')).first().sendKeys(password);
    element.all(by.model('model.email')).first().sendKeys(mail);
  };

  this.submitForm = function () {
    element(by.className('btn btn-submit')).click();
    return require("./dashboard_page.js");
  };

  this.welcomePage = function () {
    element(by.className('btn btn-submit')).click();
    return require("./welcome_page.js");
  };

  this.assertAlertMessage = function () {
    element(by.className('btn btn-submit')).click();
    return require("./home_page.js");
  };
};

module.exports = new home_page();
