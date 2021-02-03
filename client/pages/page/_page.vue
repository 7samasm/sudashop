<template>
  <card-list
    :products="prods"
    :pagination="pagination"
    :cb-path="{ name: 'sort/order/page' }"
  ></card-list>
</template>
<script>
import cardListMixin from "~/helper/cardListMixin";
import { SET_DATA_AND_PAGINATION } from "~/store";
import CardList from "../../components/cards/CardList.vue";
export default {
  components: { CardList },
  async fetch({ params, store, $api }) {
    const data = await $api.fetchProducts({ page: params.page });
    store.dispatch(SET_DATA_AND_PAGINATION, data);
  },
  mixins: [cardListMixin],
};
</script>
