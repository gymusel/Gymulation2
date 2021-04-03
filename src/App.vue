<template>
  <div id="app">
    <div v-show="signInModal" @click="closeSignInModal" class="modal">
      <div v-on:click.stop><SignInModal @closeSignInModal="closeSignInModal" /></div>
    </div>
    <div v-show="registerModal" @click="closeRegisterModal" class="modal">
      <div v-on:click.stop><RegisterModal /></div>
    </div>
    <div id="nav">
      <router-link to="/" class="logo">Gymulation</router-link>
      <router-link to="/gymnasts" class="nav__item">Gymnasts</router-link>
      <router-link :to="{ name: 'Skills', params: { mySkills: false }}" class="nav__item">Skills</router-link>
      <router-link :to="{ name: 'Profile', params: { uid: uid }}" v-if="isSignedIn" class="nav__item">Profile</router-link>
      <button v-else @click="showSignInModal">Signin</button>
      <button v-if="isSignedIn" @click="signOut()">Logout</button>
      <button v-else @click="showRegisterModal">Register</button>
    </div>
    <router-view />
  </div>
</template>

<script>
import SignInModal from "@/components/SignInModal.vue"
import RegisterModal from "@/components/RegisterModal.vue"
import firebase from "firebase/app";
import "firebase/auth";

export default {
  components: {
    SignInModal,
    RegisterModal
  },
  data() {
    return {
      uid: "",
      isSignedIn: false,
      signInModal: false,
      registerModal: false,
      // scrollY: 0
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isSignedIn = true
        this.uid = user.uid
      }
    });
  },
  // mounted() {
  //   window.addEventListener('scroll', this.handleScroll);
  // },
  methods: {
    // handleScroll() {
    //     this.scrollY = window.scrollY;
    // },
    showSignInModal() {
      this.signInModal = true;
    },
    closeSignInModal() {
      this.signInModal = false;
    },
    showRegisterModal() {
      this.registerModal = true;
    },
    closeRegisterModal() {
      this.registerModal = false;
    },
    signOut() {
      firebase.auth().signOut();
      this.isSignedIn = false
      this.uid = ""
      this.$router.push('/');
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
}
#app {
  font-family: "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // background: rgb(21, 32, 43);
  background: #111015;
  color: white;
}
.modal {
  background: rgba(0,0,0,0.4);
  z-index: 10;
  position: fixed;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
#nav {
  background: #111015;
  width: 100%;
  height: 70px;
  z-index: 5;
  font-size: 25px;
  position: fixed;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .logo {
    font-weight: bold;
    color: white;
    margin: 0 auto 0 20px;
    text-decoration: none;
  }
  .nav__item {
    font-weight: bold;
    color: white;
    margin: 0 10px;
    text-decoration: none;
    &:hover, &.router-link-exact-active {
      color: #91457a;
    }
  }
  button {
    background: #6b1f54;
    color: white;
    font-weight: bold;
    font-size: 17px;
    height: 40px;
    width: 100px;
    margin: 0 10px;
    border-radius: 30px;
    border: none;
    &:hover {
      opacity: 0.5;
    }
    &:focus {
      outline: none;
    }
  }
}
</style>
