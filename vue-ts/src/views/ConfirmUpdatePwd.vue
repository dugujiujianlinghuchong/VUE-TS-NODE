<template>
  <div class="container">
    <el-button :loading="isSubmit" @click.native.prevent="confirmUpdate">确认修改密码</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
@Component({
  components: {}
})
export default class ConfirmUpdatePwd extends Vue {
  @Provide() isSubmit: boolean = false;

  // 确认修改密码
  confirmUpdate(): void {
    this.isSubmit = true;
    (this as any).$axios
      .get("/api/users/confirmupdatepwd", {
        params: { id: window.location.search.split("=")[1] }
      })
      .then((res: any) => {
        if (res.data.success) {
          this.$message({
            message: "确认修改密码成功，稍后将跳转至登陆页面",
            type: "success"
          });
          // 跳转到登录页
          setTimeout(() => {
            this.$router.push("/login");
          }, 3000);
        } else {
          this.$message.error(res.data.msg);
        }
      })
      .catch(() => (this.isSubmit = false));
  }
}
</script>

<style lang="scss" scoped>
.container {
  text-align: center;
  padding-top: 20%;
}
</style>
