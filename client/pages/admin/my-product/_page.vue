<template>
  <div>
    <custom-dialog
      :visible="dialogActive"
      title="Hint"
      message="are you sure ?"
      @close="dialogActive = false"
      @leftHasClicked="dialogActive = false"
      @rightHasClicked="
        removeProduct({
          title : slotData.title,
          ajaxPayload: {
            productId: slotData.id,
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
        <v-btn text outlined small color="red" class="ml-2" @click.prevent="openDialog(id,title)">
          <v-icon>mdi-delete-outline</v-icon>
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
import myProductsMixin from "./myProductsMixin";
export default {
  mixins: [myProductsMixin],
};
</script>
