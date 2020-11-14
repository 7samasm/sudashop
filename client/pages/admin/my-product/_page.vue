<template>
  <cardsList :products="prods" :pagination="$store.state.pagination">
    <!-- slot to inject to cards -->
    <template v-slot="{title,id}">
      <v-btn text outlined small color="red" class="ml-2"
        @click.prevent="deleteProduct({id,title})">
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>

      <v-btn text outlined small ripple color="amber darken-1"
        class="float-right mr-2"
        @click.prevent="$router.push('/admin/edit-product/' + id)">
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>

    </template>
    <!-- slot to inject to cards -->
  </cardsList>
</template>
<script>
import card from '~/components/cards/card'
import cardListMixin from '~/helper/cardListMixin'
import { SET_DATA_AND_PAGINATION } from '~/store'
import { mapGetters, mapActions } from 'vuex'
export default {
  middleware: ['auth','clear_cardList'],
  async fetch({ store, $api, params }) {
    const products = await $api.fetchProducts({ page: params.page || 1 }, '/hpi/admin/products')
    store.dispatch(SET_DATA_AND_PAGINATION, products)
  },
  methods: {
    ...mapActions({
      deleteProduct: 'user/deleteProduct'
    }),
  },
  components: {
    card,
  },
  mixins : [cardListMixin]
}

</script>
