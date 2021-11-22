export const PRODUCTS = "products";
export const PAGINATION = "pagination";
export const SET_DATA = "SET_DATA";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const SET_PAGINATION = "SET_PAGINATION";
export const DELETE_PRODUCT = "deleteProduct";
export const SET_DATA_AND_PAGINATION = "setDataAndPagination";
export const NEXT_PAGE = "next_page";
export const PREVIOUS_PAGE = "previous_page";

export const state = () => ({
  [PRODUCTS]: [],
  [PAGINATION]: {},
  postComments: []
});

export const getters = {
  [PRODUCTS]: state => state[PRODUCTS],
  postComments: state => state.postComments,
  isLoggedIn: state => state.auth.loggedIn,
  user: state => state.auth.user
};

export const mutations = {
  [SET_PRODUCTS](state, products) {
    state[PRODUCTS] = products;
  },
  [SET_PAGINATION](state, pagination) {
    state[PAGINATION] = pagination;
  },
  SET_POST_COMMENTS(state, comments) {
    state.postComments = comments;
  },
  ADD_COMMENT(state, comment) {
    state.postComments.push(comment);
  },
  REMOVE_COMMENT(state, id) {
    const copiedComments = [...state.postComments];
    const filtered = copiedComments.filter(el => el._id !== id);
    state.postComments = filtered;
  }
};

export const actions = {
  // set store on server initsalized [on first load]
  async nuxtServerInit({ commit, dispatch }, { $auth, $api }) {
    try {
      // commit unAuthunticated parts
      commit("user/set_section", await $api.getSections());
      if (!$auth.$state.loggedIn) return;
      /*
       ** commit Authunticated parts
       ** set cart and my producs state
       */
      const cart = await $api.getCart();
      commit("user/set_cart", cart);
      // dispatch("user/checkAuthStatus");
    } catch (e) {
      console.log(e);
    }
  },
  [SET_DATA_AND_PAGINATION]({ commit }, payload) {
    commit(SET_PRODUCTS, payload.docs);
    commit(
      SET_PAGINATION,
      (function() {
        const copyData = { ...payload };
        delete copyData.docs;
        return copyData;
      })()
    );
  },
  addComment({ commit }, commentObject) {
    return new Promise(async (resolve, reject) => {
      try {
        const comment = await this.$api.addComment(commentObject);
        commit("ADD_COMMENT", comment);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  },
  removeComment({ commit }, { productId, commentId }) {
    return new Promise(async (resolve, resject) => {
      try {
        const comment = await this.$api.deleteComment({ productId, commentId });
        // console.log(comment)
        commit("REMOVE_COMMENT", comment._id);
        resolve(comment);
      } catch (error) {
        resject(error);
      }
    });
  }
};
