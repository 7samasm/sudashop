<template>
  <v-card  class="mb-2">
    <v-card-title class="body-2 py-2">
      <v-row>
        <v-col class="py-1">
          <v-avatar size="40px" class='mr-2'>
            <v-img :src="`http://localhost:3000/d.jpg`" alt="" class="avatar"></v-img>
          </v-avatar>
          <span>{{comment.userId.name}}</span>
        </v-col>
        <v-spacer />
        <v-col class="py-1">
          <p class="caption grey--text text-right">{{$moment(comment.createdAt).fromNow()}}</p>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="justify">{{comment.commentText}}</v-card-text>
  </v-card>
</template>

<script>
export default {
	props : ['comment'],
  data(){
    return {
      url : process.env.baseUrl
    }
  }
}
</script>
<style>
  .justify {text-align: justify !important;}
</style>