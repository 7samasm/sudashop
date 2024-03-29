import CardList from '~/components/cards/CardList'
import {PAGINATION,PRODUCTS} from '~/store'

export default {
  // inject: ['theme'],
  middleware: 'clear_cardList',
  computed: {
    prods() {
      return this.$store.getters[PRODUCTS]
    },
    pagination() {
      return this.$store.state[PAGINATION];
    }
  },
  components: { CardList }
}
