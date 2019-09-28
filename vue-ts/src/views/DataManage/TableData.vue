<template>
  <div class="table-data">
    <div class="search-box">
      <el-input size="small" v-model="searchVal" placeholder="请输入课程名称检索"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="loadData">搜索</el-button>
    </div>
    <el-table
      stripe
      :data="tableData"
      border
      style="width:100%"
      :height="tHeight"
      class="table-box"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="预览" prop="imgID" width="100" align="center">
        <template slot-scope="scope">
          <a :href="`${staticSrc}/share/${scope.row.imgID}`" target="_blank">
            <img
              style="width:30px;height:30px;cursor:pointer"
              :src="`${staticSrc}/share/${scope.row.imgID}`"
            />
          </a>
        </template>
      </el-table-column>
      <el-table-column label="图片名" prop="name"></el-table-column>
      <el-table-column label="收藏人数" prop="collectors" width="100" align="center">
        <template slot-scope="scope">{{scope.row.collectors.length}}</template>
      </el-table-column>
      <el-table-column label="上传时间" prop="uploadTime"></el-table-column>
      <el-table-column label="操作" prop="operate" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteImg(scope.row.imgID)">删除</el-button>
        </template>
      </el-table-column>
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
  @Provide() size: number = 10; // 条数
  @Provide() total: number = 0; // 总条数

  // @Watch("searchVal")
  // onSearchValChanged(val: string, oldVal: string) {
  //   this.loadData();
  // }

  // 分页切换搜索
  handleSizeChange(val: any) {
    this.size = val;
    this.loadData();
  }
  handleCurrentChange(val: any) {
    this.page = val;
    this.loadData();
  }

  // 删除图片
  deleteImg(id: string) {
    (this as any).$axios
      .delete(`/api/images/deleteimg`, {
        params: { imgID: id }
      })
      .then((res: any) => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });

        this.loadData();
        // this.tableData = res.data.rows;
        // this.total = res.data.total;
      });
  }

  // 表格数据加载
  loadData() {
    (this as any).$axios
      .get(`/api/images/getuploadlog`, {
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