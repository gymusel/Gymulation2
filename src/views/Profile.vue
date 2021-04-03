<template>
  <div class="profile__wrapper">
    <div v-show="editProfileModal" @click="closeEditProfileModal" class="modal">
      <div v-on:click.stop><EditProfileModal /></div>
    </div>
    <div class="front">
      <div class="profile-info">
        <div class="icons">
          <font-awesome-icon icon="heart" size="3x" class="icon" v-if="isMyself(uid) == false && isFollowed(uid)" @click="unfollow(uid)" style="color:#91457a;" />
          <font-awesome-icon :icon="['far', 'heart']" size="3x" class="icon" v-if="isMyself(uid) == false && isFollowed(uid) == false" @click="follow(uid)" />
          <font-awesome-icon icon="comment" size="3x" class="icon" v-if="isFollowed(uid)" />
        </div>
        <img :src="photoURL" class="user-icon" v-if="photoURL" />
        <img src="@/assets/logo.png" class="user-icon" v-else />
        <div class="icons">
          <a :href="`https://www.instagram.com/${instagram}`" target="_blank"><font-awesome-icon :icon="['fab', 'instagram']" size="3x" class="icon" v-if="instagram" /></a>
          <font-awesome-icon icon="cog" size="3x" class="icon" @click="showEditProfileModal" v-if="isMyself(uid)" />
        </div>
        <h1 class="displayName">{{ displayName }}</h1>
        <p>{{ team }}</p>
        <div class="numbers">
          <div class="number"><h1>{{ followCount }}</h1><p>Follows</p></div>
          <div class="number"><h1>{{ followerCount }}</h1><p>Followers</p></div>
          <router-link :to="{ name: 'Skills', params: { mySkills: true }}" class="number"><h1>{{ skillCount }}</h1><p>Skills</p></router-link>
        </div>
        <h1 class="d-score">D-SCORE {{ dScore }}</h1>
      </div>
      <div class="events">
        <div class="event">
          <img src="@/assets/floor.jpg" class="event-icon" />
          <div>
            <h1 style="margin: 0 41px;">ゆか</h1>
            <h1>D-SCORE {{ dFloor }}</h1>
          </div>
        </div>
        <div class="event">
          <img src="@/assets/pommel.jpg" class="event-icon" />
          <div>
            <h1>あん馬</h1>
            <h1>D-SCORE {{ dPommel }}</h1>
          </div>
        </div>
        <div class="event">
          <img src="@/assets/rings.jpg" class="event-icon" />
          <div>
            <h1>つり輪</h1>
            <h1>D-SCORE {{ dRing }}</h1>
          </div>
        </div>
        <div class="event">
          <img src="@/assets/vault.jpg" class="event-icon" />
          <div>
            <h1 style="margin: 0 41px;">跳馬</h1>
            <h1>D-SCORE {{ dVault }}</h1>
          </div>
        </div>
        <div class="event">
          <img src="@/assets/parallel.jpg" class="event-icon" />
          <div>
            <h1>平行棒</h1>
            <h1>D-SCORE {{ dParallel }}</h1>
          </div>
        </div>
        <div class="event">
          <img src="@/assets/horizontal.jpg" class="event-icon" />
          <div>
            <h1 style="margin: 0 41px;">鉄棒</h1>
            <h1>D-SCORE {{ dHorizontal }}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditProfileModal from "@/components/EditProfileModal.vue"
import firebase from "firebase/app";

