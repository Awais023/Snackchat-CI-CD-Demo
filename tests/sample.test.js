// tests/sample.test.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

describe("Basic Jenkins Integration test", function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    const chrome = require("selenium-webdriver/chrome");

    const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--window-size=1200,800");
    options.setUserPreferences({
      credentials_enable_service: false,
      "profile.password_manager_enabled": false,
    });
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  it("Test to verify user is able to login.", async () => {
    await driver.get("https://the-internet.herokuapp.com/login");
    await driver.findElement(By.id("username")).sendKeys("tomsmith");
    await driver
      .findElement(By.id("password"))
      .sendKeys("SuperSecretPassword!");
    await driver.findElement(By.css('button[type="submit"]')).click();
    console.log("Login Test Passed !");
    await driver.wait(until.elementLocated(By.css(".flash.success")), 5000);
  });

  /////////////////////////////////////////////////////////

  it("Test to verify user is navigated to homepage after login.", async () => {
    let secureMessage = await driver.wait(
      until.elementLocated(By.css("h4")),
      5000
    );
    let messageText = await secureMessage.getText();
    if (
      messageText ===
      "Welcome to the Secure Area. When you are done click logout below."
    ) {
      console.log("Message verification PASSED.");
    } else {
      console.log("Message verification FAILED.");
    }
  });

  ////////////////////////////////////////////////////////////////////////////////
  it("Test to verify user is able to logout.", async () => {
    await driver.sleep(5000);
    await driver.findElement(By.xpath("//i[text()=' Logout']")).click();
  });

  after(async () => {
    if (driver) await driver.quit();
  });
});
