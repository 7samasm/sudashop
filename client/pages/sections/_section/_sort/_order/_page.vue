<template>
  <card-list
    :products="prods"
    :cb-path="path"
    :pagination="pagination"
  ></card-list>
</template>
<script>
import { SET_DATA_AND_PAGINATION } from "~/store";
import cardListMixin from "~/helper/cardListMixin";
import CardList from "../../../../../components/cards/CardList.vue";
export default {
  components: { CardList },
  async fetch({ $api, params, store, route }) {
    const data = await $api.fetchProducts(
      {
        sortBy: params.sort,
        orderBy: params.order,
        page: params.page,
      },
      `/hpi/products/section/${params.section}/`
    );
    store.dispatch(SET_DATA_AND_PAGINATION, data);
  },
  computed: {
    path() {
      return {
        name: "sections/section/sort/order/page",
        params: {
          section: this.$route.params.section,
        },
      };
    },
  },
  mixins: [cardListMixin],
};
</script>
