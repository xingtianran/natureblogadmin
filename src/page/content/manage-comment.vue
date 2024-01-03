<template>
  <div>
    <div class="right-content-header-box">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input v-model="searchInfo.articleId" size="small" placeholder="文章ID"></el-input>
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
          :data="comments"
          border
          style="width: 100%">
        <el-table-column
            fixed="left"
            prop="id"
            label="序号"
            width="110">
        </el-table-column>
        <el-table-column
            prop="parentId"
            label="父评论ID"
        width="100">
        </el-table-column>
        <el-table-column
            prop="articleId"
            label="文章ID"
            width="80">
        </el-table-column>
        <el-table-column
            prop="content"
            label="内容">
        </el-table-column>
        <el-table-column
            label="用户ID"
            width="130">
          <template slot-scope="scope">
            <el-avatar :src="'/admin/image/' + scope.row.natureUser.avatar"></el-avatar>
            <span class="span-username-box">{{ scope.row.natureUser.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="置顶状态"
            width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.top === '1'" type="success">已置顶</el-tag>
            <el-tag v-else type="warning">未置顶</el-tag>
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
            width="150">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
            <el-button v-if="scope.row.top === '0'" type="success" size="mini" @click="resetTop(scope.row)">置顶</el-button>
            <el-button v-else type="warning" size="mini" @click="resetTop(scope.row)">取置</el-button>
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
import {deleteComment, listComments, resetCommentTop} from "@/api/api";
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
      comments: [],
      searchInfo:{
        articleId: ''
      },
    }
  },
  methods: {
    resetTop(item){
      resetCommentTop('/admin/comment/top/' + item.id).then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.listComments(1)
        }else {
          this.$message.error(result.message)
        }
      })
    },
    resetSearch(){
      this.searchInfo.articleId = ''
      this.listComments(1)
    },
    deleteItem(item) {
      this.$confirm('此操作将删除 <strong style="color: #F56C6C">' + item.id + '</strong> 评论, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        deleteComment('/admin/comment/' + item.id).then(result => {
          if (result.code === success_code) {
            this.$message.success(result.message)
            // 更新页面
            this.listComments(this.pageInfo.currentPage)
          } else {
            this.$message.error(result.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    dateFormat(date) {
      return dateUtil.dateFormat(date)
    },
    currentChange(val) {
      this.listComments(val)
    },
    listComments(page) {
      this.pageInfo.currentPage = page
      this.loading = true
      listComments('/admin/comment/list/' + page + '/' + this.pageInfo.pageSize + '?articleId=' + this.searchInfo.articleId).then(result => {
        if (result.code === success_code) {
          this.loading = false
          this.comments = result.data.list
          this.pageInfo.total = result.data.total
        } else {
          this.loading = false
          this.$message.error(result.message)
        }
      })
    },
    doSearch(){
      this.listComments(1)
    }
  },
  mounted() {
    this.listComments(1)
  }
}
</script>

<style>
.right-content-header-box {
  padding-bottom: 10px;
}
.span-username-box {
  display: inline-block;
  width: 100px;
  height: 100px;
  position: absolute;
  left: 50%;
  right: 50%;
}
</style>