const amazonReplace = ( link ) => {
  let retLink = link
  if(retLink.match(/http[s]*\:\/\/www\.amazon\.co\.jp\//) != null ){
    if(retLink.match(/\/(gp|gp\/product|exec|dp|ASIN)\/([A-Z0-9]+)(\/|\?)/)){
      const ASIN = retLink.match(/\/(gp|gp\/product|exec|dp|ASIN)\/([A-Z0-9]+)(\/|\?)/)
      retLink = `https://www.amazon.co.jp/exec/obidos/ASIN/${ASIN[2]}`
    }else if(retLink.match(/\/(gp\/search)\?/)){
      retLink = retLink.replace(/\&tag\=([a-z0-9\-])+\&/,"&")
    }else{
      // console.log(retLink)
    }
  }
  return retLink
}

const tocReplace = (inStr) => {
  return inStr.toLowerCase().replace(/[\(|（\)|）\=|＝\･|・\"|”\!|！\#|＃\$|＄\%|％\\|＼\*|＊\+|＋\/|／\:|：\;|；\<|＜\>|＞\?|？\@|＠\[|［\]|］\^|＾\_|＿\`|｀\{|｛\}|｝\||｜\~|〜\｡|。\｢|「\｣|」\､|、\'|’\,|，\.|．\&|＆\-|ー|×|】|【|←|→|↓|↑|…]/g,"")
}

module.exports.amazonReplace = amazonReplace
module.exports.tocReplace = tocReplace
