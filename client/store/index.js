export const PRODUCTS = 'products'
export const PAGINATION = 'pagination'
export const SET_DATA = 'SET_DATA'
export const SET_PRODUCTS = 'SET_PRODUCTS'
export const SET_PAGINATION = 'SET_PAGINATION'
export const DELETE_PRODUCT = 'deleteProduct'
export const SET_DATA_AND_PAGINATION = 'setDataAndPagination'
export const NEXT_PAGE = 'next_page'
export const PREVIOUS_PAGE = 'previous_page'

export const state = () => ({
  [PRODUCTS]: [],
  [PAGINATION]: {},
  postComments: [],
  drawer: false
})

export const getters = {
  [PRODUCTS]: state => state[PRODUCTS],
  postComments: state => state.postComments,
  isDrawerOpen: state => state.drawer,
  isLoggedIn: state => state.auth.loggedIn,
  user: state => state.auth.user
}

export const mutations = {
  [SET_PRODUCTS](state, products) {
    state[PRODUCTS] = products
  },
  [SET_PAGINATION](state, pagination) {
    state[PAGINATION] = pagination
  },
  SET_POST_COMMENTS(state, comments) {
    state.postComments = comments
  },
  ADD_COMMENT(state,comment){
    state.postComments.push(comment)
  },
  // DELETE_PRODUCT(state,comment){
  //   state.postComments.push(comment)
  // },
  set_drawer(state, v) {
    state.drawer = v
  }
}

export const actions = {
  // set store on server
  async nuxtServerInit({ commit }, {$auth,$api}) {
    try {
      // commit unAuthunticated parts
      commit('user/set_section', await $api.getSections())
      if (!$auth.$state.loggedIn) return
      /*
       ** commit Authunticated parts
       ** set cart and my producs state
       */
      const cart = await $api.getCart()
      commit('user/set_cart', cart)
    } catch (e) {
      console.log(e);
    }
  },
  [SET_DATA_AND_PAGINATION]({ commit }, payload) {
    commit(SET_PRODUCTS, payload.docs)
    commit(SET_PAGINATION, (function() {
      const copyData = { ...payload }
      delete copyData.docs
      return copyData
    }()))
  },
  async addComment({ commit }, commentObject) {
    try {
      const comment = await this.$api.addComment(commentObject)
      commit('ADD_COMMENT', comment)
    }catch (e) {
      console.log(e)
    }
  }
};
