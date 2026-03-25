import { useState } from 'react'

const Blog = ({ blog, update, remove, thisUser }) => {
  const [visible, setVisible] = useState(false)
  const [blogLikes, setLikes] = useState(blog.likes)

  const toggleVisibility = async () => {
    await setVisible(!visible)
  }

  const showPart = () => (
    <div>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>view</button>
    </div>
  )

  const addLike = async event => {
    event.preventDefault()
    //console.log(`liking this blog: ${blog.title} with id ${blog.id} by user with id ${blog.user.id}`)
    //console.log('the likable blog is:')
    //console.log(blog)
    blog.likes = blog.likes + 1
    await update({
      id: blog.id,
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
      url: blog.url
    })

    await setLikes(blog.likes)
  }

  const deleteBlog = async event => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await remove({ id: blog.id })
    }
  }

  const deleteButton = () => {
    if (thisUser.username === blog.user.username) {
      //{console.log(thisUser.username)}
      //{console.log(blog.user.username)}
      return (
        <div>
          <button onClick={deleteBlog}>remove</button>
        </div>
      )
    }
  }

  const showFull = () => (
    <div>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>hide</button> <br />
      {blog.url} <br />
      likes {blogLikes}
      <button onClick={addLike}>like</button> <br/>
      {blog.author} <br />
      {deleteButton()}
    </div>
  )

  return (
    <div className='blogStyle'>
      {!visible && showPart()}
      {visible && showFull()}
    </div>
  )
}

export default Blog