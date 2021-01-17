<template>
  <v-row justify="end">
    <!-- main panel that grib cards and comments -->
    <v-col md="7" v-if="prod.hasOwnProperty('title')">
      <!-- images card -->
      <v-card text>
        <v-img :aspect-ratio="643 / 376" :src="`${imageUrl(prod.imageUrl)}`" alt=""></v-img>
      </v-card>
      <!-- images card -->

      <!-- content card-->
      <v-card class="pa-4 relative">
        <v-row align="center" class="flex-column">
          <!-- informations tags -->
          <v-col sm="12">
            <v-row justify="center">
              <v-col cols="6" lg="3" v-for="(info, key) of quickInformations" :key="key">
                <div :class="info.classes + ' text-lg-center'">
                  <v-icon small>{{ info.icon }}</v-icon>
                  <span class="grey--text caption">{{ info.value }}</span>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <!-- informations tags -->

          <!-- description -->
          <v-col sm="12">
            <section class="body-1">
              {{ prod.description }}
            </section>
          </v-col>
          <!-- description -->

          <!-- add to cart btn -->
          <v-col cols="12">
            <v-btn
              text
              class="btn-req"
              v-if="isLoggedIn && prod.hasOwnProperty('title')"
              @click="dialog = true"
            >
              <v-icon color="pink">mdi-cart-plus</v-icon>
              <span class="pink--text">add to cart</span>
            </v-btn>
          </v-col>
          <!-- add to cart btn -->

          <!-- dialog  -->
          <v-col>
            <v-dialog
              v-model="dialog"
              width="350"
              attach=".relative"
              class="absolute"
            >
              <v-card>
                <v-card-title class="font-weight-medium">
                  <v-icon small color="purple">mdi-tune</v-icon>
                  <span class="body-2 purple--text ml-1">options</span>
                </v-card-title>
                <v-card-text class="text-center">
                  <v-text-field
                    type="number"
                    label="quantity"
                    v-model="quantity"
                    hint="example 10"
                    prepend-icon="mdi-shape"
                    color="pink"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="isSending"
                    :disabled="!(quantity / 1 > 0)"
                    text
                    class="ma-2 white--text"
                    color="purple"
                    @click="saveToCart(id, quantity / 1)"
                  >
                    <v-icon color="purple"
                      >mdi-checkbox-marked-circle-outline</v-icon
                    >
                    <span class="ml-1">Ok</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <!-- dialog  -->
        </v-row>
      </v-card>
      <!-- content card-->

      <!-- comments -->
      <commentsList />
      <!-- comments -->
    </v-col>
    <!-- main panel that grib cards and comments -->

    <!-- side panels  -->
    <v-col cols="12" md="5" class="order-md-first">
      <panelsList title="See also" :products="seeAlso.docs" class="mb-10" />
      <panelsList title="trend" :products="common" />
    </v-col>
    <!-- side panels  -->

    <!-- preloder page -->
    <!--     <v-col v-else sm="7">
      <v-skeleton-loader :type="$vuetify.breakpoint.xs ? 'image,table-heading@4' : 'image@2,table-heading@4'"></v-skeleton-loader>
    </v-col> -->
    <v-btn
      fab
      fixed
      bottom
      right
      elevation="3"
      color="white"
      :class="!$vuetify.breakpoint.xs ? 'left' : ''"
    >
      <v-icon color="pink">mdi-share</v-icon>
    </v-btn>
  </v-row>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import panelsList from '~/components/panel/panelsList'
import commentsList from '~/components/comments/commentsList'
import toggleImageUrl from '../../helper/gloalMixIns/toggleImageUrl.mixin';
export default {
  async asyncData(ctx) {
    // console.log(ctx);
    return {
      prod    : await ctx.$api.getProductById(ctx.params.product),
      seeAlso : await ctx.$axios.$get('/hpi/products/?limit=3'),
      common  : await ctx.$axios.$get('/hpi/products/stats/common'),
      quickInformations : [],
      dialog  : false,
      quantity: ''
    }
  },
  data() {
    return {
      id: this.$route.params.product,
      isSending: false
    }
  },
  head() {
    return {
      title: this.prod.title
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn'
    })
  },
  methods: {
    ...mapMutations({
      setCart: 'user/set_cart',
      setComments : 'SET_POST_COMMENTS'
    }),
    async saveToCart(id, quantity) {
      // disable btn and make it rotate
      this.isSending = true
      try {
        // insert product to cart
        await this.$api.insertCartItem(id, quantity)
        // update total cart's items to update header badge num
        this.setCart(await this.$api.getCart())
        // make btn work again
        this.isSending = false
        this.dialog = false
        this.quantity = ''
      } catch (e) {
        console.log(e.message);
      }
    }
  },
  async created() {
    if (this.prod) {
      // set comment store
      this.$store.commit('SET_POST_COMMENTS',this.prod.comments)
      //  mutate price properity to have an currncey format 100 => 100.00 SDG
      this.prod.price = this.$options.filters.currency(this.prod.price)
      const { price, section, userId } = this.prod
      this.quickInformations = [
        { value: price, icon: 'mdi-cash-usd-outline', classes: '' },
        { value: section, icon: 'mdi-shape', classes: 'pl-10 pl-lg-0' },
        { value: 'khartoum', icon: 'mdi-map-marker', classes: '' },
        { value: '0991255456', icon: 'mdi-phone', classes: 'pl-10 pl-lg-0' },
      ]
    } else {
      this.$router.push('/')
    }
  },
  components : {panelsList,commentsList},
  mixins : [toggleImageUrl]
}

</script>
<style scoped>
.left {
  /*left: 3.5rem;*/
  bottom: 30px;
}

.btn-req {
  /*width: 50%;*/
  margin: 0 auto;
  display: block;
}

.v-card {
  border-radius: 0 !important;
}

/*.absolute {position: absolute;}*/
.v-dialog__content,
.v-dialog__content--active {
  position: absolute !important;
}

.relative {
  position: relative;
}

/*  .my-1 px-3 {
    margin: 2px 0;
    padding: 0 10px;
    color: #777
  }*/
p.sm-text {
  font-size: 14px;
}

.card-img {
  padding: 15px 0;
  position: relative;
}

a {
  text-decoration: none;
}
</style>
