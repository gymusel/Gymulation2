<template>
  <div class="skills">
    <div class="btns">
      <div class="btn" @click="addEventQuery('ゆか')" v-bind:class="{active:active01}">ゆか</div>
      <div class="btn" @click="addEventQuery('あん馬')" v-bind:class="{active:active02}">あん馬</div>
      <div class="btn" @click="addEventQuery('つり輪')" v-bind:class="{active:active03}">つり輪</div>
      <div class="btn" @click="addEventQuery('跳馬')" v-bind:class="{active:active04}">跳馬</div>
      <div class="btn" @click="addEventQuery('平行棒')" v-bind:class="{active:active05}">平行棒</div>
      <div class="btn" @click="addEventQuery('鉄棒')" v-bind:class="{active:active06}">鉄棒</div>
      <div class="btn" @click="addEventQuery()" v-bind:class="{active:active07}">All</div>
    </div>
    <div class="btns">
      <div class="btn" @click="addDifficultyQuery('A')" v-bind:class="{active:active08}">A難度</div>
      <div class="btn" @click="addDifficultyQuery('B')" v-bind:class="{active:active09}">B難度</div>
      <div class="btn" @click="addDifficultyQuery('C')" v-bind:class="{active:active10}">C難度</div>
      <div class="btn" @click="addDifficultyQuery('D')" v-bind:class="{active:active11}">D難度</div>
      <div class="btn" @click="addDifficultyQuery('E')" v-bind:class="{active:active12}">E難度</div>
      <div class="btn" @click="addDifficultyQuery('F')" v-bind:class="{active:active13}">F難度</div>
      <div class="btn" @click="addDifficultyQuery('G')" v-bind:class="{active:active14}">G難度</div>
      <div class="btn" @click="addDifficultyQuery('H')" v-bind:class="{active:active15}">H難度</div>
      <div class="btn" @click="addDifficultyQuery()" v-bind:class="{active:active16}">All</div>
    </div>
    <div class="btns">
      <div class="btn" @click="addGroupQuery('I')" v-bind:class="{active:active17}">グループ I</div>
      <div class="btn" @click="addGroupQuery('II')" v-bind:class="{active:active18}">グループ II</div>
      <div class="btn" @click="addGroupQuery('III')" v-bind:class="{active:active19}">グループ III</div>
      <div class="btn" @click="addGroupQuery('IV')" v-bind:class="{active:active20}">グループ IV</div>
      <div class="btn" @click="addGroupQuery('V')" v-bind:class="{active:active21}">グループ V</div>
      <div class="btn" @click="addGroupQuery()" v-bind:class="{active:active22}">All</div>
    </div>
    <div class="field">
      <label for="searchWord" v-bind:class="{ move: searchWordOnMove || searchWord }">キーワード検索</label>
      <input type="text" v-model="searchWord" v-on:focus="typeSearchWord">
    </div>
    <table>
      <thead>
        <tr>
          <th><onoff-toggle theme="material" v-model="isActive" onColor="#91457a" thumbColor="#3f2537" /></th>
          <th v-for="(value, key) in columns" :key="key" @click="sortBy(key)">
            {{ value }}
            <span class="arrow" :class="addClass(key)"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="skill in sortSkills" :key="skill.sid">
          <td>
            <font-awesome-icon icon="heart" v-if="isFollowed(skill.sid)" @click="unfollow(skill.sid)" style="color:#91457a;" />
            <font-awesome-icon :icon="['far', 'heart']" v-else @click="follow(skill.sid)" />
          </td>
          <td v-for="(value, key) in columns" :key="key">
            {{ skill[key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data: function () {
    const columns = {
      name: 'name',
      event: 'event',
      difficulty: 'difficulty',
      value: 'value',
      group: 'group'
    }
    return {
      allSkills: [], // 全ての技データ
      skills: [], // フィルターやソートした後の技データ（登録した技フィルターも含む）
      currentUserId: "",
      myList: [], // 登録した技のsidのみのリスト
      skillCount: "",
      allMySkills: [], // 全ての登録した技データ
      eventQuery: ['ゆか', 'あん馬', 'つり輪', '跳馬', '平行棒', '鉄棒'],
      difficultyQuery: ['A','B','C','D','E','F','G','H'],
      groupQuery: ['I','II','III','IV','V'],
      isActive: false,
      searchWordOnMove: false,
      searchWord: "",
      columns: columns,
      sortKey: "",
      sort_asc: true,
      active01: true,
      active02: true,
      active03: true,
      active04: true,
      active05: true,
      active06: true,
      active07: true,
      active08: true,
      active09: true,
      active10: true,
      active11: true,
      active12: true,
      active13: true,
      active14: true,
      active15: true,
      active16: true,
      active17: true,
      active18: true,
      active19: true,
      active20: true,
      active21: true,
      active22: true,
    }
  },
  created() {
    // 全ての技データをまず持ってくる
    this.fetchAllSkills()

    // ログインしているユーザーのuidを持ってくる
    this.fetchCurrentUserData()

    // 登録済みの技データを持ってくる
    if (this.currentUserId) {
      this.fetchMyList(this.currentUserId)
    }

    // デフォルトでeventでソートしておく
    this.sortBy("event")
  },
  methods: {
    fetchAllSkills() {
      let self = this
      firebase.firestore().collection("skills").get().then(function(querySnapshot) {
        let data = []
        querySnapshot.forEach(function(doc) {
          data.push(doc.data())
        })
        self.skills = self.allSkills = data
      })
    },
    fetchCurrentUserData() {
      this.currentUserId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : ""
    },
    fetchMyList(uid) {
      let self = this
      firebase.firestore().collection("users").doc(uid).onSnapshot(function(doc) {
        self.myList = doc.data().mySkills
        self.skillCount = doc.data().skillCount

        if (self.myList) {
          firebase.firestore().collection("skills").where("sid","in",self.myList).get().then(function(querySnapshot) {
            let data = []
            querySnapshot.forEach(function(doc) {
              data.push(doc.data())
            })
            self.allMySkills = data

            // URLでmySkill=trueの時
            if (self.$route.params.mySkills == true) {
              self.isActive = !self.isActive
              self.skills = data
            }
          })
        }
      })
    },
    // フィルターしたい時
    addEventQuery(query) {
      try {
        // クエリが０にならないときのみ以下を実行
        if (this.eventQuery.length != 1 || !this.eventQuery.includes(query)) {
          if (this.eventQuery.includes(query)) {
            this.eventQuery = this.eventQuery.filter(item => item != query)
          } else {
            this.eventQuery.push(query)
          }

          if (query == 'ゆか') {
            this.active01 = !this.active01
          } else if (query == 'あん馬') {
            this.active02 = !this.active02
          } else if (query == 'つり輪') {
            this.active03 = !this.active03
          } else if (query == '跳馬') {
            this.active04 = !this.active04
          } else if (query == '平行棒') {
            this.active05 = !this.active05
          } else if (query == '鉄棒') {
            this.active06 = !this.active06
          } else {
            this.active01 = this.active02 = this.active03 = this.active04 = this.active05 = this.active06 = this.active07 = true
            this.eventQuery = ['ゆか', 'あん馬', 'つり輪', '跳馬', '平行棒', '鉄棒']
          }
          this.active07 = this.eventQuery.length == 6 ? true : false

          this.filterSkills(this.eventQuery,this.difficultyQuery,this.groupQuery)
        }
      } catch (e) {
        console.error(e)
      }
    },
    addDifficultyQuery(query) {
      try {
        // クエリが０にならないときのみ以下を実行
        if (this.difficultyQuery.length != 1 || !this.difficultyQuery.includes(query)) {
          if (this.difficultyQuery.includes(query)) {
            this.difficultyQuery = this.difficultyQuery.filter(item => item != query)
          } else {
            this.difficultyQuery.push(query)
          }

          if (query == 'A') {
            this.active08 = !this.active08
          } else if (query == 'B') {
            this.active09 = !this.active09
          } else if (query == 'C') {
            this.active10 = !this.active10
          } else if (query == 'D') {
            this.active11 = !this.active11
          } else if (query == 'E') {
            this.active12 = !this.active12
          } else if (query == 'F') {
            this.active13 = !this.active13
          } else if (query == 'G') {
            this.active14 = !this.active14
          } else if (query == 'H') {
            this.active15 = !this.active15
          } else {
            this.active08 = this.active09 = this.active10 = this.active11 = this.active12 = this.active13 = this.active14 = this.active15 = this.active16 = true
            this.difficultyQuery = ['A','B','C','D','E','F','G','H']
          }
          this.active16 = this.difficultyQuery.length == 8 ? true : false

          this.filterSkills(this.eventQuery,this.difficultyQuery,this.groupQuery)
        }
      } catch (e) {
        console.error(e)
      }
    },
    addGroupQuery(query) {
      try {
        // クエリが０にならないときのみ以下を実行
        if (this.groupQuery.length != 1 || !this.groupQuery.includes(query)) {
          if (this.groupQuery.includes(query)) {
            this.groupQuery = this.groupQuery.filter(item => item != query)
          } else {
            this.groupQuery.push(query)
          }

          if (query == 'I') {
            this.active17 = !this.active17
          } else if (query == 'II') {
            this.active18 = !this.active18
          } else if (query == 'III') {
            this.active19 = !this.active19
          } else if (query == 'IV') {
            this.active20 = !this.active20
          } else if (query == 'V') {
            this.active21 = !this.active21
          } else {
            this.active17 = this.active18 = this.active19 = this.active20 = this.active21 = this.active22 = true
            this.groupQuery = ['I','II','III','IV','V']
          }
          this.active22 = this.groupQuery.length == 5 ? true : false

          this.filterSkills(this.eventQuery,this.difficultyQuery,this.groupQuery)
        }
      } catch (e) {
        console.error(e)
      }
    },
    filterSkills(eventQuery,difficultyQuery,groupQuery) {
      let skills = []
      const data = this.isActive ? this.allMySkills : this.allSkills
      data.forEach(function(doc) {
        if (doc.event != '跳馬') {
          if (eventQuery.includes(doc.event) && difficultyQuery.includes(doc.difficulty) && groupQuery.includes(doc.group)) {
            skills.push(doc)
          }
        } else {
          if (eventQuery.includes(doc.event) && groupQuery.includes(doc.group)) {
            skills.push(doc)
          }
        }
      })
      this.skills = skills
    },
    // ソートしたい時
    sortBy(key) {
      this.sortKey === key ? (this.sort_asc = !this.sort_asc) : (this.sort_asc = true)
      this.sortKey = key
    },
    addClass(key) {
      return {
        asc: this.sortKey === key && this.sort_asc,
        desc: this.sortKey === key && !this.sort_asc,
      };
    },
    // キーワード検索で動きをつけるために必要なもの
    typeSearchWord(){
      this.searchWordOnMove = true;
    },
    // 新たに技を登録したい時
    isFollowed(sid) {
      return this.myList.indexOf(sid) >= 0 ? true : false;
    },
    follow(sid) {
      console.log('Adding' + sid + ' to your mySkills')
      const currentUserDoc = firebase.firestore().collection('users').doc(this.currentUserId);
      currentUserDoc.update({
        mySkills: firebase.firestore.FieldValue.arrayUnion(sid),
        skillCount: this.skillCount + 1
      });
    },
    unfollow(sid) {
      console.log('Removing' + sid + ' from your mySkills')
      const currentUserDoc = firebase.firestore().collection('users').doc(this.currentUserId);
      currentUserDoc.update({
        mySkills: firebase.firestore.FieldValue.arrayRemove(sid),
        skillCount: this.skillCount - 1
      });
    },
  },
  computed: {
    sortSkills: function () {
      let skills = this.skills;

      // 登録した技
      if (this.isActive) {
        skills = this.skills.filter(skill => this.myList.includes(skill.sid))
      }

      // 並べ替え
      const sortKey = this.sortKey
      const order = this.sort_asc ? 1 : -1
      if (sortKey) {
        skills = skills.slice().sort(function(a, b){
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }

      // キーワード検索
      const filterWord = this.searchWord && this.searchWord.toLowerCase()
      if(filterWord) {
        skills = skills.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterWord) > -1
          })
        })
      }
      
      return skills;
    },
  },
}
</script>

<style lang="scss" scoped>
.skills {
  padding-top: 70px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  a {
    color: white;
    text-decoration: none;
  }
}
.btns {
  background: #111015;
  color: #8899A6;
  font-weight: bold;
  width: 100vw;
  height: 50px;
  display: flex;
  // position: fixed;
  .btn {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .active {
    background: #613955;
    color: white;
  }
  .btn:hover {
    background: #3f2537;
    color: white;
  }
}
.field {
  width: 80vw;
  margin: 50px 0;
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
table {
  margin-bottom: 50px;
  width: 90vw;
  border-collapse: collapse;
  text-align: center;
  th {
    color: grey;
    font-weight: normal;
    &:nth-of-type(1) {
      padding-right: 22px;
    }
    &:nth-of-type(2) {
      text-align: left;
    }
  }
  td {
    border: solid thin grey;
    border-width: 1px 0px;
    padding: 7px 0;
    &:nth-of-type(1) {
      width: 100px;
    }
    &:nth-of-type(2) {
      text-align: left;
    }
    &:nth-of-type(n+3) {
      width: 100px;
    }
  }
}
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}
.asc {
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid #961371;
}
.desc {
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid #961371;
}
</style>
