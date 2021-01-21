<template>
  <div>
    <custom-dialog
      title="Warnnig !"
      :visible="dialogActive"
      :message="`you want delete ${slotData.title} ?`"
      :loading-right-btn="loadingRightDialogBtn"
      @close="dialogActive = false"
      @leftHasClicked="dialogActive = false"
      @rightHasClicked="
        removeProduct({
          ajaxPayload: {
            productId: slotData.id,
            sortBy: $route.params.sort,
            orderBy: $route.params.order,
            page: $route.params.page,
          },
        })
      "
    ></custom-dialog>
    <cardsList
      :products="prods"
      :pagination="$store.state.pagination"
      :cb-path="path"
    >
      <!-- slot to inject to cards -->
      <template v-slot="{ title, id }">
        <v-btn
          text
          outlined
          small
          color="red"
          class="ml-2"
          @click.prevent="openDialog(id, title)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>

        <v-btn
          text
          outlined
          small
          ripple
          color="amber darken-1"
          class="float-right mr-2"
          @click.prevent="$router.push('/admin/edit-product/' + id)"
        >
          <v-icon>mdi-square-edit-outline</v-icon>
        </v-btn>
      </template>
      <!-- slot to inject to cards -->
    </cardsList>
  </div>
</template>

<script>
import { SET_DATA_AND_PAGINATION } from "~/store";
import myProductsMixin from "../../myProductsMixin";
export default {
  async fetch({ $api, params, store }) {
    const { sort, order, page } = params;
    const data = await $api.fetchProducts(
      {
        sortBy: sort,
        orderBy: order,
        page: page,
      },
      `/hpi/admin/products/`
    );
    store.dispatch(SET_DATA_AND_PAGINATION, data);
  },
  computed: {
    fallbackUrlCasePageGreaterThanTotalPages() {
      const { sort, order, page } = this.$route.params;
      return `/admin/my-product/${sort}/${order}/${page - 1}`;
    },
  },
  mixins: [myProductsMixin],
};
</script>
