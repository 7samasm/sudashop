import apiFactory from '../helper/api-factory'
// import Vue from 'vue'

export default function(context,inject){
	const api = apiFactory(context.app.$axios)
	context.$api = api
	inject('api',api)
}