import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'

let isError = false

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()

    try {
      await blogService.create(blogObject)
      isError=false
      setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
    } catch {
      isError=true
      setNotification('Could not add a new blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }

  const updateBlog = async blogObject => {

    try {
      await blogService.update(blogObject)
      //console.log(`Adding the update for blog:`)
      //console.log(returnedBlog)
      isError=false
      setNotification('successful update')
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
    } catch {
      isError=true
      setNotification('could not update')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }

  const removeBlog = async blogObject => {

    try {
      await blogService.deleteBlog(blogObject)
      //console.log(`Adding the update for blog:`)
      //console.log(returnedBlog)
      isError=false
      setNotification('successful delete')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
    } catch {
      isError=true
      setNotification('could not delete')
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
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      {user.name} logged in
      <button type="submit">logout</button>
    </form>
  )

  const compare = (blogA, blogB) => (
    blogB.likes - blogA.likes
  )

  const showBlogs = () => (
    <div>
      {blogs.sort(compare).map(blog =>
        <Blog key={blog.id} blog={blog} update={updateBlog} remove={removeBlog} thisUser={user}/>
      )}
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <Notification message={notification} isError={isError}/>
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          {logoutForm()}
          <br />
          {blogForm()}
          <br />
          {showBlogs()}
        </div>
      )}
    </div>
  )
}

export default App