<template>
  <v-row dense>
    <v-col cols="12">
      <settings :cbPath="cbPath" :totalDocs="pagination.totalDocs" />
    </v-col>
    <v-col
      v-for="(prod, key) in products"
      :key="prod._id"
      cols="6"
      sm="4"
      md="2"
    >
      <nuxt-link :to="'/products/' + prod._id" tag="a" :key="key">
        <card :product="prod">
          <slot :id="prod._id" :title="prod.title"></slot>
        </card>
      </nuxt-link>
    </v-col>
    <v-col cols="12" v-if="products.length > 0">
      <v-pagination
        circle
        color="indigo"
        :length="pagination.totalPages"
        :value="pagination.page"
        @input="goToPage"
      />
    </v-col>
    <!-- preload screen -->
    <template v-if="products.length === 0">
      <v-col v-for="(x, key) in 12" :key="key" cols="6" sm="4" md="2">
        <v-skeleton-loader max-height="245" type="image"></v-skeleton-loader>
      </v-col>
    </template>
  </v-row>
</template>


<script>
import card from "~/components/cards/card";
import settings from "~/components/cards/settings";
import urlsParser from "~/helper/urlParser";
const urlParser = urlsParser;

export default {
  props: {
    products: { type: Array, required: true },
    cbPath: { type: Object },
    pagination: { type: Object, required: true },
  },
  methods: {
    goToPage(num) {
      let urlPage = +this.$route.params.page || 1;
      if (num === urlPage) return;
      const url = urlParser(this.$route.path, "/");
      this.$router.push(`${url}/${num}`);
    },
  },
  components: { card, settings },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
