// parnsise make return one line
export default axios => ({
  fetchProducts(urlQueries, baseUrl = '/hpi/products') {
    let endpoint = baseUrl
    if (urlQueries) {
      const keys = Object.keys(urlQueries)
      for (let key of keys) endpoint += key + `=${urlQueries[key]}&`;
      // console.log(baseUrl)
      endpoint = baseUrl + '?' + endpoint.substr(baseUrl.length, (endpoint.length - baseUrl.length) - 1)
    }
    // console.log(endpoint)
    return axios.$get(endpoint)
  },
  getProductById: id => axios.$get('/hpi/products/' + id),
  getProductsBySection: section => axios.$get('/hpi/products/section/' + section),
  getSections: _ => axios.$get('/hpi/sections'),
  //========= admin ===============================>
  signUp: ({ name, email, password }) => axios.post('/hpi/admin/signup', { name, email, password }),
  //cart
  insertCartItem: (productId, quantity) => axios.post('/hpi/admin/cart', { productId, quantity }),
  deleteCartItem: ({ productId }) => axios.delete(`/hpi/admin/cart/${productId}`),
  getCart: _ => axios.$get('/hpi/admin/cart'),
  // admin products
  getMyProducts: _ => axios.$get('/hpi/admin/products'),
  getProductByIdAndUser: id => axios.$get('/hpi/admin/products/' + id),
  insertProduct: product => axios.post('/hpi/admin/add-product', product),
  editProduct: productId => axios.put('/hpi/admin/edit-product', productId),
  deleteProduct: ajaxPayload => axios.$post(`/hpi/admin/delete-product`, ajaxPayload),
  // comment
  addComment: ({ productId, commentText }) => axios.$post('/hpi/admin/comment', { productId, commentText }),
  deleteComment: ({ productId, commentId }) => axios.$post('/hpi/admin/delete-comment', { productId, commentId })
})
