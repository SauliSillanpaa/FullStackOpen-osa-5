import { useState, useEffect } from 'react'
//import Footer from './components/Footer'
import Blog from './components/Blog'
import Notification from './components/Notification'
import loginService from './services/login'
import blogService from './services/blogs'

let isError = false

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: newBlog,
      author: newAuthor,
      url: newURL
    }

    try {
      blogService.create(blogObject).then(returnedBlog => {
        isError=false
        setNotification(`a new blog ${newBlog} by ${newAuthor} added`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)

        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
        setNewAuthor('')
        setNewURL('')
      })
    } catch {
      isError=true
      setNotification('Could not add a new blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }

  const handleLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      isError=false
      setNotification('successful login')
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch {
      isError=true
      setNotification('wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    isError = false
    setNotification('Ciao! See you next time')
    setTimeout(() => setNotification(null), 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>log in to application</h2>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      {user.name} logged in
      <button type="submit">logout</button>
    </form>
  )

  const showBlogs = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title: 
        <input value={newBlog} onChange={({ target }) => setNewBlog(target.value)} />
      </div>
      <div>
        Author: 
        <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
      </div>
      <div>
        URL: 
        <input value={newURL} onChange={({ target }) => setNewURL(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <Notification message={notification} isError={isError}/>
      
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          {logoutForm()}
          <h2>create new</h2>
          {blogForm()}
          {showBlogs()}
        </div>
      )}      
    </div>
  )
}

export default App