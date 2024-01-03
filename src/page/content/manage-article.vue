<template>
  <div>
    <div class="right-content-header-box">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input v-model="searchInfo.keyword" size="small" placeholder="关键字"></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="searchInfo.categoryId" size="small" placeholder="请选择分类">
            <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="searchInfo.state" size="small" placeholder="请选择状态">
            <el-option
                v-for="item in states"
                :key="item.id"
                :label="item.name"
                :value="item.id">
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
          :data="articles"
          border
          style="width: 100%">
        <el-table-column
            fixed="left"
            prop="id"
            label="序号"
            width="110">
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题"
            width="120">
        </el-table-column>
        <el-table-column
            label="分类"
            width="80">
          <template slot-scope="scope">
            <span>{{ getCategoryById(scope.row.categoryId) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="类型"
            width="105">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === '1'">markdown</el-tag>
            <el-tag v-else>富文本</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="summary"
            label="摘要">
        </el-table-column>
        <el-table-column
            prop="viewCount"
            label="浏览量"
            width="50">
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
            prop="label"
            label="标签"
            width="100">
        </el-table-column>
        <el-table-column
            label="封面"
            width="80">
          <template slot-scope="scope">
            <el-image fit="cover"  :src="'/admin/image/' + scope.row.cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === '1'" type="success">发布</el-tag>
            <el-tag v-else-if="scope.row.state === '2'" type="warning">草稿</el-tag>
            <el-tag v-else type="danger">删除</el-tag>
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
            width="210">
          <template slot-scope="scope">
            <el-button size="mini" @click="editArticle(scope.row)">编辑</el-button>
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
import {listArticles, getAllCategories, deleteArticle, resetArticleTop} from "@/api/api";
import {success_code} from "@/api/api";

import * as dateUtil from "@/utils/date"

export default {
  data() {
    return {
      dialogVisible: false,
      options: [
        {
          value:  '1',
          label: '正常'
        },
        {
          value: '0',
          label: '禁用'
        },
      ],
      loading: false,
      pageInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 0
      },
      articles: [],
      categories: [],
      states:[
        {
          id: '1',
          name: '已发布'
        },
        {
          id: '2',
          name: '草稿',
        },
        {
          id: '0',
          name: '已删除'
        }
      ],
      searchInfo:{
        keyword:'',
        categoryId:'',
        state: ''
      },
    }
  },
  methods: {
    editArticle(item){
      // 传递参数
      this.$router.push({
        path: "/content/post-article",
        query: {
          id: item.id
        }
      })
    },
    resetTop(item){
      resetArticleTop('/admin/article/top/' + item.id).then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.listArticles(1)
        }else {
          this.$message.error(result.message)
        }
      })
    },
    resetSearch(){
      this.searchInfo.keyword = ''
      this.searchInfo.categoryId = ''
      this.searchInfo.state = ''
      this.listArticles(1)
    },
    deleteItem(item) {
      this.$confirm('此操作将删除 <strong style="color: #F56C6C">' + item.title + '</strong> 文章, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        deleteArticle('/admin/article/' + item.id).then(result => {
          if (result.code === success_code) {
            this.$message.success(result.message)
            // 更新页面
            this.listArticles(this.pageInfo.currentPage)
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
    getCategoryById(categoryId){
      let categoryName = '';
      this.categories.forEach(category => {
        if (category.id === categoryId){
          categoryName = category.name
          return categoryName
        }
      })
      return categoryName
    },
    getAllCategories() {
      getAllCategories('/admin/category/all').then(result => {
        if (result.code === success_code) {
          this.categories = result.data
        } else {
          this.$message.error(result.message)
        }
      })
    },
    dateFormat(date) {
      return dateUtil.dateFormat(date)
    },
    currentChange(val) {
      this.listArticles(val)
    },
    listArticles(page) {
      this.pageInfo.currentPage = page
      this.loading = true
      listArticles('/admin/article/list/' + page + '/' + this.pageInfo.pageSize + '?keyword='+this.searchInfo.keyword+'&categoryId='+this.searchInfo.categoryId+'&state='+this.searchInfo.state+'&isCache=0').then(result => {
        if (result.code === success_code) {
          this.loading = false
          this.articles = result.data.list
          this.pageInfo.total = result.data.total
        } else {
          this.loading = false
          this.$message.error(result.message)
        }
      })
    },
    doSearch(){
      this.listArticles(1)
    }
  },
  mounted() {
    this.listArticles(1)
    this.getAllCategories()
  }
}
</script>

<style>
.right-content-header-box {
  padding-bottom: 10px;
}
</style>