<template>
  <div class="home">
    <div class="front"><h1>Gymulation</h1></div>
    <!-- <img alt="background image" src="../assets/gymnast.jpg" /> -->
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue"

export default {
  // name: "Home",
  // components: {
  //   HelloWorld,
  // },
}
</script>

<style lang="scss" scoped>
.home {
  padding-top: 70px;
}
.front {
  // height: 100vh;
  height: calc(100vh - 70px);
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/gymnast.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: rgba(0,0,0, 0.4);
  background-blend-mode: darken;
  -webkit-animation: zoom 5s forwards;
  animation: zoom 5s forwards;
  @keyframes zoom {
    0%{
      opacity: 0;
      transform: scale(1.05);
    }
    100%{
      opacity: 1;
      transform: scale(1);
    }
  }
  h1 {
    font-size: 50px;
    animation: fadeIn 3.5s ease-out 1.5s forwards;
    opacity: 0;
    @keyframes fadeIn{
      0%{
        opacity: 0;
      }
      100%{
        opacity: 1;
      }
    }
  }
}

</style>