<template>
  <div class="container" @scroll="inViewShow">
    <div
      class="lazy-image"
      v-for="(item, index) in imageList"
      :key="index"
      :presrc="`${staticSrc}/share/${item.imgID}`"
      @click="viewDetail(`${staticSrc}/share/${item.imgID}`)"
    >
      <!-- 图片信息 -->
      <div class="hover2" @click="stopPropagation">
        <p>{{ formatDate(item.uploadTime) }}</p>
        <div>
          <span style="line-heigth:40px;">{{item.user.name}}</span>
          <img
            @click="toUploaderPage(item.user._id)"
            :src="`${staticSrc}/usericon/${item.user._id}.jpg`"
          />
        </div>
      </div>
      <!-- 收藏分享 -->
      <div class="hover" @click="stopPropagation">
        <i
          :class="[item.collected ? 'el-icon-star-on' : 'el-icon-star-off']"
          @click="collect(item.imgID, $event)"
        ></i>
        <i class="el-icon-share"></i>
        <i class="el-icon-chat-dot-round"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";

@Component({
  components: {}
})
export default class FormData extends Vue {
  @Action("setUser") setUser: any;
  @Getter("user") getUser: any;

  @Provide() imageList: any = [];
  @Provide() imageElements: any = [];
  @Provide() isCollected: boolean = false;
  @Provide() canRun: boolean = true; // 节流标志变量

  @Prop(String) readonly listType: string | undefined;

  // 懒加载图片
  inViewShow() {
    // 节流实现
    if (!this.canRun) {
      return;
    }
    this.canRun = false;

    setTimeout(() => {
      if (this.imageElements.length) {
        let len = this.imageElements.length;
        for (let i = 0; i < len; i++) {
          let element = this.imageElements[i];
          let top = document.documentElement.clientHeight;

          if (element) {
            top = element.getBoundingClientRect().top;
          }

          // 当图片出现在可视区域时开始加载图片
          if (top < document.documentElement.clientHeight) {
            this.setImage(element);
            this.imageElements.splice(i, 1);
          }
        }
      }

      this.canRun = true;
    }, 1100);

    // 普通实现
    // console.log(1111);
    // if (this.imageElements.length) {
    //   let len = this.imageElements.length;
    //   for (let i = 0; i < len; i++) {
    //     let element = this.imageElements[i];
    //     let top = document.documentElement.clientHeight;

    //     if (element) {
    //       top = element.getBoundingClientRect().top;
    //     }

    //     // 当图片出现在可视区域时开始加载图片
    //     if (top < document.documentElement.clientHeight) {
    //       setTimeout(() => {
    //         element.style.background = `url('${element.getAttribute(
    //           "presrc"
    //         )}')`;
    //         element.style.backgroundSize = "cover";
    //       }, 1500);
    //       this.imageElements.splice(i, 1);
    //     }
    //   }
    // }
  }

  // 替换要加载的图片
  setImage(element: any) {
    element.style.background = `url('${element.getAttribute("presrc")}')`;
    element.style.backgroundSize = "auto 100%";
    element.style.backgroundRepeat = "no-repeat";
    element.style.backgroundPosition = "center";
    element.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
  }

  // 阻止冒泡
  stopPropagation(e: any) {
    e = e || window.event;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  // 收藏图片
  collect(imgID: string, e: any) {
    (this as any).$axios
      .get("/api/images/collectimage", {
        params: { imgID, userID: this.getUser.id }
      })
      .then((res: any) => {
        if (res.data.collectStatus) {
          e.target.setAttribute("class", "el-icon-star-on");
          this.$message({
            message: res.data.msg,
            type: "success"
          });
        } else {
          e.target.setAttribute("class", "el-icon-star-off");
          this.$message(res.data.msg);
        }
      })
      .catch(() => {});
    // console.log(e.target.getAttribute("class"), "触发目标");
    // let className = e.target.getAttribute("class");
    // if (className === "el-icon-star-off") {
    //   // 收藏
    //   e.target.setAttribute("class", "el-icon-star-on");
    // } else {
    //   // 取消收藏
    //   e.target.setAttribute("class", "el-icon-star-off");
    // }

    // // this.isCollected = !this.isCollected;
    // console.log("收藏:", imgID);
    // (this as any).tellCollect(imgID);
  }

  // 看大图
  viewDetail(href: string) {
    const a = document.createElement("a"); // 创建a标签
    a.setAttribute("target", "blank"); // 新窗口打开
    a.setAttribute("href", href); // href链接
    a.click(); // 自执行点击事件
  }

  // 获取图片列表
  getImageList() {
    (this as any).$axios
      .get("/api/images/getimages", {
        params: { id: this.getUser.id, listType: this.listType }
      })
      .then((res: any) => {
        console.log(res.data);
        this.imageList = res.data;
        // 获取图片dom数组
        this.$nextTick(() => {
          this.imageElements = Array.prototype.slice.call(
            document.querySelectorAll(".lazy-image")
          );

          // 前1张直接展示
          let firstSaw = this.imageElements.splice(0, 1);
          for (let i = 0; i < firstSaw.length; i++) {
            let element = firstSaw[i];

            setTimeout(() => {
              this.setImage(element);
            }, 1000);
          }
        });
      })
      .catch(() => {});
  }

  // 前往上传者页面
  toUploaderPage(id: string) {
    console.log(id, "上传者id");
    // this.$router.push("/uploader");
  }

  mounted() {
    // 键盘上下滚屏
    window.addEventListener("keydown", function(key) {
      if (key.code === "ArrowDown") {
        window.scrollTo(0, document.body.scrollHeight);
      } else if (key.code === "ArrowUp") {
        window.scrollTo(0, 0);
      } else {
        return;
      }
    });
  }

  created() {
    this.getImageList();
  }
}
</script>

<style lang="scss" scoped>
.el-icon-star-on {
  color: red;
}
.container {
  height: 87vh;
  background: black;
  opacity: 0.8;
  overflow: auto;
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-around;
}
.lazy-image {
  // width: 30%;
  // height: 60vh;
  width: 500px;
  height: 750px;
  margin: 0 auto;
  // margin-left: 15px;
  margin-top: 10px;
  border: 1px solid black;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  cursor: url("../assets/jier9.png"), auto;
  flex-direction: column;
  justify-content: space-between;
  background: url(../assets/loading.gif);
  background-size: 10%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.4);
  .hover {
    width: 100%;
    height: 40px;
    background: black;
    opacity: 0;
    transition: 0.5s ease;
    text-align: right;
    cursor: auto;
    i {
      color: white;
      font-size: 30px;
      line-height: 40px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .hover2 {
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    background: rgba(0, 0, 0, 0);
    // background: black;
    // opacity: 0;
    transition: 0.5s ease;
    text-align: center;
    cursor: auto;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    align-items: center;
    p {
      color: rgba(255, 255, 255, 0);
    }
    div {
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        color: rgba(255, 255, 255, 0);
        font-size: 18px;
        margin-right: 10px;
      }
      img {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
  &:hover {
    .hover {
      opacity: 0.4;
    }
    .hover2 {
      background: rgba(0, 0, 0, 0.4);
      p {
        color: rgba(255, 255, 255, 0.7);
      }
      div span {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style>
