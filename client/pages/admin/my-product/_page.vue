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
            page: $route.params.page,
          },
        })
      "
    ></custom-dialog>
    <card-list
      :products="prods"
      :pagination="$store.state.pagination"
      :cb-path="path"
      #default="{ title, id }"
    >
      <!-- slot to inject to cards -->
      <v-btn
        text
        small
        color="grey darken-1"
        class="ml-2"
        @click.prevent="openDialog(id, title)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn
        text
        small
        ripple
        color="grey darken-1"
        class="float-right mr-2"
        @click.prevent="$router.push('/admin/edit-product/' + id)"
      >
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>
      <!-- slot to inject to cards -->
    </card-list>
  </div>
</template>

<script>
import { SET_DATA_AND_PAGINATION } from "~/store";
import CardList from '../../../components/cards/CardList.vue';
import myProductsMixin from "./myProductsMixin";
export default {
  components: { CardList },
  mixins: [myProductsMixin],
};
</script>
