<template>
  <v-layout wrap style="height: 100%">
    <v-navigation-drawer v-model="show" fixed temporary>
      <v-list-item>
        <v-list-item-avatar>
          <img src="../../static/logo.png" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ username }}</v-list-item-title>
        </v-list-item-content>
        <router-link
          v-if="!isLoggedIn"
          tag="div"
          to="/admin/login"
          class="v-list__item__action"
        >
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
            <v-icon color="grey">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group color="grey" prepend-icon="mdi-view-list" value="true">
          <template #activator>
            <v-list-item-title>Sections</v-list-item-title>
          </template>
          <v-list-item
            v-for="section in sections"
            :to="'/sections/' + section.name"
            :key="section._id"
            class="pl-10"
          >
            <v-list-item-subtitle>{{ section.name }}</v-list-item-subtitle>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
      sections: "user/sections",
      isDrawerOpen: "isDrawerOpen",
    }),
    username() {
      return this.user ? this.user.name : "";
    },
    items() {
      return [
        {
          key: 0,
          title: "Home",
          icon: "mdi-home",
          link: "/",
          render: true,
        },
        {
          key: 1,
          title: "add product",
          icon: "mdi-plus",
          link: "/admin/add-product",
          render: this.isLoggedIn,
        },
        {
          key: 2,
          title: "My Products",
          icon: "mdi-briefcase",
          link: "/admin/my-product",
          render: this.isLoggedIn,
        },
      ].filter((item) => item.render);
    },
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    ...mapActions({
      logout: "user/logout",
    }),
  },
};
</script>