export default {
  components: {
    EditProfileModal,
  },
  data() {
    return {
      uid: "",
      createdAt: "",
      displayName: "",
      photoURL: "",
      team: "",
      instagram: "",
      // follows: [],
      followCount: "",
      // followers: [],
      followerCount: "",
      skillCount: 0,
      dScore: 0,
      dFloor: 0,
      dPommel: 0,
      dRing: 0,
      dVault: 0,
      dParallel: 0,
      dHorizontal: 0,
      currentUserId: "",
      myFollows: [],
      myFollowCount: "",
      editProfileModal: false,
    };
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
          this.myFollowCount = userData.followCount;
        }
      });
    },
    fetchUserData(uid) {
      firebase.firestore().collection('users').doc(uid).onSnapshot((doc) => {
        const userData = doc.data();
        if (userData) {
          this.uid = userData.uid;
          this.createdAt = userData.createdAt;
          this.displayName = userData.displayName;
          this.photoURL = userData.photoURL;
          this.team = userData.team;
          this.instagram = userData.instagram;
          // this.follows = userData.follows;
          this.followCount = userData.followCount;
          // this.followers = userData.followers;
          this.followerCount = userData.followerCount;
          this.skillCount = userData.skillCount;
          this.dScore = userData.dScore;
          this.dFloor = userData.dFloor;
          this.dPommel = userData.dPommel;
          this.dRing = userData.dRing;
          this.dVault = userData.dVault;
          this.dParallel = userData.dParallel;
          this.dHorizontal = userData.dHorizontal;
        }
      });
    },
    isMyself(uid) {
      return uid == this.currentUserId ? true : false;
    },
    isFollowed(uid) {
      return this.myFollows.indexOf(uid) >= 0 ? true : false;
    },
    follow(uid) {
      console.log('Adding' + uid + ' to your follows')
      const currentUserDoc = firebase.firestore().collection('users').doc(this.currentUserId);
      currentUserDoc.update({
        follows: firebase.firestore.FieldValue.arrayUnion(uid),
        followCount: this.myFollowCount + 1
      });
      const userDoc = firebase.firestore().collection('users').doc(uid);
      userDoc.update({
        followers: firebase.firestore.FieldValue.arrayUnion(this.currentUserId),
        followerCount: this.followerCount + 1
      });
    },
    unfollow(uid) {
      console.log('Removing' + uid + ' from your follows')
      const currentUserDoc = firebase.firestore().collection('users').doc(this.currentUserId);
      currentUserDoc.update({
        follows: firebase.firestore.FieldValue.arrayRemove(uid),
        followCount: this.myFollowCount - 1
      });
      const userDoc = firebase.firestore().collection('users').doc(uid);
      userDoc.update({
        followers: firebase.firestore.FieldValue.arrayRemove(this.currentUserId),
        followerCount: this.followerCount - 1
      });
    },
    showEditProfileModal() {
      this.editProfileModal = true;
    },
    closeEditProfileModal() {
      this.editProfileModal = false;
    }
  },
  created() {
    this.fetchCurrentUserData();
    if (this.currentUserId) {
      this.fetchMyFollows(this.currentUserId);
    }
    this.fetchUserData(this.$route.params.uid);
  },
  watch: {
    $route () {
      this.fetchCurrentUserData();
      if (this.currentUserId) {
        this.fetchMyFollows(this.currentUserId);
      }
      this.fetchUserData(this.$route.params.uid);
    }
  },
}
</script>

<style lang="scss" scoped>
.modal {
  height: calc(100vh - 70px);
}
.profile__wrapper {
  padding-top: 70px;
}
.front {
  height: calc(100vh - 70px);
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  // justify-content: center;
  // align-items: center;
  // flex-basis: 375px;
}
.profile-info {
  background: #111015;
  // min-height: calc(100vh - 70px);
  min-width: 375px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  a {
    color: white;
  }
  .icons {
    width: 250px;
    display: flex;
    justify-content: space-between;
    .icon:hover {
      color: #91457a;
    }
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
    .number {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      &:hover {
        color: #91457a;
      }
    }
  }
  .d-score {
    font-size: 40px;
  }
}
.events {
  background: #111015;
  min-height: calc(100vh - 70px);
  min-width: 375px;
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  @media screen and (max-width: 480px) {
    margin: 50px 0;
  }
  .event {
    border-radius: 40px;
    width: 90%;
    display: flex;
    // justify-content: flex-start;
    align-items: center;
    padding: 3px;
    &:hover {
      background: #6b1f54;
    }
    .event-icon {
      width: 75px;
      height: 75px;
      border-radius: 50%;
    }
    div {
      display: flex;
      flex-wrap: wrap;
    }
    h1 {
      margin: 0 25px;
      @media screen and (max-width: 480px) {
        font-size: 25px;
      }
    }
  }
}
</style>