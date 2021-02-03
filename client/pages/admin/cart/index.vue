<template>
  <v-row v-if="cart">
    <custom-overlay :isLoading="loading"></custom-overlay>
    <v-col v-if="totalPrice > 0" cols="12" class="pt-0">
      <h2 class="subtitle-1">
        <v-icon color="grey lighten-1">mdi-segment</v-icon>
        <span class="grey--text">cart items</span>
      </h2>
    </v-col>

    <v-col cols="12" class="py-0" v-for="(item, index) in cart" :key="index">
      <nuxt-link :to="'/products/' + item._id" tag="a">
        <v-card
          class="cart-item"
          v-ripple="{ class: 'indigo--text' }"
          elevation="3"
        >
          <v-row align="center">
            <v-col cols="2" class="py-1 hidden-sm-and-down">
              <v-avatar size="50px" class="ml-2">
                <v-img
                  :src="`${imageUrl(item.imageUrl)}`"
                  alt=""
                  class="avatar"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col class="py-1 text-center" :cols="toggleAutoGrid">
              <p>{{ item.title }}</p>
            </v-col>
            <v-col class="py-1 text-center" :cols="toggleAutoGrid">
              <p>{{ (item.price * item.quantity) | currency }}</p>
            </v-col>
            <v-col class="py-1 text-center" :cols="toggleAutoGrid">
              <p>quantity : {{ item.quantity }} pcs</p>
            </v-col>
            <v-col class="py-1" :cols="toggleAutoGrid">
              <v-btn
                :icon="!isMobile"
                :color="isMobile ? 'red' : ''"
                :text="isMobile"
                :fab="!isMobile"
                :class="isMobile ? 'dBlock' : 'float-right mr-2'"
                @click.prevent="deleteCartItem(item._id)"
              >
                <v-icon color="#FF5049">mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </nuxt-link>
    </v-col>

    <v-col v-if="totalPrice > 0" cols="12" class="pb-0 mt-5">
      <h2 class="subtitle-1">
        <v-icon color="grey lighten-1">mdi-sigma</v-icon>
        <span class="grey--text body-2">total price</span>
      </h2>
    </v-col>

    <v-col v-if="totalPrice > 0" class="mb-5">
      <v-card class="cart-item">
        <v-row align-content="space-between">
          <v-col>
            <p class="pl-2">total :</p>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <p class="text-right pr-2 purple--text">
              {{ totalPrice | currency }}
            </p>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-col v-else>
      <v-alert
        icon="mdi-alert-circle-outline"
        outlined
        text
        :value="true"
        type="warning"
        >there are no products to show</v-alert
      >
    </v-col>
  </v-row>

  <v-row v-else>
    <v-col>
      <v-skeleton-loader type="chip"></v-skeleton-loader>
    </v-col>
    <v-col v-for="(x, i) in 3" :key="i" cols="12" class="py-2">
      <v-skeleton-loader
        max-height="138"
        :type="isMobile ? 'image' : 'list-item-avatar'"
      ></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CustomOverlay from "~/components/ui/CustomOverlay";
import toggleImageUrlMixin from "../../../helper/gloalMixIns/toggleImageUrl.mixin";
import toggleImageUrl from "../../../helper/gloalMixIns/toggleImageUrl.mixin";
export default {
  name: "cart",
  middleware: ["auth"],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters("user", ["cart", "totalPrice", "totalCartItems"]),
    toggleAutoGrid() {
      return this.isMobile ? 12 : false;
    },
    isMobile() {
      let val = false;
      if (this.$vuetify.breakpoint.xs) val = true;
      return val;
    },
  },
  methods: {
    ...mapActions("user", ["removeCartItem"]),
    async deleteCartItem(id) {
      try {
        this.loading = true;
        await this.removeCartItem(id);
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mixins: [toggleImageUrl],
  components: { CustomOverlay },
};
</script>


<style scoped>
a {
  text-decoration: none;
}
.cart-item {
  border-radius: 27px !important;
  margin-bottom: 11px;
  padding: 0 15px;
}
.avatar {
  width: 50%;
}
p {
  margin: 0;
}
.dBlock {
  display: block;
  margin: 0 auto 5px;
}
</style>