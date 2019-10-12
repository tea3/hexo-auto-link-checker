const getNextList = require('./lib/getNextList')
const loadCache = require('./lib/loadCache')
const checkLink = require('./lib/checkLink')
const writeCache = require('./lib/writeCache')

let enable = true

if(hexo.config.autoLinkChecker && hexo.config.autoLinkChecker.enable !== undefined){
  enable = hexo.config.autoLinkChecker.enable
}


if(enable){
  
  hexo.extend.filter.register('after_post_render', ( post ) => {
    return require('./lib/postCollector')(post, hexo)
  }, {async: true})

  hexo.extend.filter.register('after_generate', () => {
    return loadCache(hexo)
      .then(getNextList)
      .then(checkLink)
      .then(writeCache)
  }) 
}
