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
          <h3>用户注册</h3>
        </div>
        <!-- 防止表单自动填充 -->
        <div class="hiddenInput">
          <input type="password" name="hidden1" />
          <input type="password" name="hidden2" />
        </div>
        <!-- 账号 -->
        <el-form-item prop="name">
          <el-input type="text" v-model="ruleForm.name" auto-complete="off" placeholder="用户名">
            <i slot="prefix" class="fa fa-user-o"></i>
          </el-input>
        </el-form-item>
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
        <!-- 确认密码 -->
        <el-form-item prop="password2">
          <el-input
            type="password"
            v-model="ruleForm.password2"
            auto-complete="off"
            placeholder="确认密码"
          >
            <i slot="prefix" class="fa fa-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
            @click.native.prevent="handleSubmit"
            :loading="isLoading"
            type="primary"
            style="width:100%"
          >注册</el-button>
        </el-form-item>
        <el-form-item class="return">
          <el-button @click="$router.push('/login')" type="text">返回登录页</el-button>
        </el-form-item>
      </el-form>
    </login-header>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import LoginHeader from "./LoginHeader.vue";

@Component({
  components: {
    LoginHeader
  }
})
export default class Register extends Vue {
  @Provide() isLoading: boolean = false; // 是否正在注册
  // 定义注册字段
  @Provide() ruleForm: {
    name: String;
    email: String;
    password: String;
    password2: String;
  } = {
    name: "",
    email: "",
    password: "",
    password2: ""
  };
  // 定义注册验证规则
  @Provide() rules = {
    name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"]
      }
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    password2: [{ required: true, message: "请输入确认密码", trigger: "blur" }]
  };

  // 注册
  handleSubmit(): void {
    (this.$refs.ruleForm as any).validate((valid: boolean) => {
      if (valid) {
        // 判断两次密码输入是否一致
        if (this.ruleForm.password !== this.ruleForm.password2) {
          this.$message.error("两次密码输入不一致");
          return;
        }
        this.isLoading = true;
        (this as any).$axios
          .post("/api/users/register", this.ruleForm)
          .then((res: any) => {
            if (res.data.success) {
              this.$message({
                message: "账号注册成功，稍后将跳转至登陆页面",
                type: "success"
              });
              // 跳转到登录页
              setTimeout(() => {
                this.$router.push("/login");
              }, 3000);
            } else {
              this.$message.error(res.data.msg);
              this.isLoading = false;
            }
          })
          .catch(() => (this.isLoading = false));
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
}

.hiddenInput {
  position: absolute;
  z-index: -100000000;
  padding-top: 1px;
  padding-left: 2px;
  input {
    width: 10px;
  }
}

.return {
  text-align: center;
}
</style>