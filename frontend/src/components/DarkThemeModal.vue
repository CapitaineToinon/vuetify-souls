<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Security warning</v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 class="mb-3">{{ warning }}</v-flex>
            <v-flex xs12 text-xs-center class>
              <fake-captcha @onValid="valid = true" ref="captcha"></fake-captcha>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" @click="CANCEL">Cancel</v-btn>
          <v-btn color="success darken-1" :disabled="!valid" @click="OK">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import FakeCaptcha from "@/components/FakeCaptcha";

export default {
  components: {
    FakeCaptcha
  },

  data() {
    return {
      valid: false,
      dialog: false,
      warning: `Disabling dark theme, huh? Sure thing. Since this is such an unusual request, we just need to make sure you're human.`
    };
  },

  watch: {
    dialog: {
      immediate: true,
      handler(val, oldval) {
        if (val === true && oldval === false) {
          this.valid = false;
          this.$refs.captcha.reset();
        }
      }
    },

    $route: {
      immediate: true,
      handler(val, oldval) {
        this.dialog = false;
      }
    }
  },

  methods: {
    OK() {
      if (this.valid) {
        this.$emit("onOk");
      }
    },

    CANCEL() {
      this.$emit("onCancel");
    }
  }
};
</script>
