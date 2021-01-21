<template>
  <v-card
    hover
    class="mb-2"
    shaped
    v-ripple="{class : 'indigo--text'}"
    elevation="6"
  >
    <v-row>
      <v-col cols="12" sm="12" class="pb-0">
        <slot />
        <div class="card-img mt-3">
          <v-img
            class="img"
            :aspect-ratio="188 / 110"
            :src="`${imageUrl(prod.imageUrl)}`"
          ></v-img>
        </div>
      </v-col>
      <v-col cols="12" sm="12">
        <p class="title text-truncate text-center subtitle-1 px-4  grey--text text--darken-2">{{ prod.title }}</p>
        <div class="text-truncate text-center grey--text body-1 px-4 pb-4">{{ prod.description }}</div>
        <div class="price text-truncate text-center grey--text px-4 subtitle-2 font-weight-bold">
          {{ prod.price | currency }}
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import toggleImage from "../../helper/gloalMixIns/toggleImageUrl.mixin";
export default {
  props: ["product"],
  computed: {
    prod() {
      // console.log('computed called!')
      return this.product;
    },
  },
  mixins: [toggleImage],
};
</script>
<style scoped>
.img {
  width: 70%;
  margin: 0 auto;
  display: block;
}
</style>
