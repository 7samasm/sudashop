<template>
  <v-layout wrap style="height: 100%;">
    <v-navigation-drawer :value="isDrawerOpen" @input="$store.commit('set_drawer',$event)" fixed temporary>
      
      <v-list-item>
        <v-list-item-avatar>
          <img src="../static/logo.png">
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{username}}</v-list-item-title>
        </v-list-item-content>
        <router-link v-if="!isLoggedIn" tag="div" to="/admin/login" class="v-list__item__action">
          <v-icon>mdi-login</v-icon>
        </router-link>
        <v-list-item-action v-else>
          <v-icon @click="logout">mdi-logout</v-icon>
        </v-list-item-action>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense shaped>

        <v-list-item v-for="item in items" :to="item.link" :key="item.key">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <v-list-group color="black"  prepend-icon="mdi-format-list-bulleted-square">
          <template v-slot:activator>
            <v-list-item-title>Sections</v-list-item-title>
          </template>
          <v-list-item v-for="sect in sections" :to="'/sections/' + sect.name" :key="sect._id" class="pl-10">
            <v-list-item-subtitle>{{ sect.name }}</v-list-item-subtitle>
          </v-list-item>
        </v-list-group>

      </v-list>

    </v-navigation-drawer>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      isLoggedIn : 'isLoggedIn',
      user       : 'user', 
      sections   : 'user/sections', 
      isDrawerOpen : 'isDrawerOpen'
    }),
    username(){
      return this.user ? this.user.name : '' 
    },
    items() {
      return [
        {
          key : 0,
          title: 'Home',
          icon: 'mdi-home-outline',
          link: '/',
          render: true
        },
        {
          key : 1,
          title: 'add product',
          icon: 'mdi-plus',
          link: '/admin/add-product',
          render: this.isLoggedIn
        },
        {
          key : 2,
          title: 'My Products',
          icon: 'mdi-briefcase-outline',
          link: '/admin/my-product',
          render: this.isLoggedIn
        }
      ].filter(item => item.render)
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    }
  }
}

</script>
