<template>
  <v-row row justify="center" class="mt-5">
    <custom-dialog
      title="Error"
      hideLeftBtn
      :message="dialogText"
      :visible="dialog"
      @rightHasClicked="dialog = false"
    ></custom-dialog>
    <v-col sm="6" md="4">
      <!-- 			<v-card>
				<v-card-text> -->
      <validation-observer v-slot="{ invalid }">
        <v-form>
          <validation-provider rules="required|email" name="email" v-slot="{ errors }">
            <v-text-field
              :error-messages="errors"
              outlined
              ref="mm"
              v-model="email"
              label="email"
              appendIcon="mdi-account-outline"
              color="purple"
            ></v-text-field>
          </validation-provider>

          <validation-provider rules="required" name="password" v-slot="{ errors }">
            <v-text-field
              :error-messages="errors"
              outlined
              v-model="password"
              type="password"
              label="password"
              appendIcon="mdi-keyboard-outline"
              color="purple"
            ></v-text-field>
          </validation-provider>

          <v-btn
            :disabled="invalid"
            @click="login"
            outlined
            color="purple"
            class="ml-0"
            >login</v-btn
          >
          <router-link to="/admin/register" class="float-right pt-2">
            <span>sign up</span>
          </router-link>
        </v-form>
      </validation-observer>
      <!-- 	</v-card-text>
			</v-card> -->
    </v-col>
  </v-row>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CustomDialog from '../../../components/ui/CustomDialog'
export default {
  data() {
    return {
      email: "",
      password: "",
      dialog: false,
      dialogText: "",
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    CustomDialog
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("user/login", {
          email: this.email,
          password: this.password,
        });
      } catch (e) {
        console.log(e)
        // statements
        this.dialog = true;
        this.dialogText = e.message;
      }
    },
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.$router.push("/");
      console.log(localStorage.getItem("token"));
    }
  },
};
</script>
