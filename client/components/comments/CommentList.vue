<template>
  <section>
    <custom-overlay :isLoading="dialogLoading"></custom-overlay>
    <h3 class="body-1 my-4"><v-icon>mdi-comment-outline</v-icon> comments</h3>
    <v-alert
      v-if="postComments.length < 1"
      icon="mdi-alert-circle-outline"
      outlined
      text
      :value="true"
      type="warning"
      >there are no comments to show</v-alert
    >
    <comment-item
      v-else
      v-for="(comment, key) in postComments"
      :key="key"
      class="mb-2"
      :comment="comment"
      @delete-comment-started="dialogLoading = true"
      @delete-comment-finshed="dialogLoading = false"
    ></comment-item>
    <comment-add
      @add-comment-started="dialogLoading = true"
      @add-comment-finshed="dialogLoading = false"
    ></comment-add>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import CommentItem from "~/components/comments/CommentItem";
import CommentAdd from "~/components/comments/CommentAdd";
import CustomOverlay from "~/components/ui/CustomOverlay";
export default {
  data() {
    return {
      dialogLoading: false,
    };
  },
  computed: {
    ...mapGetters(["postComments"]),
  },
  components: { CommentItem, CommentAdd, CustomOverlay },
};
</script>
