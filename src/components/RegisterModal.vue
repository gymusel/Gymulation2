<template>
  <div class="register__wrapper">
    <h2>アカウントを作成</h2>
    <form @submit.prevent="registerUser">
      <div class="field">
        <label for="displayName" v-bind:class="{ move: displayNameOnMove || displayName }">名前</label>
        <input type="displayName" v-model="displayName" v-on:focus="typeDisplayName">
      </div>
      <div class="field">
        <label for="email" v-bind:class="{ move: emailOnMove || email }">メール</label>
        <input type="email" v-model="email" v-on:focus="typeEmail">
      </div>
      <div class="field">
        <label for="password" v-bind:class="{ move: passwordOnMove || password }">パスワード</label>
        <input type="password" v-model="password" v-on:focus="typePassword">
      </div>
      <div class="error">{{ error }}</div>
      <div class="alert">
        <p>アカウントを作成すると、<span>利用規約</span>、および<span>Cookieの使用</span>を含む<span>プライバシーポリシー</span>に同意したことになります。あなたのメールアドレスや電話番号を連絡先に保存しているTwitterユーザーに通知などが表示されます。<span>プライバシーの設定</span></p>
      </div>
      <button type="submit" class="submit-btn">登録する</button>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data() {
    return {
      displayNameOnMove: false,
      emailOnMove: false,
      passwordOnMove: false,
      displayName: "",
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    typeDisplayName:function(){
      this.displayNameOnMove = true;
    },
    typeEmail:function(){
      this.emailOnMove = true;
    },
    typePassword:function(){
      this.passwordOnMove = true;
    },
    registerUser() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          const userRef = firebase.firestore().collection("users").doc(result.user.uid)
          
          userRef.set({
            uid: userRef.id,
            displayName: this.displayName,
            email: this.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            followCount: 0,
            followerCount: 0,
            skillCount: 0,
            dScore: 0,
            dFloor: 0,
            dPommel: 0,
            dRing: 0,
            dVault: 0,
            dParallel: 0,
            dHorizontal: 0
          })

          result.user.updateProfile({
            displayName: this.displayName
          }).then(() => {
            alert('アカウントの新規作成が完了しました！')
            this.sendEmail(this.email)
          })
        },
        (err) => {
          console.log(err);
          if (err.code == "auth/email-already-in-use") {
            this.error = "入力したメールアドレスは登録済みです。";
          } else {
            this.error = "入力したメールアドレスかパスワードに問題があります。";
          }
        }
      )
    },
    sendEmail() {
      const actionCodeSettings = {
        url: "http://" + location.host,
      };
      firebase.auth().languageCode = "ja";
      const user = firebase.auth().currentUser;
      user
        .sendEmailVerification(actionCodeSettings)
        .then(() => alert("認証メールを送信しました。"))
        .catch((e) => console.log(e));
    },
  }
};
</script>

<style lang="scss" scoped>
.register__wrapper {
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
.alert {
  margin-top: auto;
  p {
    margin: 0;
    span {
      color: #91457a;
    }
  }
}
.submit-btn {
  background: #6b1f54;
  color: white;
  border: none;
  border-radius: 30px;
  height: 47px;
  width: 100%;
  margin: 20px 0;
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
</style>