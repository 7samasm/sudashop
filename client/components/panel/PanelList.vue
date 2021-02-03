<template>
  <div>
    <h4 class="body-2 mb-3 pink--text">{{title}} :</h4>
    <nuxt-link v-for="(product,key) in products" :key="key" :to="'/products/' + product._id" tag="a">
      <PanelItem :product="product"/>
    </nuxt-link>
  </div>
</template>
<script>
import PanelItem from './PanelItem'
export default {
  props: {
    products: { type: Array, required: true },
    title: { type: String, default: 'list' }
  },
  components : {PanelItem}
}

</script>
<style scoped>
a {
		text-decoration: none
}
.v-card {
  border-radius: 0 !important;
  margin-bottom: 1px
}

.img {
  border-radius: 4px
}

</style>
