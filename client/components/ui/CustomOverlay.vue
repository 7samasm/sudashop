<template>
  <v-overlay :value="isLoading" opacity="0.19">
    <v-progress-circular
      :color="color"
      indeterminate
      :size="size"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  props : {
    isLoading : {
      type : Boolean,
      required : true,
      default : false
    },
    color : {
      type : String,
      default : 'pink'
    },
    size : {
      type : Number,
      default : 64
    }
  }
};
</script>

<style>
</style>