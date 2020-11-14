<template>
  <v-app>
    <appHeader/>

    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>

  </v-app>
</template>
<script>

import appHeader from '~/components/header';

export default {
  components: {
    appHeader,
  },
}

</script>
