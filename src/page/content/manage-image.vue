<template>
  <div>
    <div class="right-content-header-box">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-select v-model="searchInfo.origin" size="small" placeholder="请选择来源">
            <el-option
                v-for="item in origins"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" size="mini" @click="doSearch">搜 索</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="resetSearch">清 空</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="right-content-main-box">
      <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :data="images"
          border
          style="width: 100%">
        <el-table-column
            fixed="left"
            prop="id"
            label="序号"
            width="110">
        </el-table-column>
        <el-table-column
            prop="userId"
            label="用户ID"
            width="110">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="url"
            label="照片URL"
            width="120">
        </el-table-column>
        <el-table-column>
            label="照片"
            width="150">
          <template slot-scope="scope">
            <el-image fit="cover" :src="'/admin/image/' + scope.row.url"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            prop="path"
            label="存放路劲"
            width="100">
        </el-table-column>
        <el-table-column
            prop="contentType"
            label="类型">
        </el-table-column>
        <el-table-column
            prop="origin"
            label="来源"
            width="105">
        </el-table-column>
        <el-table-column
            label="状态"
            width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === '1'" type="success">正常</el-tag>
            <el-tag v-else type="warning">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="创建时间"
            width="100">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="更新时间"
            width="100">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state === '1'" type="warning" size="mini" @click="disableItem(scope.row)">禁用</el-button>
            <el-button v-else type="success" size="mini" @click="refreshItem(scope.row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="right-content-bottom-box">
      <el-pagination
          background
          @current-change="currentChange"
          layout="prev, pager, next"
          :current-page.sync="pageInfo.currentPage"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {deleteImage, getImageOrigins, listImages, refreshImage} from "@/api/api";
import {success_code} from "@/api/api";

import * as dateUtil from "@/utils/date"

export default {
  data() {
    return {
      loading: false,
      pageInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 0
      },
      images: [],
      searchInfo:{
        origin: ''
      },
      origins:[]
    }
  },
  methods: {
    refreshItem(item){
      this.$confirm('此操作将恢复 <strong style="color: #F56C6C">' + item.name + '</strong> 照片, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        refreshImage('/admin/image/' + item.id).then(result => {
          if (result.code === success_code){
            this.$message.success(result.message)
            this.listImages(1)
          }else {
            this.$message.error(result.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        });
      });
    },
    resetSearch(){
      this.searchInfo.origin = ''
      this.listImages(1)
    },
    disableItem(item) {
      this.$confirm('此操作将禁用 <strong style="color: #F56C6C">' + item.name + '</strong> 照片, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        deleteImage('/admin/image/' + item.id).then(result => {
          if (result.code === success_code) {
            this.$message.success(result.message)
            // 更新页面
            this.listImages(this.pageInfo.currentPage)
          } else {
            this.$message.error(result.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁用'
        });
      });
    },
    dateFormat(date) {
      return dateUtil.dateFormat(date)
    },
    currentChange(val) {
      this.listImages(val)
    },
    getImageOrigins(){
      getImageOrigins('/admin/image/origin').then(result => {
        if (result.code === success_code){
          this.origins = result.data
        }else {
          this.$message.error(result.message)
        }
      })
    },
    listImages(page) {
      this.pageInfo.currentPage = page
      this.loading = true
      listImages('/admin/image/list/' + page + '/' + this.pageInfo.pageSize + '?origin=' + this.searchInfo.origin).then(result => {
        if (result.code === success_code) {
          this.loading = false
          this.images = result.data.list
          this.pageInfo.total = result.data.total
        } else {
          this.loading = false
          this.$message.error(result.message)
        }
      })
    },
    doSearch(){
      this.listImages(1)
    }
  },
  mounted() {
    this.listImages(1)
    this.getImageOrigins()
  }
}
</script>

<style>
.right-content-header-box {
  padding-bottom: 10px;
}
</style>