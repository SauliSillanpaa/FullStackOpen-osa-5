const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Sauli Sillanpää',
        username: 'SauliSillanpaa',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'SauliSillanpaa', 'salainen')
      await expect(page.getByText('Sauli Sillanpää logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'SauliSillanpaa', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Sauli Sillanpää logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'SauliSillanpaa', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'Sauli Sillanpaa and Playwright', 'blogi.fi')
      await expect(page.getByText('a blog created by Playwright Sauli Sillanpaa and Playwright')).toBeVisible()
    })

    describe('and several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'first blog', 'Sauli', 'blogi.fi')
        await createBlog(page, 'second blog', 'Sauli', 'blogi.fi')
        //await createBlog(page, 'third blog', 'Sauli', 'blogi.fi')
      })

      test('one of those can be liked', async ({ page }) => {
        await page.pause()
        await page.getByRole('button', { name: 'view' }).first().click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('after liking, the most liked is on top', async ({ page }) => {
        await page.pause()
        await page.getByRole('button', { name: 'view' }).last().click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.locator('.blogStyle').first()).toContainText('second blog Sauli')

        await page.getByRole('button', { name: 'view' }).last().click()
        const secondLike = await page.getByRole('button', { name: 'like' }).last()
        secondLike.click()
        secondLike.click()
        await expect(page.locator('.blogStyle').first()).toContainText('first blog Sauli')
      })

      test('a blog can be removed by the user who added it', async ({ page }) => {
        await page.pause()
        await page.getByRole('button', { name: 'view' }).first().click()
        page.on('dialog', async dialog => {
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('first blog Sauli')).not.toBeVisible()
      })

      test('a blog cannot be removed by another user', async ({ page, request }) => {
        await page.pause()
        await page.getByRole('button', { name: 'logout' }).click()
        await request.post('/api/users', {
          data: {
            name: 'Another User',
            username: 'another',
            password: 'hyshys'
          }
        })
        await page.goto('/')
        loginWith(page, 'another', 'hyshys')

        await page.getByRole('button', { name: 'view' }).first().click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })
})