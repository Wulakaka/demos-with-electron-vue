import axios from 'axios'
function request (options) {
  return axios(options)
    .then(res => {
      return res
    })
    .catch(err => {
      console.log(err)
      return Promise.reject(err)
    })
}
export default request
