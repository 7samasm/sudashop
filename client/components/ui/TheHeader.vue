<template>
  <nav>
    <v-toolbar color="white" elevation="0">
      <v-btn class="indigo--text" icon @click="openDrawer = true">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title class="indigo--text">{{toolbarTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>

        <v-tooltip bottom>
          <template v-slot:activator="{on}">
            <v-btn  text to="/" class="indigo--text hidden-sm-and-down" v-on="on">
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </template>
          <span>home</span>
        </v-tooltip>

        <v-tooltip bottom v-if="isLoggedIn">
          <template v-slot:activator="{on}">
            <v-btn  text v-on="on" to="/admin/my-product" class="indigo--text hidden-sm-and-down">
              <v-icon>mdi-briefcase</v-icon>
            </v-btn>
          </template>
          <span>my products</span>
        </v-tooltip>

        <v-tooltip bottom v-if="isLoggedIn">
          <template v-slot:activator="{on}">
            <v-btn text small v-on="on" class="indigo--text" to="/admin/add-product" activeClass="false">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>add product</span>
        </v-tooltip>

        <v-tooltip bottom v-if="isLoggedIn">
          <template v-slot:activator="{on}">
            <v-btn text small v-on="on" to="/admin/cart">
              <v-badge color="red" :value="totalCartItems > 0">
                <template v-slot:badge>{{totalCartItems}}</template>
                <v-icon color="indigo">mdi-cart</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <span>cart</span>
        </v-tooltip>

      </v-toolbar-items>
    </v-toolbar>
    <the-drawer :visible="openDrawer" @close="openDrawer = false"></the-drawer>
  </nav>
</template>
<script>
import TheDrawer from '~/components/ui/TheDrawer';
import { mapGetters, mapActions } from 'vuex'

export default {
  data(){
    return {
      openDrawer : false
    }
  },
  computed: {
    ...mapGetters({
      totalCartItems: 'user/totalCartItems',
      isLoggedIn: 'isLoggedIn'
    }),
    toolbarTitle() {
      // console.log(this.$route);
      const routeName = this.$route.name
      if (!routeName) return ''
      if (routeName === 'sections/section')
        return this.$route.params.section.toUpperCase()
      let arr = routeName.split('/')
      if (arr.length > 1) return arr[1].split('-').join(' ').toUpperCase()
      return 'HOME'
    }
  },
  components: {
    TheDrawer,
  }
}

</script>
