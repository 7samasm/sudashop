import { SET_DATA_AND_PAGINATION, DELETE_PRODUCT } from '~/store'

export const state = () => (
  {
    cart: 0,
    sections: [],
  })

export const getters = {
  cart: state => state.cart.products || 0,
  totalPrice: state => state.cart.totalPrice || 0,
  totalCartItems: state => state.cart.totalItems || 0,
  sections: state => state.sections,
  mapSections: state => {
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
  async deleteProduct({ commit }, payload) {
    const { ajaxPayload } = payload
    // delete product from ui
    // dispatch(DELETE_PRODUCT,id,{root:true});
    try {
      // delete product from database
      const paginationData = await this.$api.deleteProduct(ajaxPayload)
      // in case user cart his own products which he want to delete
      const cart = await this.$api.getCart()
      // update cart,data pagination state
      commit('set_cart', cart)

      const metaData = {
        isPageParamGreaterThanTotalPages: false,
        paginationData: {
          ...paginationData
        }
      }
      const { page } = this.app.context.params
      if (page > paginationData.totalPages) {
        metaData.isPageParamGreaterThanTotalPages = true
      }

      return metaData;

      // dispatch(SET_DATA_AND_PAGINATION,paginationData,{root:true})
    } catch (e) {
      console.log(e);
    }

  },
  async removeCartItem({ commit }, prodId) {
    await this.$api.deleteCartItem({ productId: prodId })
    commit('set_cart', await this.$api.getCart())
  },
  login({ commit }, { email, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$auth
          .loginWith('local', {
            data: {
              email,
              password
            }
          })
        commit('set_cart', await this.$api.getCart())
        resolve(true)
      } catch (e) {
        reject(e.response.data)
      }
    })
  }
}
