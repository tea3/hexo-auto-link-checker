const cheerio = require('cheerio')
const he = require('he')

module.exports = (post, hexo) => {
    return analyze_link({hexo: hexo, post: post})
        .then((inArgs) => {
            return new Promise((resolve, reject) => {
                resolve(inArgs.post)
            })
        })
}

let analyze_link = (inArgs) => {
  
  const targetDir = /^((_posts)|(elseDir))\/.+/i
  let links = {
    toc : [] ,
    header: [] ,
    internal: [] ,
    external: []
  }
  
  // initialize temp data
  if(!inArgs.hexo.config.autoLinkChecker){
    inArgs.hexo.config.autoLinkChecker = {
      'plists' : []
    }
  }
  if(!inArgs.hexo.config.autoLinkChecker.plists){
    inArgs.hexo.config.autoLinkChecker.plists = []
  }  
  
  // push the post data
  if(targetDir.test(inArgs.post.source)){
    
    // Analyze article links
    const $ = cheerio.load(inArgs.post.content)
    $("a").each( function(i){
      const hrefStr = $(this).attr("href")
      if(hrefStr){
        // toc link
        if(hrefStr.match(/^\#/)){
          if(!$(this).hasClass("headerlink")){
            links.toc.push(hrefStr)
          }else{
            links.header.push(hrefStr)
          }
        // internal link
        }else if(hrefStr.match(/^\//) || hrefStr.match(/^\./) || hrefStr.indexOf( inArgs.hexo.config.url ) != -1){
          links.internal.push(hrefStr)
        // external link
        }else{
          links.external.push(hrefStr)
        }
      }
    })
    
    $("h6").each( function(i){
      if( $(this).hasClass("label") ){
        const h6cont = he.decode($(this).html().replace(/\&lt\;/g,"＆＆lt；").replace(/\&gt\;/g,"＆＆gt；")).replace(/＆＆lt；/g,"&lt;").replace(/＆＆gt；/g,"&gt;")
        links.header.push(`#${h6cont}`)
      }
    })
    
    // if( inArgs.post.path == `urlhogehoge/`){
    //   // console.log(inArgs.post.content) 
    // }
    
    
    inArgs.hexo.config.autoLinkChecker.plists.push({
      date: inArgs.post.date._i.getTime() ,
      source: inArgs.post.source ,
      path: inArgs.post.path ,
      title: inArgs.post.title,
      links: links
    })
  }
  
  return new Promise((resolve, reject) => {
      resolve({
          post: inArgs.post
      })
  })
}

