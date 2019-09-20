<template>
  <div class="login">
    <login-header>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-positon="left"
        label-width="0"
        slot="container"
      >
        <div class="title">
          <h3>用户登录</h3>
        </div>
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="邮箱">
            <i slot="prefix" class="fa fa-envelope-o"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            auto-complete="off"
            placeholder="密码"
          >
            <i slot="prefix" class="fa fa-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            @click.native.prevent="handleSubmit"
            :loading="isLogin"
            type="primary"
            style="width:100%"
          >登录</el-button>
        </el-form-item>
        <!-- 7天自动登录&忘记密码 -->
        <el-form-item>
          <el-checkbox
            type="primary"
            v-model="ruleForm.autoLogin"
            :checked="ruleForm.autoLogin"
          >7天内自动登录</el-checkbox>
          <el-button @click="$router.push('/register')" type="text" class="forget">注册账号</el-button>
          <el-button @click="$router.push('/password')" type="text" class="forget">忘记密码</el-button>
        </el-form-item>
      </el-form>
    </login-header>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
import LoginHeader from "./LoginHeader.vue";

@Component({
  components: {
    LoginHeader
  }
})
export default class Login extends Vue {
  // 存储用户信息
  @Action("setUser") setUser: any;

  @Provide() isLogin: boolean = false;

  @Provide() ruleForm: {
    email: String;
    password: String;
    autoLogin: Boolean;
  } = {
    email: "",
    password: "",
    autoLogin: false
  };

  @Provide() rules = {
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"]
      }
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }]
  };

  // 登录
  handleSubmit(): void {
    (this.$refs.ruleForm as any).validate((valid: boolean) => {
      if (valid) {
        this.isLogin = true;
        (this as any).$axios
          .post("/api/users/login", this.ruleForm)
          .then((res: any) => {
            if (res.data.success) {
              // 存储token
              localStorage.setItem("tsToken", res.data.token);
              // 存储到vuex
              this.setUser(res.data.token);
              // 跳转到首页
              this.$router.push("/");
            } else {
              this.$message.error(res.data.msg);
            }
            this.isLogin = false;
          })
          .catch(() => (this.isLogin = false));
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

i {
  font-size: 14px;
  margin-left: 8px;
}

.forget {
  float: right;
  margin-right: 20px;
}
</style>
