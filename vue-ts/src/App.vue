<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";

@Component({
  components: {}
})
export default class App extends Vue {
  // Vuex存取
  @Action("setUser") setUser: any;

  created() {
    this.setUser(localStorage.tsToken);
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  background-image: url(./assets/login_bg.jpg);
  background-size: cover;
  // opacity: 0.7;
}
</style>
