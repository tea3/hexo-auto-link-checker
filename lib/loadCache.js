async function loadCache( hexo ){
  
  const pathFn = require('path')
  const fo = require('./fileIO.js')
  
  let checkIndex = 0
  let returnedPlists = {}
  let isAllLists = false
  let isUseCache = false
  let writePath = ``
  
  // check the option  
  if(hexo.config.autoLinkChecker && hexo.config.autoLinkChecker.rarelyChangePostsPath && hexo.config.autoLinkChecker.cachePath){
    
    writePath = pathFn.join(process.env.PWD || process.cwd(), hexo.config.autoLinkChecker.cachePath)
    
    // Check if all articles have been retrieved
    if(hexo.config.autoLinkChecker && hexo.config.autoLinkChecker.plists){
      for(let p of hexo.config.autoLinkChecker.plists){
        if(p.path == hexo.config.autoLinkChecker.rarelyChangePostsPath){
          isAllLists = true
          break
        }
      }   
    }
    
    // read cache file
    try{
      const content = await fo.readFile( writePath )
      
      if(content){
        returnedPlists = JSON.parse( content )
        if(returnedPlists.index){
          checkIndex = returnedPlists.index
        }
      }
    }catch(e){
      console.log(`[hexo-auto-link-checker] ${e}`)
    }
    
    if(isAllLists){
      returnedPlists = hexo.config.autoLinkChecker.plists
    }else if( returnedPlists.plists ){
      isUseCache = true
      returnedPlists = returnedPlists.plists
    }
    
  }else{
    console.log(`\u001b[33m[hexo-auto-link-checker] Please set the option.\u001b[0m`)
  }
  
  return {
    hexo : hexo ,
    index : checkIndex ,
    isAllLists : isAllLists ,
    isUseCache: isUseCache ,
    plists : returnedPlists ,
    writePath: writePath
  }
}



module.exports = loadCache

