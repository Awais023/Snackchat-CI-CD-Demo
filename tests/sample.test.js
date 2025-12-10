// tests/sample.test.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const fs = require("fs");

describe("Basic Jenkins Integration test", function () {
  this.timeout(30000);
  let driver;

  // Result tracker
  let results = {
    executed: 0,
    passed: 0,
    failed: 0,
  };

  before(async () => {
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
    results.executed++;
    try {
      await driver.get("https://the-internet.herokuapp.com/login");
      await driver.findElement(By.id("username")).sendKeys("tomsmith");
      await driver
        .findElement(By.id("password"))
        .sendKeys("SuperSecretPassword!");
      await driver.findElement(By.css('button[type="submit"]')).click();

      await driver.wait(until.elementLocated(By.css(".flash.success")), 5000);
      console.log("Login Test Passed !");
      results.passed++;
    } catch (err) {
      console.log("Login Test Failed !");
      results.failed++;
    }
  });

  it("Test to verify user is navigated to homepage after login.", async () => {
    results.executed++;
    try {
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
        results.passed++;
      } else {
        console.log("Message verification FAILED.");
        results.failed++;
      }
    } catch (err) {
      console.log("Message verification FAILED.");
      results.failed++;
    }
  });

  it("Test to verify user is able to logout.", async () => {
    results.executed++;
    try {
      await driver.sleep(2000);
      await driver.findElement(By.xpath("//i[text()=' Logout']")).click();
      console.log("Logout Test Passed !");
      results.passed++;
    } catch (err) {
      console.log("Logout Test Failed !");
      results.failed++;
    }
  });

  after(async () => {
    if (driver) await driver.quit();

    // Save results to JSON for Jenkins
    fs.writeFileSync("test-results.json", JSON.stringify(results, null, 2));
    console.log("Test results saved to test-results.json:", results);
  });
});
