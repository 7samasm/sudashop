<template>
	<v-row justify="center">
		<v-col cold="12" md="6">
			<h2 class="main-text">add product</h2>
			<formTemplate/>			
		</v-col>
	</v-row>
</template>

<script>
import formTemplate from '~/components/form';
export default {
	middleware: ['auth'],
	components : {
		formTemplate
	}
}
</script>

<style scoped>
.main-text {
  font-size: 108%;
  font-weight: 400;
  letter-spacing: .25px;
  margin-bottom: 0;
  padding-bottom: 12px;
}
</style>
