import card from '~/components/cards/card'
import cardListMixin from '~/helper/cardListMixin'
import { SET_DATA_AND_PAGINATION } from '~/store'
import { mapActions } from 'vuex'

export default {
  middleware: ['auth','clear_cardList'],
  async fetch({ store, $api, params }) {
    const products = await $api.fetchProducts({ page: params.page}, '/hpi/admin/products')
    store.dispatch(SET_DATA_AND_PAGINATION, products)
  },
  computed : {
    path() {
      return {
        name : "admin/my-product/sort/order/page",
        params : {}
      }
    },
    fallbackUrlCasePageGreaterThanTotalPages(){
      const {page } = this.$route.params;
      return `/admin/my-product/${page - 1}`
    }
  },
  methods: {
    ...mapActions({
      deleteProduct: 'user/deleteProduct'
    }),
    async removeProduct(payload) {
      const metaData = await this.deleteProduct(payload);
      if (metaData) {
        if (metaData.isPageParamGreaterThanTotalPages) {
          this.$router.replace(this.fallbackUrlCasePageGreaterThanTotalPages);
          return;
        }
        this.$store.dispatch(SET_DATA_AND_PAGINATION, metaData.paginationData);
      }
    },
  },
  components: {
    card,
  },
  mixins : [cardListMixin]
}