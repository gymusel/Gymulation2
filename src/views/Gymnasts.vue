<template>
  <div class="gymnasts">
    <router-link :to="{ name: 'Profile', params: { uid: user.uid }}" v-for="user in users" :key="user.id" class="profile-info">
      <div class="icons">
        <font-awesome-icon icon="heart" size="3x" class="icon" v-if="isFollowed(user.uid)" style="color:#91457a;" />
        <font-awesome-icon :icon="['far', 'heart']" size="3x" class="icon" v-else />
      </div>
      <img :src="user.photoURL" class="user-icon" v-if="user.photoURL" />
      <img src="@/assets/logo.png" class="user-icon" v-else />
      <h1 class="displayName">{{ user.displayName }}</h1>
      <p>{{ user.team }}</p>
      <div class="numbers">
        <div class="number"><h1>{{ user.followCount }}</h1><p>Follows</p></div>
        <div class="number"><h1>{{ user.followerCount }}</h1><p>Followers</p></div>
        <div class="number"><h1>{{ user.skillCount }}</h1><p>Skills</p></div>
      </div>
      <h1 class="d-score">D-SCORE {{ user.dScore }}</h1>
    </router-link>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data() {
    return {
      currentUserId: "",
      users: [],
      myFollows: []
    };
  },
  created() {
    this.fetchCurrentUserData();
    if (this.currentUserId) {
      this.fetchMyFollows(this.currentUserId);
    }
    this.fetchUsers();
  },
  methods: {
    fetchCurrentUserData() {
      this.currentUserId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : "";
    },
    fetchMyFollows(uid) {
      firebase.firestore().collection("users").doc(uid).onSnapshot((doc) => {
        const userData = doc.data();
        if (userData.follows) {
          this.myFollows = userData.follows;
        }
      });
    },
    fetchUsers() {
      const users = [];
      firebase.firestore().collection("users").where("uid","!=",this.currentUserId).limit(10).get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            users.push(doc.data())
          });
        })
        .catch(function(error) {
          console.log("Error getting users: ", error);
        });
      this.users = users;
    },
    isFollowed(uid) {
      return this.myFollows.indexOf(uid) >= 0 ? true : false;
    }
  }
}
</script>

<style lang="scss" scoped>
.gymnasts {
  padding-top: 70px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  a {
    color: white;
    text-decoration: none;
  }
}
.profile-info {
  background: #111015;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
  &:hover {
    opacity: 0.7;
  }
}
.icons {
  width: 200px;
  display: flex;
  justify-content: flex-end;
}
.user-icon {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.displayName {
  margin: 15px;
}
.numbers {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin: 15px;
}
.number {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.d-score {
  font-size: 40px;
}
</style>