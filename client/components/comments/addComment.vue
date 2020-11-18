<template>
  <v-card class="mb-2">
    <v-card-title class="body-2 grey--text">
      <v-icon class="pa-1">mdi-message-text-outline</v-icon>
      add Comment
    </v-card-title>
    <v-row dense class="flex-column" align="center">
      <v-col sm="11">
        <v-textarea
          v-model="commentText"
          rowHeight="5"
          label="your Comment ..."
          color="teal"
          outlined
        ></v-textarea>
      </v-col>
      <v-col sm="11">
        <v-btn
          text
          outlined
          color="teal"
          :disabled="!isLoggedIn"
          @click="insertComment"
          class="mb-2 float-right"
        >
          <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
          add
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
// align="center" justify="center"
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      id: this.$route.params.product,
      commentText: "",
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
  },
  methods: {
    ...mapActions({
      addComment: "addComment",
    }),
    insertComment() {
      const payload = {
        productId: this.id,
        commentText: this.commentText,
      };
      this.addComment(payload);
      this.commentText = "";
    },
  },
};
</script>
