async function writeCache( res ){
  
  const mkdirp  = require('mkdirp')
  const pathFn  = require('path')
  const fo = require('./fileIO.js')
  
  // write cache file
  if(res.isAllLists || res.isUseCache){
    const writeData = {
      index : res.plists[res.index].date ,
      plists : res.plists
    }
    
    await mkdirp.sync( pathFn.dirname( res.writePath ))
    await fo.writeFile( res.writePath, JSON.stringify(writeData) )
  }
  
  return res.hexo  
}


module.exports = writeCache

