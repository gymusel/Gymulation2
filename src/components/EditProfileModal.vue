<template>
  <div class="sign-in__wrapper">
    <h2>プロフィールを編集する</h2>
    <form @submit.prevent="updateProfile">
      <div class="field">
        <label for="displayName" v-bind:class="{ move: displayNameOnMove || displayName }" class="label">名前</label>
        <input type="displayName" v-model="displayName" v-on:focus="typeDisplayName" class="input">
      </div>
      <div class="field">
        <label for="team" v-bind:class="{ move: teamOnMove || team }" class="label">所属</label>
        <input type="team" v-model="team" v-on:focus="typeTeam" class="input">
      </div>
      <div class="field">
        <label for="instagram" v-bind:class="{ move: instagramOnMove || instagram }" class="label">Instagramユーザーネーム</label>
        <input type="instagram" v-model="instagram" v-on:focus="typeInstagram" class="input">
      </div>
      <div class="field">
        <label for="file">プロフィール画像</label>
        <input type="file" @change="uploadPhotoURL">
      </div>
      <div class="error">{{ error }}</div>
      <button type="submit" class="submit-btn">変更する</button>
    </form>
    <span>メールアドレスを変更したいときは</span>
    <span>パスワードを変更したいときは</span>
  </div>
</template>

<script>
import firebase from "firebase/app";
// import "firebase/auth";

export default {
  data() {
    return {
      uid: "",
      displayNameOnMove: false,
      teamOnMove: false,
      instagramOnMove: false,
      photoURLOnMove: false,
      displayName: "",
      photoURL: "",
      team: "",
      instagram: "",
      error: "",
    };
  },
  created() {
    this.fetchCurrentUserData();
    this.fetchProfile(this.uid);
  },
  methods: {
    fetchCurrentUserData() {
      this.uid = firebase.auth().currentUser.uid;
    },
    fetchProfile(uid) {
      firebase.firestore().collection('users').doc(uid).onSnapshot((doc) => {
        const userData = doc.data();
        if (userData) {
          this.displayName = userData.displayName;
          this.photoURL = userData.photoURL;
          this.team = userData.team;
          this.instagram = userData.instagram;
        }
      });
    },
    typeDisplayName:function(){
      this.displayNameOnMove = true;
    },
    typeTeam:function(){
      this.teamOnMove = true;
    },
    typeInstagram:function(){
      this.instagramOnMove = true;
    },
    uploadPhotoURL(event){
      this.photoURL = event.target.files[0];
    },
    updateProfile() {
      console.log("displayName: " + this.displayName);
      console.log("photoURL: " + this.photoURL);
      console.log("team: " + this.team);
      console.log("instagram: " + this.instagram);

      const userRef = firebase.auth().currentUser;
      
      userRef.updateProfile({
        displayName: this.displayName
      });

      firebase.firestore().collection("users").doc(userRef.uid).update({
        displayName: this.displayName,
        team: this.team,
        instagram: this.instagram
      });

      if (this.photoURL) {
        const storageRef = firebase.storage().ref(`profileImages/${this.uid}`);
        const uploadTask = storageRef.put(this.photoURL);
        uploadTask.on('state_changed', 
          snapshot => {
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.fileLoading = percentage
          },
          err => {
            console.log(err)
            this['flash/setFlash']({
              message: 'ファイルのアップロードに失敗しました。',
              type: 'error'
            })
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              userRef.updateProfile({
                photoURL: downloadURL
              });
              firebase.firestore().collection("users").doc(userRef.uid).update({
                photoURL: downloadURL
              })
            })
          }
        )
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sign-in__wrapper {
  background: #111015;
  top: 0;
  height: 75vh;
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
  color: rgb(136, 153, 166);
}
.label {
  cursor: text;
  position: absolute;
  left: 10px;
  transform-origin: left;
  transform: translateY(0);
  transition: all .15s;
}
.move {
  transform: translateY(-12px) scale(.6);
}
.input {
  background: #111015;
  color: white;
  border: solid rgb(56, 68, 77);
  border-radius: 5px;
  padding: 20px 5px 5px;
  font-size: 20px;
}
input:focus {
  border: 2px solid #6b1f54;
  border-radius: 5px;
  outline: none;
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