import {SET_PRODUCTS} from '~/store'
export default function({store}){
	store.commit(SET_PRODUCTS,[])
}