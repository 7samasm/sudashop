<template>
  <cardsList :products="prods" :pagination="pagination" :cb-path="{name : 'sort/order/page'}"/>
</template>
<script>
import cardListMixin from '~/helper/cardListMixin'
import { SET_DATA_AND_PAGINATION } from '~/store'
export default {
  async fetch({ params, store, $api }) {
    console.log('hi')
    const data = await $api.fetchProducts()
    console.log(data)
    store.dispatch(SET_DATA_AND_PAGINATION, data)
  },
  mixins : [cardListMixin] 
}

</script>
