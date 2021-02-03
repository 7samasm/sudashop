<template>
  <card-list
    :products="prods"
    :pagination="pagination"
    :cb-path="path"
  ></card-list>
</template>
<script>
import cardListMixin from "~/helper/cardListMixin";
import { SET_DATA_AND_PAGINATION } from "~/store";
import CardList from "../../../components/cards/CardList.vue";

export default {
  components: { CardList },
  async fetch({ params, store, $api }) {
    const { sort, order, page } = params;
    const data = await $api.fetchProducts({
      page,
      sortBy: sort,
      orderBy: order,
    });
    store.dispatch(SET_DATA_AND_PAGINATION, data);
  },
  computed: {
    path() {
      return {
        name: "sort/order/page",
        params: {},
      };
    },
  },
  mixins: [cardListMixin],
};
</script>
