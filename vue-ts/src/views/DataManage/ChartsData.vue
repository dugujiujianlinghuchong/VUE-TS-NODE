<template>
  <div class="home">
    <div class="upload">
      <!-- 图片批量上传 -->
      <form
        :action="`/api/profiles?id=${getUser.id}`"
        method="post"
        enctype="multipart/form-data"
        target="stop"
      >
        <input class="choose-file" @change="previewImg" type="file" name="images" multiple />
        <input class="confirm-upload" type="submit" value="上传图片" />
      </form>
      <iframe @load="uploaded" name="stop" style="display:none"></iframe>
    </div>

    <img
      style="width:100px;height:100px;"
      v-for="(bolb, index) in imageList"
      :key="index"
      :src="bolb"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";

@Component({
  components: {}
})
export default class ChartsData extends Vue {
  // 存储用户信息
  @Action("setUser") setUser: any;

  @Getter("user") getUser: any;

  @Provide() imageList: any = [];

  previewImg(event: any) {
    let reader: object;
    let files = Array.from(event.target.files);
    console.log(files, "文件列表");
    this.imageList = []; // 重置图片
    //判断是否支持FileReader
    if (window.FileReader) {
      reader = new FileReader();
    } else {
      alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
      return;
    }

    // 生成器控制文件流同步读取
    function* readFile(files: any) {
      for (const file of files) {
        (reader as any).readAsDataURL(file);
        console.log("读完一张");
        yield "done";
      }
    }

    let iterator = readFile(files);
    iterator.next();
    (reader as any).onload = (e: any) => {
      this.imageList.push(e.target.result);
      iterator.next();
    };
  }

  uploaded(e: any) {
    let token = "";
    let iframe = (document as any).querySelector("iframe").contentDocument;
    if (iframe.querySelector("pre")) {
      token = JSON.parse(iframe.querySelector("pre").innerText).token;
      this.$message({
        message: "图片上传成功",
        type: "success"
      });
    }
    if (token) {
      // 存储token
      localStorage.setItem("tsToken", token);
    }
  }
}
</script>

<style>
</style>
