<template>
  <v-card class="mb-2 comment">
    <v-card-title class="body-2 py-2">
      <v-row>
        <v-col class="py-1">
          <v-avatar size="40px" class="mr-2">
            <v-img :src="`${url}/d.jpg`" alt="" class="avatar"></v-img>
          </v-avatar>
          <span>{{ comment.userId.name }}</span>
        </v-col>
        <v-spacer />
        <v-col class="py-1">
          <p class="caption grey--text text-right">
            {{ $moment(comment.createdAt).fromNow() }}
          </p>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="justify">{{ comment.commentText }}</v-card-text>
    <v-card-actions v-if="isAdmin">
      <v-spacer />
      <v-btn
        small
        text
        color="red"
        @click="
          removeComment({
            productId: $route.params.product,
            commentId: comment._id,
          })
        "
      >
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["comment"],
  computed: {
    ...mapGetters({
      user: "user",
    }),
    isAdmin() {
      console.log(this.user.status);
      return this.user.status === "ADMIN";
    },
    url: (_) => process.env.baseUrl,
  },
  methods: {
    ...mapActions({
      removeComment: "removeComment",
    }),
  },
};
</script>
<style>
div.v-card.comment {
  border-radius: 15px !important;
}
.justify {
  text-align: justify !important;
}
</style>