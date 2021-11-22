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
import { mapActions } from "vuex";
export default {
  components: {
    TheHeader,
  },
  methods: {
    ...mapActions({
      refrefreshToken: "user/refreshToken",
    }),
  },
  mounted() {
    const cookieTokenWhithBearerStr = document.cookie
      .split(";")
      .find((cookieString) => cookieString.toString().includes("Bearer"));
    if (!cookieTokenWhithBearerStr) return;
    this.refrefreshToken();
    // const cookieToken = cookieTokenWhithBearerStr.split("%20")[1];
    // this.$store.commit("user/SET_TOKEN", cookieToken);
    // this.startRefreshTokenTimer();
  },
};
</script>
