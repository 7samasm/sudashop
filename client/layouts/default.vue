<template>
  <v-app>
    <the-header></the-header>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import TheHeader from "~/components/ui/TheHeader";

export default {
  components: {
    TheHeader,
  },
};
</script>
