<template>
  <div class="home">
    <div class="home-body">
      <h4 class="title">欢迎来到免费看批网</h4>
      <p class="des">免费看批网，让每个人都有机会看批</p>
      <el-button @click="learn">开始看批</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Home extends Vue {
  learn(): void {
    // 新窗口打开
    window.open("https://www.menworld.org/fanhao/19110.html");
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  // background: url(../assets/bg.jpg) no-repeat;
  background: url(../assets/loading.gif) no-repeat;
  background-size: cover;
  .home-body {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    text-align: center;
    padding: 200px 100px;
    box-sizing: border-box;
    .title {
      font-size: 32px;
      font-weight: bold;
      line-height: 60px;
    }
    .des {
      font-size: 18px;
      margin: 40px 0;
    }
  }
}
</style>
