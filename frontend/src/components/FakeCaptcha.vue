<template>
  <div class="rc-anchor rc-anchor-normal rc-anchor-dark" @click="check">
    <div class="rc-anchor-content">
      <v-layout xs12 wrap>
        <v-flex xs2 class="ml-2 mr-2 px-3 my-auto">
          <transition name="fade" mode="out-in">
            <v-checkbox v-if="!loading" :input-value="checked" color="blue" readonly class="cbx"></v-checkbox>
            <v-progress-circular v-else color="blue" indeterminate></v-progress-circular>
          </transition>
        </v-flex>

        <v-flex xs4 text-xs-left class="my-auto robot-text subheading pb-1">I'm not a robot</v-flex>
        <v-spacer></v-spacer>

        <v-flex xs4 text-xs-center class="pa-3 my-auto logo-and-text">
          <v-layout xs12 wrap>
            <v-flex xs12>
              <v-img
                src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                class="mx-auto mb-2"
                :height="32"
                :width="32"
              ></v-img>
            </v-flex>
            <v-flex xs12>
              <span class="reCAPTCHA">reCAPTCHA</span>
            </v-flex>
            <v-flex xs12>
              <span class="privacy-terms grey--text">
                <a @click.stop="memes">Privacy</a> -
                <a @click.stop="memes">Terms</a>
              </span>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";

export default {
  data() {
    return {
      loading: false,
      checked: false
    };
  },

  methods: {
    memes() {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    },
    reset() {
      this.loading = false;
      this.checked = false;
    },
    check() {
      if (!this.checked) {
        this.checked = true;
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$emit("onValid");
        }, 2000);
      }
    }
  }
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.rc-anchor {
  cursor: pointer;
  border: 1px solid #525252;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.08);
}

.rc-anchor-normal {
  width: 100%;
}

.robot-text {
  display: inline-block;
  vertical-align: middle;
}

.rc-anchor-dark {
  background: #222;
  color: #fff;
}

.privacy-terms a {
  text-decoration: none;
  color: white;
}

.privacy-terms a:hover {
  text-decoration: underline;
}

.logo-and-text {
  line-height: 10px;
}

.reCAPTCHA {
  font-size: 10px;
}

.privacy-terms {
  font-size: 8px;
}
</style>
