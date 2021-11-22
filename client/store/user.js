let timer;

export const state = () => ({
  cart: 0,
  token: "",
  expirtionDate: null,
  sections: []
});

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
      };
    });
  }
};

export const mutations = {
  set_cart(state, cart) {
    state.cart = cart;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_EXPIRATION_DATE(state, date) {
    state.expirtionDate = date;
  },
  set_section(state, sections) {
    state.sections = sections;
  }
};

export const actions = {
  async deleteProduct({ commit }, payload) {
    const { ajaxPayload } = payload;
    // delete product from ui
    // dispatch(DELETE_PRODUCT,id,{root:true});
    try {
      // delete product from database
      const paginationData = await this.$api.deleteProduct(ajaxPayload);
      // in case user cart his own products which he want to delete
      const cart = await this.$api.getCart();
      // update cart,data pagination state
      commit("set_cart", cart);

      const metaData = {
        isPageParamGreaterThanTotalPages: false,
        paginationData: {
          ...paginationData
        }
      };
      const { page } = this.app.context.params;
      if (page > paginationData.totalPages) {
        metaData.isPageParamGreaterThanTotalPages = true;
      }

      return metaData;

      // dispatch(SET_DATA_AND_PAGINATION,paginationData,{root:true})
    } catch (e) {
      console.log(e);
    }
  },
  async removeCartItem({ commit }, prodId) {
    await this.$api.deleteCartItem({ productId: prodId });
    commit("set_cart", await this.$api.getCart());
  },
  login({ commit, dispatch }, { email, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          data: { token }
        } = await this.$auth.loginWith("local", {
          data: {
            email,
            password
          }
        });
        commit("SET_TOKEN", token);
        commit("set_cart", await this.$api.getCart());
        dispatch("startRefreshTokenTimer");
        resolve(true);
      } catch (e) {
        console.log(e);
        reject(e.response.data);
      }
    });
  },
  async logout() {
    await this.$auth.logout();
    console.log(timer);
    clearTimeout(timer);
  },
  tryLogout({ dispatch }, time) {
    setTimeout(() => {
      dispatch("logout");
    }, time * 1000);
  },
  async refreshToken({ commit, dispatch }) {
    try {
      const { token } = await this.$axios.$post("/hpi/admin/refresh-token");
      commit("SET_TOKEN", token);
      await this.$auth.setUserToken(token);
      dispatch("startRefreshTokenTimer");
    } catch (error) {
      console.dir(error);
      dispatch("logout");
    }
  },
  startRefreshTokenTimer({ state, dispatch }) {
    const { exp } = JSON.parse(atob(state.token.split(".")[1]));
    const expiryTimeDecreasedByTenSeconds = exp * 1000 - 10000;
    if (expiryTimeDecreasedByTenSeconds > Date.now()) {
      const timeout = expiryTimeDecreasedByTenSeconds - Date.now();
      console.log(timeout);
      timer = setTimeout(() => {
        dispatch("refreshToken");
      }, timeout);
    }
  }
};
