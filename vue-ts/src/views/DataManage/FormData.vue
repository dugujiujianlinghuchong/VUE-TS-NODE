<template>
  <div class="container" @scroll="inViewShow">
    <div
      class="lazy-image"
      v-for="(imgID, index) in imageList"
      :key="index"
      :presrc="`${staticSrc}/share/${imgID}`"
      @click="viewDetail(`${staticSrc}/share/${imgID}`)"
    >
      <div class="hover">
        <i
          :class="{'el-icon-star-off':!isCollected, 'el-icon-star-on':isCollected}"
          @click="collect"
        ></i>
        <i class="el-icon-share"></i>
        <i class="el-icon-chat-dot-round"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";

@Component({
  components: {}
})
export default class FormData extends Vue {
  // 存储用户信息
  @Action("setUser") setUser: any;

  @Getter("user") getUser: any;

  @Provide() imageList: any = [];
  @Provide() imageElements: any = [];
  @Provide() isCollected: boolean = false;

  // 懒加载
  inViewShow() {
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
          setTimeout(() => {
            element.style.background = `url('${element.getAttribute(
              "presrc"
            )}')`;
            element.style.backgroundSize = "cover";
          }, 1500);
          this.imageElements.splice(i, 1);
        }
      }
    }
  }

  // 收藏图片
  collect(e: any) {
    // 阻止冒泡
    e = e || window.event;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }

    this.isCollected = !this.isCollected;
    console.log("收藏");
  }

  // 看大图
  viewDetail(href: string) {
    const a = document.createElement("a"); // 创建a标签
    a.setAttribute("target", "blank"); // 新窗口打开
    a.setAttribute("href", href); // href链接
    a.click(); // 自执行点击事件
  }

  getImageList() {
    (this as any).$axios
      .get("/api/images/getimages")
      .then((res: any) => {
        console.log(res.data);
        this.imageList = res.data.map((item: any) => item.imgID);
        // 获取图片dom数组
        this.$nextTick(() => {
          this.imageElements = Array.prototype.slice.call(
            document.querySelectorAll(".lazy-image")
          );

          // 前6张直接展示
          let firstSaw = this.imageElements.splice(0, 6);
          for (let i = 0; i < firstSaw.length; i++) {
            let element = firstSaw[i];

            setTimeout(() => {
              element.style.background = `url('${element.getAttribute(
                "presrc"
              )}')`;
              element.style.backgroundSize = "cover";
            }, 2000);
          }
        });
      })
      .catch(() => {});
  }

  created() {
    this.getImageList();
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 87vh;
  background: pink;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.lazy-image {
  width: 32%;
  height: 60vh;
  // margin-left: 15px;
  margin-top: 10px;
  border: 1px solid green;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  cursor: url("../../assets/jier8.png"), auto;
  flex-direction: column;
  justify-content: flex-end;
  background: url(../../assets/loading.gif);
  background-size: 10%;
  background-repeat: no-repeat;
  background-position: center;
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
  &:hover {
    .hover {
      opacity: 0.4;
    }
  }
}
</style>
