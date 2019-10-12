async function getNextList( res ){
  
  res.plists.sort((a, b) => {
    return (a.date - b.date)
  })
  
  if(res.index == 0){
    res.index = res.plists[0].date
  }
    
  let matchindex = 0
  for(let i=0; i<res.plists.length; i++){
    if(res.plists[i].date == res.index){
      matchindex = ( i >= res.plists.length - 1 ? 0 : (i + 1) )
    }
  }
    
  return {
    hexo : res.hexo ,
    index : matchindex ,
    isAllLists : res.isAllLists ,
    isUseCache : res.isUseCache ,
    plists : res.plists ,
    writePath: res.writePath,
    checkData: res.plists[matchindex]
  }
}

module.exports = getNextList