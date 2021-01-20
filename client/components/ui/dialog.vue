<template>
  <v-dialog  width="400" v-model="show">
    <v-card>
      <v-card-title class="font-weight-medium">{{title}}</v-card-title>
      <v-card-text class="text-center">
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
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
          >Ok</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props : ['visible','title','message'],
  computed : {
    show : {
      get() {
        return this.visible
      },
      set(value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  }
};
</script>

<style>
</style>