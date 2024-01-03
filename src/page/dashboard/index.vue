<template>
  <div>
    <div class="index-header-box">
      <span>欢迎使用天然博客管理系统</span>
    </div>
    <div class="index-main-box">
      <div class="index-main-supper-box">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>访问总量：</span>
              </div>
              <div class="card-supper-data-box">
                <span>{{count.viewCount}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>注册用户：</span>
              </div>
              <div>
                <div class="card-supper-data-box">
                  <span>{{count.registerCount}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>文章总数：</span>
              </div>
              <div class="card-supper-data-box">
                <span>{{count.articleCount}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>评论总数：</span>
              </div>
              <div class="card-supper-data-box">
                <span>{{count.commentCount}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="index-main-bottom-box">
      <el-row :gutter="20">
        <el-col :span="11">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold; color: #606266">快捷操作</span>
            </div>
            <div>
              <el-button @click="$router.push('/content/post-article')" icon="el-icon-edit" type="text">写文章
              </el-button>
            </div>
            <div>
              <el-button @click="$router.push('/setting/website-info')" icon="el-icon-setting" type="text">
                修改网站信息
              </el-button>
            </div>
            <div>
              <el-button @click="$router.push('/setting/friend-link')" icon="el-icon-share" type="text">编辑友情链接
              </el-button>
            </div>
            <div>
              <el-button @click="$router.push('/operation/manage-loop')" icon="el-icon-video-camera" type="text">
                轮播图管理
              </el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="13">
          <el-card class="box-card" id="new-comment-box">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold; color: #606266">最新评论</span>
              <el-button @click="$router.push('/content/manage-comment')" style="float: right; padding: 3px 0" type="text">更多 >>></el-button>
            </div>
            <div>
              <el-table
                  element-loading-text="拼命加载中"
                  :data="comments"
                  style="width: 100%">
                <el-table-column
                    prop="content"
                    label="评论内容">
                </el-table-column>
                <el-table-column
                    label="用户">
                  <template slot-scope="scope">
                    <el-avatar :src="'/admin/image/' + scope.row.natureUser.avatar"></el-avatar>
                    <span class="span-username-box">{{ scope.row.natureUser.userName }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
import {
  getArticleCount,
  getCommentCount,
  getCommentsNew,
  getRegisterCount,
  getWebsiteViewCount,
  success_code
} from "@/api/api";

export default {
  data() {
    return {
      comments: [],
      size: 6,
      count: {
        viewCount: 0,
        registerCount: 0,
        articleCount: 0,
        commentCount: 0
      }
    }
  },
  methods: {
    getCommentsNew() {
      getCommentsNew('/admin/comment/new/' + this.size).then(result => {
        if (result.code === success_code) {
          this.comments = result.data
          console.log(this.comments)
        } else {
          this.$message.error(result.message)
        }
      })
    },
    getWebsiteViewCount(){
      getWebsiteViewCount('/admin/website/view_count').then(result => {
        if (result.code === success_code){
          this.count.viewCount = result.data['key_website_view_count']
        }else {
          this.$message.error(result.message)
        }
      })
    },
    getRegisterCount(){
      getRegisterCount('/user/count').then(result => {
        if (result.code === success_code){
          this.count.registerCount = result.data
        }else {
          this.$message.error(result.message)
        }
      })
    },
    getArticleCount(){
      getArticleCount('/admin/article/count').then(result => {
        if (result.code === success_code){
          this.count.articleCount = result.data
        }else {
          this.$message.error(result.message)
        }
      })
    },
    getCommentCount(){
      getCommentCount('/admin/comment/count').then(result => {
        if (result.code === success_code){
          this.count.commentCount = result.data
        }else {
          this.$message.error(result.message)
        }
      })
    }
  },
  mounted() {
    this.getCommentsNew()
    this.getWebsiteViewCount()
    this.getRegisterCount()
    this.getArticleCount()
    this.getCommentCount()
  }
}
</script>

<style>
.index-header-box {
  color: #606266;
  font: 18px large;
  margin: 10px;
}

.index-main-supper-box {
  margin-left: 10px;
  width: 98%;
}

.index-main-bottom-box {
  margin-top: 15px;
  margin-left: 10px;
  width: 98%;
}

.index-main-supper-box .card-supper-data-box {
  font-weight: bolder;
  font-size: 28px;
  color: #409EFF;
  width: 120px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin: 0 auto;
}

.index-main-supper-box .el-card__header {
  padding: 15px 16px;
  border: 0;
}

.span-username-box {
  display: inline-block;
  width: 100px;
  height: 100px;
  position: absolute;
  left: 20%;
  right: 50%;
}
#new-comment-box .el-card__body{
  padding: 0 15px;
}
</style>