<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="headline">🤖</v-card-title>
        <v-card-text>Disabling dark theme, huh? Sure thing. Since this is such an unusual request, we just need to make sure you're human.</v-card-text>
        <v-flex xs12 text-xs-center class="px-3 mb-3">
          <vue-recaptcha
            id="memes"
            ref="recaptcha"
            theme="dark"
            @verify="onVerify"
            @expired="onExpired"
            :sitekey="sitekey"
          ></vue-recaptcha>
        </v-flex>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" flat @click="Disagree">Cancel</v-btn>
          <v-btn color="success darken-1" :disabled="!valid" @click="Agree" flat>Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";

export default {
  components: {
    VueRecaptcha
  },

  data() {
    return {
      valid: false,
      sitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
    };
  },

  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },

  watch: {
    dialog: {
      immediate: true,
      handler(val, oldval) {
        if (val === true && oldval === false) {
          this.valid = false;
          this.$refs.recaptcha.reset();
          console.log(document.getElementById("memes"));
        }
      }
    }
  },

  methods: {
    onVerify(response) {
      this.valid = true;
    },

    onExpired() {
      console.log("Expired");
    },

    Agree() {
      if (this.valid) {
        this.$emit("onAgree");
      }
    },

    Disagree() {
      this.$emit("onDisagree");
    }
  }
};
</script>
