export default (path,beginngSlash = '',inArray = false)=> {
  // turnnig @path'/sections/laptops/1' to ['',sections,laptops,1]
  const pathArr = path.split('/')
  /*
  ** remove 1st element of pathArr [which is eq to ''] 
  ** pathArr will be [sections,laptops,1]
  */
  pathArr.shift()    
  /*
  ** check if last element of pathArr is a numeric
  ** then remove [pop] it so we can add anthor page number
  ** [sections,laptops,1] => [sections,laptops]
  */
  if(pathArr[pathArr.length - 1] / 1)
  pathArr.pop()
  // return url in array of chunc str [sections,laptops]
  if (inArray) return pathArr
  // case @path'/' => 'page'
  let parseUrl = pathArr[0] ? pathArr.join('/') : 'page';
  // reurn '/?sections/laptops'
  return beginngSlash + parseUrl
}