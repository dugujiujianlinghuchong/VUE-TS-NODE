<template>
  <div class="login-page">
    <div class="page-center">
      <div class="info">
        <div class="title">
          <img src="@/assets/logo2.png" />
          <span>看批网</span>
        </div>
        <div class="detail">
          <span>一个用vue+typescript搭建的看批网站</span>
        </div>
      </div>
      <!-- 插槽 -->
      <div class="container">
        <slot name="container"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class LayoutHeader extends Vue {}
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/login-back.svg);
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  .page-center {
    position: absolute;
    width: 400px;
    height: 540px;
    margin: auto;
    top: 60px;
    right: 0;
    left: 0;
    .info {
      text-align: center;
      height: 150px;
      .title {
        display: flex;
        justify-content: center;
        align-items: Center;
        font-size: 32px;
        color: rgba(0, 0, 0, 0.85);
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        img {
          width: 200px;
          padding-bottom: 3px;
          border-radius: 20px;
          margin-right: 10px;
        }
      }
      .detail {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 40px;
        line-height: 1.5;
        span {
          color: rgba(0, 0, 0, 0.75);
        }
      }
    }
    .container {
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;
    }
  }
}
</style>
