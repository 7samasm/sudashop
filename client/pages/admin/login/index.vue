<template>
  <v-row row justify="center" class="mt-5">
    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title class='font-weight-medium red--text'>
          <v-icon large color='red'>mdi-alert-circle</v-icon> Error
        </v-card-title>
        <v-card-text class="text-center">
          {{dialogText}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="teal" text @click="dialog = false">
            ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col sm="6" md="4">
      <!-- 			<v-card>
				<v-card-text> -->
      <v-form>
        <v-text-field 
        outlined 
        ref="mm" 
        v-model="email" 
        label="email" 
        appendIcon="mdi-account-outline" 
        color="purple"></v-text-field>
        <v-text-field 
        outlined 
        v-model="password" 
        type="password" 
        label="password" 
        appendIcon="mdi-keyboard-outline" 
        color="purple"></v-text-field>
        <v-btn :disabled="false" @click="login" outlined color="purple" class="ml-0">login</v-btn>
        <router-link to="/admin/register" class="float-right pt-2">
          <span>sign up</span>
        </router-link>
      </v-form>
      <!-- 	</v-card-text>
			</v-card> -->
    </v-col>
  </v-row>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      email: '',
      password: '',
      dialog: false,
      dialogText: '',
      // emailRules: [
      //   () => this.$v.email.required || 'E-mail is required',
      //   () => this.$v.email.email || 'E-mail must be valid',
      // ],
      // passRules: [
      //   () => this.$v.password.required || 'password is required'
      // ]
    }
  },
  computed: {
    // isValidated() {
    //   console.log(this.$v)
    //   return this.$v.$invalid
    // }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('user/login',{
          email    : this.email,
          password : this.password
        })
      } catch(e) {
        // statements
        this.dialog = true
        this.dialogText = e
      }
    }
  },
  mounted() {
    if (localStorage.getItem('token')) {
      this.$router.push('/')
      console.log(localStorage.getItem('token'))
    }
  }
}
</script>
