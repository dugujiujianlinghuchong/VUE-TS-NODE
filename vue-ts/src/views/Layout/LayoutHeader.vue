<template>
  <div class="layout-header">
    <el-row>
      <el-col :xs="10" :sm="12" :md="14" :lg="16" :xl="18">
        <div class="system-info">
          <img class="logo" src="@/assets/rp.png" />
          <span class="title">看批网</span>
        </div>
      </el-col>
      <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
        <el-dropdown @command="userCommand" class="system-user">
          <span class="userinfo-inner">
            <img :src="`${staticSrc}/usericon/${getUser.avatar}`" />
            {{ getUser.name }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="usercenter">
              <i class="el-icon-user">&nbsp;个人中心</i>
            </el-dropdown-item>
            <el-dropdown-item command="collection">
              <i class="el-icon-folder-opened">&nbsp;收藏夹</i>
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <i class="el-icon-switch-button">&nbsp;退出登录</i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
import EventBus from "../../utils/bus";

@Component({
  components: {}
})
export default class LayoutHeader extends Vue {
  @Getter("user") getUser: any;

  userCommand(command: string) {
    // 退出
    if (command === "logout") {
      localStorage.removeItem("tsToken");
      this.$router.replace("/login");
    }

    // 前往个人中心
    if (command === "usercenter") {
      this.$router.push("/user");
    }

    // 前往收藏夹
    if (command === "collection") {
      alert("还没有收藏夹");
      // this.$router.push("/user");
    }
  }

  created() {
    console.log(this.getUser);
    // 监听图片上传
    // EventBus.$on("changed", (val: any) => {
    //   this.getUser;
    // });
  }
}
</script>

<style lang="scss" scoped>
.layout-header {
  background: #495060;
  line-height: 64px;
  height: 64px;
}

.system-info {
  text-align: left;
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 50px;
    margin-top: 12px;
    margin-left: 20px;
    margin-right: 10px;
    float: left;
    position: relative;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    color: azure;
    line-height: 64px;
  }
}
.system-user {
  text-align: right;
  float: right;
  padding-right: 16px;
  .userinfo-inner {
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin: 10px 0px 10px 10px;
      float: right;
    }
  }
}
</style>
