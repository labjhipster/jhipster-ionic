import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  BlogComponentsPage,
      BlogDetailPage,
      BlogUpdatePage
} from './blog.po';

describe('Blog e2e test', () => {

  let loginPage: LoginPage;
  let blogComponentsPage: BlogComponentsPage;
  let blogUpdatePage: BlogUpdatePage;
  let blogDetailPage: BlogDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Blogs';
  const SUBCOMPONENT_TITLE = 'Blog';
  let lastElement: any;
  let isVisible = false;

  const name = 'name';
  const handle = 'handle';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await browser.wait(ec.elementToBeClickable(loginPage.loginButton), 3000);
    await loginPage.login(username, password);
    await browser.wait(ec.visibilityOf(loginPage.logoutButton), 1000);

  });

  it('should load Blogs', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element.all(by.css('ion-item'))
      .filter(async el => (await el.element(by.css('h2')).getText()) === 'Blog').first().click();

    blogComponentsPage = new BlogComponentsPage();
    await browser.wait(ec.visibilityOf(blogComponentsPage.title), 5000);
    expect(await blogComponentsPage.getTitle())
      .toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(blogComponentsPage.entities.get(0)), ec.visibilityOf(blogComponentsPage.noResult)), 5000);
  });

  it('should create Blog', async () => {
    initNumberOfEntities = await blogComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(blogComponentsPage.createButton), 5000);
    await blogComponentsPage.clickOnCreateButton();
    blogUpdatePage = new BlogUpdatePage();
    await browser.wait(ec.visibilityOf(blogUpdatePage.pageTitle), 1000);
    expect(await blogUpdatePage.getPageTitle())
      .toEqual(SUBCOMPONENT_TITLE);

    await blogUpdatePage.setNameInput(name);
    await blogUpdatePage.setHandleInput(handle);

    await blogUpdatePage.save();
    await browser.wait(ec.visibilityOf(blogComponentsPage.title), 1000);
    expect(await blogComponentsPage.getTitle())
      .toEqual(COMPONENT_TITLE);
    expect(await blogComponentsPage.getEntitiesNumber())
      .toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Blog', async () => {
    blogComponentsPage = new BlogComponentsPage();
    await browser.wait(ec.visibilityOf(blogComponentsPage.title), 5000);
    lastElement = await blogComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Blog', async () => {
    browser.executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if (await lastElement.isEnabled() && await lastElement.isDisplayed()) {
          browser.executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last Blog', async () => {
    blogDetailPage = new BlogDetailPage();
    if (isVisible && await blogDetailPage.pageTitle.isDisplayed()) {
    expect(await blogDetailPage.getPageTitle())
      .toEqual(SUBCOMPONENT_TITLE);


    expect(await blogDetailPage.getNameInput()).toEqual(name);

    expect(await blogDetailPage.getHandleInput()).toEqual(handle);
    }
  });

  it('should delete last Blog', async () => {
    blogDetailPage = new BlogDetailPage();
    if (isVisible && await blogDetailPage.deleteButton.isDisplayed()) {
    await browser.executeScript('arguments[0].click()', await blogDetailPage.deleteButton.getWebElement());

    const alertConfirmButton = element.all(by.className('alert-button')).last();

    await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
    alertConfirmButton.click();
    await browser.wait(ec.visibilityOf(blogComponentsPage.title), 3000);
    expect(await blogComponentsPage.getTitle())
      .toEqual(COMPONENT_TITLE);
    expect(await blogComponentsPage.getEntitiesNumber())
      .toEqual(initNumberOfEntities);
    }
  });


  it('finish Blogs tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
