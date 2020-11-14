<template>
	<v-card>

    <v-dialog v-model="dialog" width="400">
        <v-card>
            <v-card-title class='font-weight-medium'>
                Tip :
            </v-card-title>
            <v-card-text class="text-center">
            	{{dialogText}}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small class="ma-2" color="red" text @click="$router.push('/admin/my-product')">{{editable ? 'OK' : 'NO'}}</v-btn>
                <v-btn small class="ma-2 white--text"  :color="baseColor" text v-if="!this.editable" @click="addAnthor">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

		<v-card-text>
			<v-form ref="form">
				<v-text-field 
					ref="title"
					label="title"
					appendIcon="mdi-format-title"
					v-model="title"
					:color="baseColor"></v-text-field>
				<v-text-field 
					label="description"
					v-model="description"
					appendIcon="mdi-message-text-outline"
					:color="baseColor"></v-text-field>
				<v-file-input
					dense
					prepend-icon=""
					v-model="image"
					clear-icon ="mdi-close-circle-outline"
					clearable
					ref="uploadedImage"
					:color="baseColor"
					append-icon="mdi-camera-outline"
					accept="image/*"
					label="upload photo [ optinal ]"></v-file-input>
			    <v-autocomplete
					label="Section"
					v-model="section"
					@change="log"
					:items="mapSections"></v-autocomplete>
				<v-text-field 
					label="price"
					v-model="price"
					type="number"
					appendIcon="mdi-cash-usd-outline"
					:color="baseColor"></v-text-field>					
				<v-btn
					outlined
					v-if="editable"
					:loading="btnLoading"
					@click="editProduct"
					class="white--text ml-0"
					:color="baseColor">
						<v-icon left>mdi-square-edit-outline</v-icon>
						<span>edit</span>						
					</v-btn>
				<v-btn
					:loading="btnLoading"
					outlined
					v-else
					@click="addProduct"
					class="white--text ml-0"
					:color="baseColor">
						<v-icon left>mdi-checkbox-marked-circle-outline</v-icon>
						<span>add</span>
				</v-btn>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script>
	import {mapMutations,mapGetters} from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  props: ['editable', 'productId'],
  data() {
    return {
      //models
      title: '',
      price: '',
      description: '',
      imageUrl: 'd.jpg',
      image: null,
      section: '',

      product: {},
      dialog: false,
      dialogText: '',
      btnLoading: false,
      // titleRules: [() => this.$v.title.required || 'title is required'],
      // decRules: [() => this.$v.description.required || 'description is required'],
      // priceRules: [() => this.$v.price.required || 'price is required'],
      // sectRules: [() => this.$v.section.required || 'section is required']
    }
  },
  computed: {
    baseColor() {
      return this.editable ? 'amber' : 'teal'
      console.log('computed called')
    },
    mapSections() {
    	return this.$store.getters['user/mapSections']
    }
  },
  methods: {
  	...mapMutations({
  		setMyProd : 'user/set_my_products',
  		setCart   : 'user/set_cart'
  	}),
    log() { console.log(this.section) },
    addAnthor() {
      this.$refs.form.reset()
      // this.$refs.form.resetValidation()
      this.dialog = false
    },
    editMode() {
      const { title, price, description, imageUrl, section } = this.product
      const obj = { title, price, description, imageUrl, section }
      for (const prop in obj) this[prop] = obj[prop]
    },
    makeFormData(key = null) {
      const keys = ['title', 'price', 'description', 'imageUrl', 'section']
      if (key) keys.push(key)
      const formData = new FormData()
      for (let key of keys)
        formData.append(key, this[key])
      if (this.image) formData.append('image', this.image, this.image.name)
      return formData
    },
    async addProduct() {
      this.btnLoading = true
      try {
        const resp = await this.$api.insertProduct(this.makeFormData())
        this.btnLoading = false
        this.dialogText = `${resp.data.title} hass been added successflly do you want to add anthor product ?`
        this.dialog = true
      } catch (e) {
        console.log(e);
      }
    },
    async editProduct() {
      this.btnLoading = true
      try {
        const res = await this.$api.editProduct(this.makeFormData('productId'))
        // rest vuex state
        const cart       = await this.$api.getCart()
        this.$store.commit('user/set_cart', cart)
        setTimeout(() => {
          this.$refs.form.reset()
          this.btnLoading = false
          this.dialogText = `${res.data.title} has been updated successflly!`
          this.dialog = true
        }, 500)
      } catch (e) {
        console.log(e);
      }
    }
  },
  validations: {
    title: { required },
    description: { required },
    price: { required },
    section: { required }
  },
  async created() {
    if (this.editable) {
      try {
        const res = await this.$api.getProductByIdAndUser(this.productId)
        if (res) {
          this.product = res
          this.editMode()
        } else {
          this.$router.push('/')
        }
      } catch (e) {}
    }
  },
  mounted() {
    console.log(this.$store);
    // add foucs to title
    this.$refs.title.focus();
  }
}

</script>
