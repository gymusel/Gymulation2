<template>
  <div class="sign-in__wrapper">
    <h2>Gymulationにログイン</h2>
    <form @submit.prevent="signIn">
      <div class="field">
        <label for="email" v-bind:class="{ move: emailOnMove || email }">メール</label>
        <input type="email" v-model="email" v-on:focus="typeEmail">
      </div>
      <div class="field">
        <label for="password" v-bind:class="{ move: passwordOnMove || password }">パスワード</label>
        <input type="password" v-model="password" v-on:focus="typePassword">
      </div>
      <div class="error">{{ error }}</div>
      <button type="submit" class="submit-btn">ログインする</button>
    </form>
    <span>パスワードをお忘れですか？</span>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data() {
    return {
      emailOnMove: false,
      passwordOnMove: false,
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    typeEmail:function(){
      this.emailOnMove = true;
    },
    typePassword:function(){
      this.passwordOnMove = true;
    },
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push("/");
          this.$emit("closeSignInModal")
        })
        .catch(() => {
          this.password = "";
          this.error = "入力されたユーザー名やパスワードが正しくありません。確認してからやりなおしてください。";
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.sign-in__wrapper {
  background: #111015;
  height: 80vh;
  width: 50vw;
  min-width: 275px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
}
form {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
.field {
  width: 100%;
  margin: 10px 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
label {
  cursor: text;
  position: absolute;
  left: 10px;
  transform-origin: left;
  transform: translateY(0);
  color: rgb(136, 153, 166);
  transition: all .15s;
}
.move {
  transform: translateY(-12px) scale(.6);
}
input {
  background: #111015;
  color: white;
  border: solid rgb(56, 68, 77);
  border-radius: 5px;
  padding: 20px 5px 5px;
  font-size: 20px;
  &:focus {
    border: 2px solid #6b1f54;
    border-radius: 5px;
    outline: none;
  }
}
.error {
  color: #E0245E;
  margin: 0;
}
.submit-btn {
  background: #6b1f54;
  color: white;
  border: none;
  border-radius: 30px;
  height: 47px;
  width: 100%;
  margin-top: auto;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  &:hover {
    opacity: 0.5;
  }
  &:focus {
    outline: none;
  }
}
span {
  color: #91457a;
  margin-top: 25px;
}
</style>