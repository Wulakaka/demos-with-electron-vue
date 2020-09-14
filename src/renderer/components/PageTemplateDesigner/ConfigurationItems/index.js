const configurationItems = {}
const files = require.context('./', false, /Configuration.+\.vue$/)
files.keys().forEach(key => {
  configurationItems[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default
})
export default configurationItems
