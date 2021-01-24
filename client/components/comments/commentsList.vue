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
    <comment
      v-else
      v-for="(comment, key) in postComments"
      :key="key"
      class="mb-2"
      :comment="comment"
      @deleteCommentDidStart="dialogLoading = true"
      @deleteCommentDidFinish="dialogLoading = false"
    />
    <addComment
      @addCommentDidStart="dialogLoading = true"
      @addCommentDidFinish="dialogLoading = false"
    />
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import comment from "~/components/comments/comment";
import addComment from "~/components/comments/addComment";
import CustomOverlay from "~/components/ui/overlay";
export default {
  data() {
    return {
      dialogLoading: false,
    };
  },
  computed: {
    ...mapGetters(["postComments"]),
  },
  components: { comment, addComment, CustomOverlay },
};
</script>
