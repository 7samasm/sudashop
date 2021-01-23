// parnsise make return one line
export default axios => ({
  fetchProducts(urlQueries,baseUrl = '/hpi/products') {
    let endpoint = baseUrl
    if(urlQueries) {
      const keys = Object.keys(urlQueries)
      for(let key of keys) endpoint += key + `=${urlQueries[key]}&`;
      console.log(baseUrl)
      endpoint =  baseUrl + '?' + endpoint.substr(baseUrl.length,(endpoint.length - baseUrl.length)-1)
    }
    console.log(endpoint)
    return axios.$get(endpoint)
  },
  getProductById(id) {
    return axios.$get('/hpi/products/' + id)
  },
  getProductsBySection(section) {
    return axios.$get('/hpi/products/section/' + section)
  },
  getSections() {
    return axios.$get('/hpi/sections')
  },
  //========= admin ===============================>
  signUp({ name, email, password }) {
    return axios.post('/hpi/admin/signup', { name, email, password })
  },
  //cart
  insertCartItem(productId, quantity) {
    return axios.post('/hpi/admin/cart', { productId, quantity })
  },
  deleteCartItem({productId}) {
    return axios.delete(`/hpi/admin/cart/${productId}`)
  },
  getCart() {
    return axios.$get('/hpi/admin/cart')
  },
  // admin products
  getMyProducts(){
    return axios.$get('/hpi/admin/products')
  },
  getProductByIdAndUser(id) {
    return axios.$get('/hpi/admin/products/' + id)
  },
  insertProduct(product) {
    return axios.post('/hpi/admin/add-product', product)
  },
  editProduct(productId) {
    return axios.put('/hpi/admin/edit-product', productId)
  },
  deleteProduct(ajaxPayload) {
    return axios.$post(`/hpi/admin/delete-product`,ajaxPayload)
  },
  // comment
  addComment({productId,commentText}){
    return axios.$post('/hpi/admin/comment', {productId,commentText})
  },
  deleteComment : ({productId,commentId}) => axios.$post('/hpi/admin/delete-comment',{productId,commentId})
})
