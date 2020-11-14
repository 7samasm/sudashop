<template>
	<v-card class="mb-1">
		<v-row align="center">
			<v-col cols="3" class="py-6">
				<!-- <v-avatar size="70px" class='ml-4'> -->
				<v-img :src="`http://localhost:3000/d.jpg`" alt="" :aspect-ratio="643/376" class="ml-2 img"></v-img>
				<!-- </v-avatar> -->
			</v-col>
			<v-col cols="9">
				<p class="body-2 pr-4 text-justify">{{product.description}} Lorem ipsum dolor sit</p>
			</v-col>
		</v-row>
	</v-card>
</template>
<script>
export default {
	props : ['product'],
  data(){
    return {
      url : process.env.baseUrl
    }
  }
}

</script>
<style>
</style>
