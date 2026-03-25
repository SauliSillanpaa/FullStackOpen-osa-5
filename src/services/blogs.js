import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async blog => {
  //const config = { headers: { Authorization: token } }
  //console.log(`putting the blog ${blog} with id ${blog.id} into backend`)
  //console.log('blog is')
  //console.log(blog)
  const url = `${baseUrl}/${blog.id}`
  //console.log(`url is ${url}`)

  const response = await axios.put(url, blog)
  return response.data
}

const deleteBlog = async blog => {
  const config = { headers: { Authorization: token } }
  const url = `${baseUrl}/${blog.id}`

  const response = await axios.delete(url, config)
  return response.data
}

export default { getAll, create, update, deleteBlog, setToken }