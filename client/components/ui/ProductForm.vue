<template>
  <v-card :loading="btnLoading">
    <custom-dialog
      :title="dialogTitle"
      :message="dialogText"
      :visible="dialog"
      :hideLeftBtn="editable"
      @leftHasClicked="$router.push('/admin/my-product')"
      @rightHasClicked="whenRightDialogBtnPressed"
    ></custom-dialog>
    <v-card-text>
      <validation-observer v-slot="{ invalid }">
        <v-form ref="form">
          <validation-provider
            rules="required|max:10"
            name="title"
            v-slot="{ errors }"
          >
            <v-text-field
              @keydown.enter="sendForm(invalid)"
              :error-messages="errors"
              ref="title"
              label="title"
              appendIcon="mdi-format-title"
              v-model="title"
              :color="baseColor"
            ></v-text-field>
          </validation-provider>

          <validation-provider
            rules="required"
            name="description"
            v-slot="{ errors }"
          >
            <v-text-field
              @keydown.enter="sendForm(invalid)"
              :error-messages="errors"
              label="description"
              v-model="description"
              appendIcon="mdi-message-text-outline"
              :color="baseColor"
            ></v-text-field>
          </validation-provider>

          <v-file-input
            dense
            show-size
            prepend-icon=""
            v-model="image"
            clear-icon="mdi-close-circle-outline"
            clearable
            ref="uploadedImage"
            :color="baseColor"
            append-icon="mdi-camera-outline"
            accept="image/*"
            label="upload photo [ optinal ]"
          ></v-file-input>
          <validation-provider
            rules="required"
            name="section"
            v-slot="{ errors }"
          >
            <v-autocomplete
              :error-messages="errors"
              label="Section"
              v-model="section"
              :items="mapSections"
            ></v-autocomplete>
          </validation-provider>

          <validation-provider
            rules="required"
            name="price"
            v-slot="{ errors }"
          >
            <v-text-field
              @keydown.enter="sendForm(invalid)"
              :error-messages="errors"
              label="price"
              v-model="price"
              type="number"
              appendIcon="mdi-cash-usd-outline"
              :color="baseColor"
            ></v-text-field>
          </validation-provider>
          <v-btn
            :disabled="invalid || !isCompleted"
            :loading="btnLoading"
            :color="baseColor"
            outlined
            @click="sendForm(invalid)"
            class="white--text ml-0"
          >
            <v-icon left>mdi-checkbox-marked-circle-outline</v-icon>
            <span>{{ btnText }}</span>
          </v-btn>
        </v-form>
      </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CustomDialog from "./CustomDialog";
export default {
  props: ["editable", "productId"],
  data() {
    return {
      //models
      title: "",
      price: "",
      description: "",
      imageUrl: "d.jpg",
      image: null,
      section: "",

      product: {},
      dialog: false,
      dialogText: "",
      dialogTitle : 'Tip',
      btnLoading: false,
    };
  },
  computed: {
    baseColor() {
      return this.editable ? "amber" : "teal";
    },
    btnText() {
      return this.editable ? "edit" : "add";
    },
    mapSections() {
      return this.$store.getters["user/mapSections"];
    },
    isCompleted() {
      return this.title && this.description && this.section && this.price;
    },
  },
  methods: {
    ...mapMutations({
      setMyProd: "user/set_my_products",
      setCart: "user/set_cart",
    }),
    whenRightDialogBtnPressed() {
      if (this.editable) {
        this.$router.push("/admin/my-product");
        return;
      }
      this.addAnthor();
    },
    addAnthor() {
      this.$refs.form.reset();
      // this.$refs.form.resetValidation()
      this.dialog = false;
    },
    editMode() {
      const { title, price, description, imageUrl, section } = this.product;
      const obj = { title, price, description, imageUrl, section };
      for (const prop in obj) this[prop] = obj[prop];
    },
    makeFormData(key = null) {
      const keys = ["title", "price", "description", "imageUrl", "section"];
      if (key) keys.push(key);
      const formData = new FormData();
      for (let key of keys) formData.append(key, this[key]);
      if (this.image) formData.append("image", this.image, this.image.name);
      return formData;
    },
    async sendForm(invalid) {
      if (invalid || !this.isCompleted) return
      this.btnLoading = true;
      try {
        if (this.editable) {
          const res = await this.$api.editProduct(this.makeFormData("productId"));
          this.dialogText = `${res.data.title} has been updated successflly!`;
          // rest vuex state
          const cart = await this.$api.getCart();
          this.$store.commit("user/set_cart", cart);
        } else {
          const res = await this.$api.insertProduct(this.makeFormData());
          this.dialogTitle = 'Tip'
          this.dialogText = `${res.data.title} hass been added successflly do you want to add anthor product ?`;
        }
      } catch (e) {
        const errorMessage = e.response.data.message
        this.dialogTitle = 'Error'
        this.dialogText =  this.editable ? errorMessage : errorMessage + ' do you want to retry ?';
      } finally {
        this.$refs.form.reset();
        this.btnLoading = false;
        this.dialog = true;
      }
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    CustomDialog,
  },
  async created() {
    if (this.editable) {
      try {
        const res = await this.$api.getProductByIdAndUser(this.productId);
        if (res) {
          this.product = res;
          this.editMode();
        } else {
          this.$router.push("/");
        }
      } catch (e) {}
    }
  },
  mounted() {
    // add foucs to title
    this.$refs.title.focus();
  },
};
</script>