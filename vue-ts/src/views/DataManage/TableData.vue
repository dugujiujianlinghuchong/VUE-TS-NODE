<template>
  <div class="table-data">
    <div class="search-box">
      <el-input size="small" v-model="searchVal" placeholder="请输入课程名称检索"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="loadData">搜索</el-button>
    </div>
    <el-table :data="tableData" border style="width:100%" :height="tHeight" class="table-box">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="图片标题" prop="name"></el-table-column>
      <el-table-column label="浏览次数" prop="viewCount"></el-table-column>
      <el-table-column label="上次浏览时间" prop="lastViewTime"></el-table-column>
    </el-table>
    <div class="pages" ref="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="size"
        :total="total"
        layout="total,sizes,prev,pager,next,jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from "vue-property-decorator";
@Component({
  components: {}
})
export default class TableData extends Vue {
  @Provide() searchVal: string = ""; // 搜索框
  @Provide() tHeight: number = document.body.offsetHeight - 270;
  @Provide() tableData: any = []; // 表格数据
  @Provide() page: number = 1; // 当前页
  @Provide() size: number = 5; // 条数
  @Provide() total: number = 0; // 总条数

  // @Watch("searchVal")
  // onSearchValChanged(val: string, oldVal: string) {
  //   this.loadData();
  // }

  handleSizeChange(val: any) {
    this.size = val;
    this.loadData();
  }

  handleCurrentChange(val: any) {
    this.page = val;
    this.loadData();
  }

  loadData() {
    (this as any).$axios
      .get(`/api/profile/getlog`, {
        params: {
          imgName: this.searchVal,
          pageIndex: this.page,
          pageSize: this.size
        }
      })
      .then((res: any) => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
      });
  }

  created() {
    this.loadData();
  }
}
</script>

<style lang="scss" scoped>
.table-data {
  height: 100%;
  .table-box {
    font-size: 14px;
  }
  .pages {
    background: #fff;
    margin-top: 10px;
    padding: 10px 10px;
    text-align: right;
    height: 55px;
    box-sizing: border-box;
  }
  .search-box {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px;
    border-radius: 4px;
    height: 55px;
    box-sizing: border-box;
    margin-top: 10px;
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
  }
}
</style>