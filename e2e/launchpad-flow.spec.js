import { test as it, expect } from '@playwright/test';
import { LaunchpadService } from './launchpad-service.js';

const describe = it.describe;

describe('E2E Suite: GitHub Launchpad Flow Tests', () => {

  it('should render Launchpad header controls with authenticated state', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.goToLaunchpad();
    await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(3000);

console.log('URL:', page.url());
console.log('Page title:', await page.title());

console.log(
  (await page.locator('body').innerText()).slice(0, 4000)
);
    console.log(
  await page.locator(
    'input, a[data-hovercard-type="repository"], [id*="repo" i]'
  ).evaluateAll(elements =>
    elements.map(el => ({
      tag: el.tagName,
      id: el.id,
      text: el.innerText,
      placeholder: el.getAttribute('placeholder'),
      href: el.getAttribute('href'),
    }))
  )
);

    await page.screenshot({ path: 'github-home.png', fullPage: true });
console.log('Current URL:', page.url());

    await expect(launchpad.userAvatarButton).toBeVisible();
    await expect(launchpad.globalSearchInput).toBeVisible();
  });

  it('should assert repository sidebar visibility and item counts', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.goToLaunchpad();
    await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(3000);

console.log('URL:', page.url());
console.log('Page title:', await page.title());

console.log(
  (await page.locator('body').innerText()).slice(0, 4000)
);
    console.log(
  await page.locator(
    'input, a[data-hovercard-type="repository"], [id*="repo" i]'
  ).evaluateAll(elements =>
    elements.map(el => ({
      tag: el.tagName,
      id: el.id,
      text: el.innerText,
      placeholder: el.getAttribute('placeholder'),
      href: el.getAttribute('href'),
    }))
  )
);

    await expect(launchpad.repoContainer.first()).toBeVisible({ timeout: 10000 });
    const count = await launchpad.repoListItems.count();
    expect(count).toBeGreaterThan(0);
  });

  it('should dynamically filter repositories in the sidebar', async ({ page }) => {
    const launchpad = new LaunchpadService(page);
    await launchpad.goToLaunchpad();
    await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(3000);

console.log('URL:', page.url());
console.log('Page title:', await page.title());

console.log(
  (await page.locator('body').innerText()).slice(0, 4000)
);
    console.log(
  await page.locator(
    'input, a[data-hovercard-type="repository"], [id*="repo" i]'
  ).evaluateAll(elements =>
    elements.map(el => ({
      tag: el.tagName,
      id: el.id,
      text: el.innerText,
      placeholder: el.getAttribute('placeholder'),
      href: el.getAttribute('href'),
    }))
  )
);

    await launchpad.filterRepositories('project-training');
    await page.waitForTimeout(1000);

    await expect(launchpad.repoListItems.first()).toBeVisible();
  });

});