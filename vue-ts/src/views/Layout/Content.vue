<template>
  <el-container class="layout-content">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <slot name="left"></slot>
    </el-aside>

    <!-- 右侧页面 -->
    <el-main>
      <!-- 面包屑 -->
      <div class="top">
        <i class="fa fa-reorder"></i>
        <el-breadcrumb class="breadcrumb" separator="/">
          <el-breadcrumb-item
            v-for="(item,index) in breadCrumbItems"
            :key="index"
            :to="{path:item.path}"
          >{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 页面内容 -->
      <div class="content">
        <slot name="content"></slot>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Content extends Vue {
  @Provide() breadCrumbItems: any; // 面包屑数组

  // 监听路由变化来更新面包屑
  @Watch("$route") handleRouteChange(to: any) {
    this.initBreadCrumbItems(to);
  }

  created() {
    this.initBreadCrumbItems(this.$route);
  }

  initBreadCrumbItems(router: any) {
    // 根路由title
    let breadCrumbItems: any = [{ path: "/", title: "免费看批系统" }];
    let matched = router.matched;
    // 遍历父级到当前子路由所有页面的title和path并储存到数组中
    for (const index in matched) {
      if (matched[index].meta && matched[index].meta.title) {
        breadCrumbItems.push({
          path: matched[index].path ? matched[index].path : "/",
          title: matched[index].meta.title
        });
      }
    }

    this.breadCrumbItems = breadCrumbItems;
  }
}
</script>

<style lang="scss" scoped>
.layout-content {
  width: 100%;
  height: 100%;
  .el-main {
    padding: 0;
    overflow: hidden;
    .top {
      background: #fff;
      height: 54px;
      border-right: none;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      i {
        font-size: 20px;
        cursor: pointer;
        padding-left: 16px;
      }
      .breadcrumb {
        padding-left: 16px;
      }
    }
    .content {
      // padding: 10px;
      height: calc(100% - 54px);
      box-sizing: border-box;
    }
  }
}
</style>