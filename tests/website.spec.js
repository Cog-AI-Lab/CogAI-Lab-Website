import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['index', 'members', 'publications', 'projects', 'news', 'conferences', 'contact'];
const labels = ['Home', 'Members', 'Publications', 'Projects', 'News', 'Conferences', 'Contact'];

test('all seven navigation links open independent pages and survive reload', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().includes('127.0.0.1:4173') && response.status() >= 400) errors.push(response.url());
  });
  await page.goto('/');
  for (const [index, route] of routes.entries()) {
    const toggle = page.getByRole('button', { name: 'Open navigation' });
    if (await toggle.isVisible()) await toggle.click();
    await page.locator('.navigation').getByRole('link', { name: labels[index], exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route}\\.html$`));
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.nav-link[aria-current="page"]')).toHaveText(labels[index]);
    await page.reload();
    await expect(page.locator('.nav-link[aria-current="page"]')).toHaveText(labels[index]);
    if (route !== 'index') await expect(page.locator('.hero')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('members appear in their role groups with portraits and optional images', async ({ page }) => {
  await page.goto('/members.html');
  await expect(page.locator('.member-card')).toHaveCount(7);
  await expect(page.locator('.member-group-heading')).toHaveText([
    'Advisors',
    'Researchers',
    'PhD Students',
    'Alumni',
  ]);
  await expect(page.getByRole('region', { name: 'Advisors', exact: true })).toContainText('Minh-Tien Nguyen');
  await expect(page.getByRole('region', { name: 'Researchers', exact: true })).toContainText('Huu-Loi Le');
  await expect(page.getByRole('region', { name: 'Researchers', exact: true })).toContainText(
    'Manh-Cuong Phan',
  );
  await expect(page.getByRole('region', { name: 'PhD Students', exact: true }).locator('h3')).toHaveText([
    'Duc-Tho Bui',
    'Quoc-Hung Pham',
  ]);
  await expect(page.getByRole('region', { name: 'Undergraduate Students', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Trinh-Hoai-An Duong', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Chi-Hai Cao', exact: true })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Alumni', exact: true }).locator('h3')).toHaveText([
    'Son-Ba Giang',
    'Tien-Manh Tran',
  ]);
  await expect(page.locator('.member-photo img')).toHaveCount(3);
  await expect(page.locator('.member-placeholder')).toHaveCount(4);
  await expect(page.locator('.member-placeholder svg')).toHaveCount(4);
  await expect(page.getByRole('link', { name: 'Huu-Loi Le: Google Scholar' })).toHaveAttribute(
    'href',
    'https://scholar.google.com/citations?user=7I65pLYAAAAJ&hl=en',
  );
  await expect
    .poll(() =>
      page
        .locator('.member-photo img')
        .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
    )
    .toBe(true);
  await expect(page.locator('.member-role').first()).toHaveText('Lab Advisor');
  await page.route('**/content.js', async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: `${await response.text()}
        window.LAB_CONTENT.members.forEach(member => member.visible = true);
        window.LAB_CONTENT.memberGroups.push({ id: 'postdocs', label: 'Postdoctoral Researchers' });
        window.LAB_CONTENT.members.push({ name: 'Test Member', group: 'phd-students', role: 'PhD Student', title: null, image: null, interests: ['NLP'] });`,
    });
  });
  await page.reload();
  await expect(page.locator('.member-card')).toHaveCount(10);
  await expect(
    page.getByRole('region', { name: 'Undergraduate Students', exact: true }).locator('h3'),
  ).toHaveText(['Trinh-Hoai-An Duong', 'Chi-Hai Cao']);
  await expect(
    page.getByRole('region', { name: 'PhD Students', exact: true }).locator('.member-card'),
  ).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Postdoctoral Researchers', exact: true })).toHaveCount(0);
  await expect(page.getByRole('img', { name: 'Default avatar for Test Member' })).toBeVisible();
});

test('publication filters persist in the URL and full details expand', async ({ page }) => {
  await page.goto('/publications.html');
  const search = page.getByRole('searchbox', { name: 'Search publications' });
  await search.fill('CMTD');
  await expect(page.locator('.publication-item')).toHaveCount(1);
  await expect(page).toHaveURL(/q=CMTD/);
  await page.reload();
  await expect(search).toHaveValue('CMTD');
  await expect(page.locator('.publication-item')).toHaveCount(1);
  await page.getByLabel('Publication year', { exact: true }).selectOption('2025');
  await expect(page.getByRole('heading', { name: 'No matching publications.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.publication-item')).toHaveCount(4);
  await page.getByLabel('Publication year', { exact: true }).selectOption('2025');
  await expect(page.locator('.publication-item')).toHaveCount(2);
  await search.fill('Metamo');
  await page.locator('.publication-summary summary').click();
  await expect(page.locator('.full-authors')).toBeVisible();
  await expect(page.locator('.full-authors')).toContainText('Manh-Cuong Phan');
});

test('news supports pagination, category filters, and new awards', async ({ page }) => {
  await page.goto('/news.html');
  await expect(page.locator('.news-item')).toHaveCount(5);
  await page.getByRole('button', { name: 'Show more updates' }).click();
  await expect(page.locator('.news-item')).toHaveCount(7);
  await page.getByRole('button', { name: 'Show fewer updates' }).click();
  await expect(page.locator('.news-item')).toHaveCount(5);
  await page.getByRole('button', { name: 'Awards', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Awards & recognition' })).toBeVisible();
  await page.getByRole('button', { name: 'See all updates' }).click();
  await expect(page.locator('.news-item')).toHaveCount(5);
  await page.route('**/content.js', async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: `${await response.text()}\nwindow.LAB_CONTENT.news.unshift({ category: 'award', date: '2026', title: 'Test Award', url: 'https://example.org/' });`,
    });
  });
  await page.reload();
  await page.getByRole('button', { name: 'Awards', exact: true }).click();
  await expect(page.locator('.news-item')).toHaveCount(1);
  await expect(page.locator('.news-item')).toContainText('Test Award');
});

test('home and conferences link to filtered publications and browser back works', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.news-item')).toHaveCount(2);
  await expect(page.locator('.member-card')).toHaveCount(0);
  await page.locator('.research-card[href*="multimodal"]').click();
  await expect(page).toHaveURL(/publications\.html\?q=multimodal/);
  await expect(page.locator('.publication-item')).toHaveCount(1);
  await expect(page.locator('.publication-item')).toContainText('CMTD');
  await page.goBack();
  await expect(page.locator('.hero')).toBeVisible();
  await page.goto('/conferences.html');
  await page.locator('.conference-item').last().getByRole('link', { name: 'Lab papers' }).click();
  await expect(page.locator('.publication-item')).toHaveCount(1);
  await expect(page.locator('.publication-item')).toContainText('From Span Extraction');
  await page.goto('/projects.html');
  await expect(page.locator('.project-card')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'View CogRAG code', exact: true })).toHaveAttribute(
    'href',
    'https://github.com/Cog-AI-Lab/CogRAG',
  );
});

test('skip link and mobile keyboard navigation remain usable across pages', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.locator('main')).toHaveAttribute('inert', '');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
    await page.getByRole('button', { name: 'Open navigation' }).click();
  }
  await page.locator('.navigation').getByRole('link', { name: 'Members', exact: true }).click();
  await expect(page).toHaveURL(/members\.html$/);
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
  await page.goBack();
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
});

test('all pages fit narrow screens and use larger readable text', async ({ page }) => {
  test.setTimeout(60000);
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(`/${route}.html`);
      const layout = await page.evaluate(() => {
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('h1'));
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          headingOverflow: [...range.getClientRects()].some((rect) => rect.right > innerWidth),
          bodyFont: parseFloat(getComputedStyle(document.body).fontSize),
        };
      });
      expect(layout.overflow, `${route} at ${width}px`).toBe(false);
      expect(layout.headingOverflow, `${route} heading at ${width}px`).toBe(false);
      expect(layout.bodyFont).toBeGreaterThanOrEqual(17);
    }
  }
});

test('all pages pass automated accessibility checks', async ({ page }) => {
  test.setTimeout(60000);
  for (const route of routes) {
    await page.goto(`/${route}.html`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(
      results.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
      })),
      route,
    ).toEqual([]);
  }
});
