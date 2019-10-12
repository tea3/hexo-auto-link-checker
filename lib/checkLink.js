const request = require('request')
const pathFn  = require('path')
const fo = require('./fileIO.js')
const lr = require('./linkReplacer.js')


async function checkURL( res ){
  let brokenLinks = []
  let brokenLinks_log = ``
  
  // --------------------------------
  // check the external links
  // --------------------------------
  for(let url of res.checkData.links.external){
    if(!checkExclusionURL(url, res.hexo)){
      const urlStat = await checkStatusCode( lr.amazonReplace(url) )
      if( urlStat[0] != 200 ){
        brokenLinks.push({
          status: urlStat[0] ,
          url: urlStat[1] ,
          source: res.checkData.source ,
          path: res.checkData.path
        })
      }
    }
  }
  
  // --------------------------------
  // check the internal links
  // --------------------------------
  for(let extL of res.checkData.links.internal){
    if(!checkExclusionURL(extL, res.hexo)){
      let isMatchedIntPath = false
      if(!extL.match(/(^\/$|^\/archives\/|^\/tags\/|^\/categories\/)/)){
        for(let pl of res.plists){
          if(`/${pl.path}` == extL ){
            isMatchedIntPath = true
            break
          }
        }
        if( !isMatchedIntPath ){
          brokenLinks.push({
            status: 404 ,
            url: extL ,
            source: res.checkData.source ,
            path: res.checkData.path
          })
        }
      }
    }
  }
  
  // --------------------------------
  // check the toc(and anker) links
  // --------------------------------
  for(let tl of res.checkData.links.toc){
    if(!checkExclusionURL(`${tl.replace(/^\#/,"")}`, res.hexo)){
      let isMatchedLink = false
      for(let hd of res.checkData.links.header){
        if(lr.tocReplace(tl) == lr.tocReplace(hd)){
          isMatchedLink = true
          break
        }
      }
      
      if(!isMatchedLink){
        brokenLinks.push({
          status: 404 ,
          url: tl ,
          source: res.checkData.source ,
          path: res.checkData.path
        })
      }
    }
  }
  
  if(brokenLinks.length > 0){
    
    const brokenList = res.writePath.replace( pathFn.extname(res.writePath) , "" ) + `-brokenLinks.txt`
    
    // display broken links
    console.log(`\u001b[33m[hexo-auto-link-checker]`)
    console.log(`  Please check the following link & log file :`)
    console.log(`  log: ${brokenList} \u001b[0m\n`)
    for(let bl of brokenLinks){
      console.log(`  (\u001b[33m${bl.status}\u001b[0m) ${bl.url}`)
      console.log(`   Source: ${bl.source}\n   Path: ${bl.path}\n`)
      brokenLinks_log += `[${bl.status}] ${bl.url}\n Source: ${bl.source}\n Path: ${bl.path}\n\n`
    }
    
    // write broken links log
    if(brokenLinks_log != ``){
      
      let rf = ``
      try{
        rf = await fo.readFile( brokenList )
        if(!rf) rf = ``
      }catch(e){
        console.log(`[hexo-auto-link-checker] ${e}`)
      }
      
      await fo.writeFile( brokenList , `${rf}${brokenLinks_log}` )
    }
    
  }
  
  return res
}

const checkStatusCode = (url) => {
  // console.log(`checking link : ${url}`)
  return new Promise((resolve, reject) => {
    request( url , (err, res, body) => {
        if(err){
          resolve( [404 , url] )
        }else{
          resolve( [res.statusCode , url] )
        }
    })
  })
}

const checkExclusionURL = (url , hexo) => {
  if(hexo.config.autoLinkChecker && hexo.config.autoLinkChecker.exclusionURL !== undefined){
    for(let el of hexo.config.autoLinkChecker.exclusionURL){
      if(el == url){
        return true
      }
    }
  }
  return false
}

module.exports = checkURL

