import {SET_DATA_AND_PAGINATION, DELETE_PRODUCT} from '~/store'

export const state = () => (
{
  cart: 0,
  sections: [],
})

export const getters = {
  cart          : state => state.cart.products   || 0,
  totalPrice    : state => state.cart.totalPrice || 0,
  totalCartItems: state => state.cart.totalItems || 0,
  sections      : state => state.sections,
  mapSections   : state => {
    return state.sections.map(el => {
      return {
        text: el.name
        // value : section._id
      }
    })
  },
};

export const mutations = {
  set_cart(state, cart) {
    state.cart = cart
  },
  set_section(state, sections) { state.sections = sections },
};

export const actions = {
  async deleteProduct({ commit, dispatch }, payload) {
    const { id, title } = payload
    if (confirm(`delete ${title} ?`)) {
      // delete product from ui
      // dispatch(DELETE_PRODUCT,id,{root:true});
      try {
        // delete product from database
        await this.$api.deleteProduct({ productId: id })
        const cart       = await this.$api.getCart()
        const myproducts = await this.$axios.$get('/hpi/admin/products')
        commit('set_cart', cart)
        dispatch(SET_DATA_AND_PAGINATION,myproducts,{root:true})
      } catch(e) {
        console.log(e);
      }
    }
  },
  async removeCartItem({ commit }, prodId) {
    await this.$api.deleteCartItem({ productId: prodId })
    commit('set_cart', await this.$api.getCart())
  },
  login({commit},{email,password}) {
    return new Promise(async (resolve,reject)=> {
      try {
        await this.$auth
        .loginWith('local', {
          data: {
            email   : email,
            password: password
          }
        })
        commit('set_cart', await this.$api.getCart())
        resolve(true)   
      } catch(e) {
        reject(e.response.data.error)
      }
    })
  }
}
