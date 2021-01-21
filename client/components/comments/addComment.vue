<template>
  <div>
    <v-overlay :value="loading" opacity="0.19">
      <v-progress-circular
        color="indigo"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <h3 class="body-1 my-4">
      <v-icon class="pa-1">mdi-message-text-outline</v-icon>
      add Comment
    </h3>
    <v-card class="mb-2 add-comment pa-4">
      <v-row dense class="flex-column" align="center">
        <v-col sm="11">
          <v-textarea
            v-model.trim="commentText"
            rowHeight="5"
            label="your Comment ..."
            color="teal"
            flat
            clearable
            clear-icon="mdi-delete"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col sm="11">
          <v-btn
            text
            outlined
            color="teal"
            :disabled="!isLoggedIn || isCommentTextEmpty"
            :loading="loading"
            @click="insertComment"
            class="mb-2 float-right"
          >
            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
            add
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
// align="center" justify="center"
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      id: this.$route.params.product,
      commentText: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
    isCommentTextEmpty() {
      const length = this.commentText ? this.commentText.length : 0
      return length < 1
    }
  },
  methods: {
    ...mapActions({
      addComment: "addComment",
    }),
    async insertComment() {
      try {
        this.loading = true;
        const payload = {
          productId: this.id,
          commentText: this.commentText,
        };
        const isAdded = await this.addComment(payload);
        this.commentText = "";
      } catch (error) {
        alert(error.message.toString())
      }
      finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
div.v-card.add-comment {
  border-radius: 15px !important;
}
</style>
