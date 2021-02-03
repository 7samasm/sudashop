<template>
  <v-row dense>
    <v-col cols="12">
      <card-list-settings
        :cbPath="cbPath"
        :totalDocs="pagination.totalDocs"
      ></card-list-settings>
    </v-col>
    <v-col
      v-for="(prod, key) in products"
      :key="prod._id"
      cols="6"
      sm="4"
      md="2"
    >
      <nuxt-link :to="'/products/' + prod._id" tag="a" :key="key">
        <card-item :product="prod">
          <slot :id="prod._id" :title="prod.title"></slot>
        </card-item>
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
import CardItem from "~/components/cards/CardItem";
import CardListSettings from "~/components/cards/CardListSettings";
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
  components: { CardItem, CardListSettings },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
