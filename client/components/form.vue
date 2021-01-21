<template>
  <v-card :loading="btnLoading">
    <custom-dialog
      title="Tip"
      :message="dialogText"
      :visible="dialog"
      :hideLeftBtn="editable"
      @leftHasClicked="$router.push('/admin/my-product')"
      @rightHasClicked="whenRightDialogBtnPressed"></custom-dialog>
    <v-card-text>
      <validation-observer v-slot="{ invalid }">
        <v-form ref="form">
          <validation-provider
            rules="required"
            name="title"
            v-slot="{ errors }"
          >
            <v-text-field
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
              :error-messages="errors"
              label="description"
              v-model="description"
              appendIcon="mdi-message-text-outline"
              :color="baseColor"
            ></v-text-field>
          </validation-provider>

          <v-file-input
            dense
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
            outlined
            v-if="editable"
            :loading="btnLoading"
            @click="editProduct"
            class="white--text ml-0"
            :color="baseColor"
          >
            <v-icon left>mdi-square-edit-outline</v-icon>
            <span>edit</span>
          </v-btn>
          <v-btn
            :disabled="invalid || !isCompleted"
            :loading="btnLoading"
            outlined
            v-else
            @click="addProduct"
            class="white--text ml-0"
            :color="baseColor"
          >
            <v-icon left>mdi-checkbox-marked-circle-outline</v-icon>
            <span>add</span>
          </v-btn>
        </v-form>
      </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CustomDialog from "./ui/dialog";
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
      btnLoading: false,
    };
  },
  computed: {
    baseColor() {
      return this.editable ? "amber" : "teal";
      console.log("computed called");
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
        this.$router.push('/admin/my-product')
        return
      }
      this.addAnthor()
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
    async addProduct() {
      this.btnLoading = true;
      try {
        const resp = await this.$api.insertProduct(this.makeFormData());
        this.$refs.form.reset();
        this.btnLoading = false;
        this.dialogText = `${resp.data.title} hass been added successflly do you want to add anthor product ?`;
        this.dialog = true;
      } catch (e) {
        console.log(e);
      }
    },
    async editProduct() {
      this.btnLoading = true;
      try {
        const res = await this.$api.editProduct(this.makeFormData("productId"));
        // rest vuex state
        const cart = await this.$api.getCart();
        this.$store.commit("user/set_cart", cart);
        setTimeout(() => {
          this.$refs.form.reset();
          this.btnLoading = false;
          this.dialogText = `${res.data.title} has been updated successflly!`;
          this.dialog = true;
        }, 500);
      } catch (e) {
        console.log(e);
      }
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    CustomDialog
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
    console.log(this.$store);
    // add foucs to title
    this.$refs.title.focus();
  },
};
</script>