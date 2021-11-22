<template>
  <v-dialog width="400" v-model="show" persistent>
    <v-card>
      <v-card-title :class="['font-weight-medium', titleColor]">{{
        title
      }}</v-card-title>
      <v-card-text class="text-center">
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!hideLeftButton"
          small
          class="ma-2"
          color="red"
          text
          @click="$emit('leftHasClicked')"
          >No</v-btn
        >
        <v-btn
          small
          class="ma-2 white--text"
          color="teal"
          text
          @click="$emit('rightHasClicked')"
          :loading="loadRightBtn"
          >Ok</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  // props : ['visible','title','message','loadingRightBtn'],
  props: {
    visible: {
      required: true,
      type: Boolean,
    },
    title: {
      required: true,
      type: String,
    },
    message: {
      required: true,
      type: String,
    },
    loadingRightBtn: {
      type: Boolean,
      required: false,
    },
    hideLeftBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
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
    loadRightBtn() {
      return this.loadingRightBtn || false;
    },
    hideLeftButton() {
      return this.hideLeftBtn;
    },
    titleColor() {
      switch (this.title.toString().trim().toLowerCase()) {
        case "error":
          return "red--text";
          break;
        case "tip":
          return "teal--text";
          break;
        default:
          return "orange--text";
          break;
      }
    },
  },
};
</script>

<style>
</style>