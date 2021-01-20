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
        <h3 class="title text-truncate">{{ prod.title }}</h3>
        <div class="desc text-truncate">{{ prod.description }}</div>
        <div class="price text-center grey--text pa-1 font-weight-bold">
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

h3.title {
  text-align: center;
  padding: 5px 15px;
}

.desc {
  padding: 0 2rem;
  padding-bottom: 2rem;
  color: #888;
}
</style>
