<template>
  <div class="user-info">
    <div class="img-box">
      <h2 class="title">About me</h2>
      <img id="usericon" :src="imageUrl" alt="无法加载头像" />
      <!-- <h4>{{getUser.name}}</h4> -->
      <div class="upload">
        <!-- 头像上传 -->
        <form
          :action="`/api/upload/uploadusericon?id=${getUser.id}&date=${Date.now()}`"
          method="post"
          enctype="multipart/form-data"
          target="stop"
        >
          <input class="choose-file" @change="previewImg" type="file" name="avatar" />
          <input
            class="confirm-upload"
            type="submit"
            value="上传头像"
            :disabled="uploadDisabled"
            :class="{'disabled': uploadDisabled}"
          />
        </form>
        <iframe @load="uploaded" name="stop" style="display:none"></iframe>
      </div>
    </div>
    <div class="info-box">
      <h2 class="title">Account</h2>
      <el-form :model="userData" class="form-box">
        <el-form-item label="用户名">
          <el-input v-model="userData.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userData.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="onSubmit"
            :disabled="!userData.password"
            :loading="loading"
            type="primary"
          >修改密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
import EventBus from "../../utils/bus";

@Component({
  components: {}
})
export default class UserInfo extends Vue {
  // Vuex存取
  @Action("setUser") setUser: any;
  @Getter("user") getUser: any;

  @Provide() userData: { id: string; name: string; password: string } = {
    id: "",
    name: "",
    password: ""
  };
  @Provide() imageUrl: string = ""; // 图片路径
  @Provide() loading: boolean = false; // 是否发起网络请求
  @Provide() uploadDisabled: boolean = true; // 上传按钮禁用状态

  // 头像上传成功后的操作
  uploaded(e: any) {
    let iframe = (document as any).querySelector("iframe").contentDocument;
    if (iframe.querySelector("pre")) {
      this.$message({
        message: "头像修改成功",
        type: "success"
      });
      EventBus.$emit("changed", true);

      // 按钮恢复禁用
      this.uploadDisabled = true;
    }
  }

  // 提交用户信息修改
  onSubmit() {
    this.userData.id = this.getUser.id;
    this.loading = true;

    // 发起请求
    (this as any).$axios
      .post("/api/users/update", this.userData)
      .then((res: any) => {
        this.loading = false;
        this.$message({
          message: "账号修改成功",
          type: "success"
        });
        // 存储token
        localStorage.setItem("tsToken", res.data.token);
        // 存储到vuex
        this.setUser(res.data.token);
      })
      .catch(() => {
        this.loading = false;
      });
  }

  // 图片预览
  previewImg(event: any) {
    let reader;
    let file = event.target.files[0];
    if (!file.type.includes("image")) {
      this.$message.error("请选择图片文件");
      return;
    }
    //判断是否支持FileReader
    if (window.FileReader) {
      reader = new FileReader();
    } else {
      alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
      return;
    }
    // let setSrc = function(e: any) {
    //   this.imageUrl = e.target.result;
    // };
    // reader.onload = setSrc.bind(this);
    // 使用箭头函数固定this指向
    reader.onload = (e: any) => {
      (this as any).imageUrl = e.target.result;
    };
    // 读文件
    reader.readAsDataURL(file);

    // 按钮解除禁用
    this.uploadDisabled = false;
  }

  created() {
    this.userData.name = this.getUser.name;
    this.imageUrl = `${(this as any).staticSrc}/usericon/${
      this.getUser.avatar
    }`;
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  height: calc(100% - 70px);
  display: flex;
  overflow: auto;
  color: #606266;
  .img-box,
  .info-box {
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    background: #fff;
    .title {
      border-bottom: 1px solid #dcdfe6;
      padding: 10px;
      text-align: left;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .img-box {
    text-align: center;
    width: 30%;
    margin-right: 10px;
    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
    h4 {
      margin-top: 20px;
      font-size: 16px;
    }
  }
  .info-box {
    flex: 1;
    .form-box {
      padding: 10px;
    }
  }
}

.choose-file {
  display: block;
  margin: 0 auto;
  width: 120px;
  height: 120px;
  cursor: pointer;
  position: relative;
  z-index: 10000;
  border-radius: 50%;
  margin-top: -122px;
  opacity: 0;
}
.confirm-upload {
  display: block;
  border: none;
  color: #fff;
  border-radius: 5px;
  margin: 0 auto;
  width: 100px;
  height: 25px;
  margin-top: 10px;
  background: #409eff;
  cursor: pointer;
}
.disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
</style>
