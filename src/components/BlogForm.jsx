import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title: newBlog,
      author: newAuthor,
      url: newURL
    })

    setNewBlog('')
    setNewAuthor('')
    setNewURL('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input value={newBlog} onChange={({ target }) => setNewBlog(target.value)} id='title-input' />
        </div>
        <div>
          Author:
          <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)}  id='author-input' />
        </div>
        <div>
          URL:
          <input value={newURL} onChange={({ target }) => setNewURL(target.value)}  id='url-input' />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm