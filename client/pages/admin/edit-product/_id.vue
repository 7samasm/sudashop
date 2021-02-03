<template>
  <v-row justify="center">
    <v-col cold="12" md="6">
      <h2 class="main-text">edit product</h2>
      <product-form :editable="true" :productId="$route.params.id"></product-form>
    </v-col>
  </v-row>
</template>

<script>
import ProductForm from "~/components/ui/ProductForm";
export default {
  middleware: ["auth"],
  components: { ProductForm },
};
</script>
<style scoped>
.main-text {
  font-size: 108%;
  font-weight: 400;
  letter-spacing: 0.25px;
  margin-bottom: 0;
  padding-bottom: 12px;
}
</style>
