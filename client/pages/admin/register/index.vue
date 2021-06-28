<template>
  <v-row justify="center">
    <custom-dialog
      :title="dialogTitle"
      hideLeftBtn
      :message="dialogText"
      :visible="dialog"
      @rightHasClicked="onDialogBtnClicked"
    ></custom-dialog>
    <v-col md="6">
      <v-card>
        <v-card-text>
          <validation-observer v-slot="{ invalid }">
            <v-form>
              <validation-provider
                rules="required|min:4|alpha_dash"
                name="username"
                v-slot="{ errors }"
              >
                <v-text-field
                  :error-messages="errors"
                  ref="name"
                  label="username"
                  appendIcon="mdi-account-outline"
                  v-model.trim="name"
                  :color="baseColor"
                ></v-text-field>
              </validation-provider>
              <!-- <pre>{{this.$v}}</pre> -->
              <validation-provider
                rules="required|email"
                name="email"
                v-slot="{ errors }"
              >
                <v-text-field
                  :error-messages="errors"
                  label="email"
                  v-model.trim="email"
                  appendIcon="mdi-email-outline"
                  :color="baseColor"
                ></v-text-field>
              </validation-provider>

              <validation-provider
                rules="required|min:6"
                v-slot="{ errors }"
                name="password"
                vid="confirmation"
              >
                <v-text-field
                  :error-messages="errors"
                  label="password"
                  v-model.trim="password"
                  type="password"
                  appendIcon="mdi-keyboard-outline"
                  :color="baseColor"
                ></v-text-field>
              </validation-provider>

              <validation-provider
                rules="confirmed:confirmation"
                v-slot="{ errors }"
                name="repeatl password"
              >
                <v-text-field
                  :error-messages="errors"
                  label="Repeatl password"
                  v-model.trim="repassword"
                  type="password"
                  appendIcon="mdi-repeat"
                  :color="baseColor"
                ></v-text-field>
              </validation-provider>

              <v-btn
                :disabled="invalid || !isCompleted"
                outlined
                @click="signUp"
                class="white--text ml-0"
                :color="baseColor"
              >
                <v-icon left>mdi-account-plus-outline</v-icon>
                <span>add</span>
              </v-btn>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CustomDialog from "../../../components/ui/CustomDialog.vue";
export default {
  data() {
    return {
      //models
      name: "",
      email: "",
      password: "",
      repassword: "",
      dialog: false,
      dialogText: "",
      dialogTitle: "",
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    CustomDialog,
  },
  computed: {
    baseColor() {
      return "blue";
    },
    isCompleted() {
      return this.name && this.password && this.email && this.repassword;
    },
  },
  methods: {
    async signUp() {
      try {
        const user = await this.$api.signUp({
          name: this.name,
          email: this.email,
          password: this.password,
        });
        console.log(user);
        const msg = `${user.data.name} has been added sucsessfuly`;
        this.dialogTitle = "Tip";
        this.dialogText = msg;
        this.dialog = true;
        // this.$router.push("/admin/login");
      } catch (e) {
        const errorMessage = e.response.data.message
        this.dialogTitle = "Error";
        this.dialogText = errorMessage;
        this.dialog = true;
      }
    },
    onDialogBtnClicked(){
      // check if dialog title is Error which changed after press register btn
      if (this.dialogTitle.includes('rror')) {
        this.dialog = false
        return
      }
      this.$router.push("/admin/login");
    }
  },
  mounted() {
    console.log(this);
  },
};
</script>
