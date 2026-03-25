import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
import BlogForm from './BlogForm'

test('renders only title and author', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Matti Luukkainen',
    url: 'blogi.fi',
    likes: 3
  }

  render(<Blog blog={blog} />)
  //screen.debug()

  const titleElement = screen.getByText('Component testing is done with react-testing-library', { exact: false })
  const authorElement = screen.getByText('Matti Luukkainen', { exact: false })
  const urlElement = screen.queryByText('blogi.fi')
  const likesElement = screen.queryByText('3')

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('after clicking the view button, url and likes are displayed', async () => {

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Matti Luukkainen',
    url: 'blogi.fi',
    likes: 3,
    user: {
      username: 'testUser'
    }
  }

  const thisUser = {
    username: 'testUser'
  }

  render(<Blog blog={blog} thisUser={thisUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  //screen.debug()

  const urlElement = screen.getByText('blogi.fi', { exact: false })
  const likesElement = screen.getByText('3', { exact: false })

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('after clicking the like button twice, the event handler is called twice', async () => {

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Matti Luukkainen',
    url: 'blogi.fi',
    likes: 3,
    user: {
      username: 'testUser'
    }
  }

  const thisUser = {
    username: 'testUser'
  }

  const mockLike = vi.fn()

  render(<Blog blog={blog} update={mockLike} thisUser={thisUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  //screen.debug()


  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  //screen.debug()

  expect(mockLike.mock.calls).toHaveLength(2)
})

test('<BlogForm /> calls event handler with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')
  const sendButton = screen.getByText('create')
  //screen.debug()

  await user.type(titleInput, 'testing a form...')
  await user.type(authorInput, 'Matti Luukkainen')
  await user.type(urlInput, 'blogi.fi')
  //screen.debug()
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('Matti Luukkainen')
  expect(createBlog.mock.calls[0][0].url).toBe('blogi.fi')
})