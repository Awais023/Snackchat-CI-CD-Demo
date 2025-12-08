// tests/sample.test.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

describe("Google basic test", function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    const chrome = require("selenium-webdriver/chrome");

    const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--window-size=1200,800");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  it("opens Google and types query", async () => {
    await driver.get("https://www.google.com");
    // const q = await driver.findElement(By.name("q"));
    // await q.sendKeys("Selenium WebDriver JavaScript");
    // await q.sendKeys("\n");
    // await driver.wait(until.titleContains("Selenium WebDriver"), 10000);
  });

  after(async () => {
    if (driver) await driver.quit();
  });
});
