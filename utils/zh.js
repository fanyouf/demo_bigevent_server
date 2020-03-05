// 去掉content中的html部分符号，只留下正文
module.exports  = (obj,key='content') =>{
  console.log(1)
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      item[key] = item[key].replace(/<.*?>/g,()=>'' )
      // item[key] = item[key].replace(/[<>\/=\w\'\"]/g,()=> "" )
      item[key] =    item[key].substr(0,100)
    })
  } else {
    obj[key] = obj[key].replace(/<.*?>/g,()=> '' )
    obj[key] = obj[key].substr(0,100)

  }
  return obj
}
