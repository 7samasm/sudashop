<template>
  <v-card
    class="mb-4 panel"
    elevation="3"
    :disabled="$route.params.product == product._id"
    v-ripple="{ class: 'indigo--text' }"
  >
    <v-row align="center">
      <v-col cols="3" class="py-6">
        <!-- <v-avatar size="70px" class='ml-4'> -->
        <v-img
          :src="`${imageUrl(product.imageUrl)}`"
          alt=""
          :aspect-ratio="643 / 376"
          class="ml-2 img"
        ></v-img>
        <!-- </v-avatar> -->
      </v-col>
      <v-col cols="9">
        <p class="body-2 pr-4 text-justify">
          {{ product.description }} Lorem ipsum dolor sit
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import toggleImageUrl from "../../helper/gloalMixIns/toggleImageUrl.mixin";
export default {
  props: ["product"],
  data() {
    return {
      url: process.env.baseUrl,
    };
  },
  mixins: [toggleImageUrl],
};
</script>
<style scoped>
  div.v-card.panel {
    border-radius: 15px !important;
  }
	.v-card--disabled{
		color: #3f51b5;
	}
</style>>
</style>
