<template>
  <div>
    <el-card class="box-card"
             v-loading="loading"
             element-loading-text="拼命加载中">
      <div slot="header" class="clearfix">
        <span>网站信息</span>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form size="medium" label-position="right" label-width="100px" :model="websiteInfo">
              <el-form-item label="网站标题" required>
                <el-input v-model="websiteInfo.title"></el-input>
              </el-form-item>
              <el-form-item label="网站关键字" required>
                <el-tooltip class="item" effect="dark" content="关键字之间请用逗号隔开" placement="right-start">
                  <el-input type="textarea" :rows="2" :maxlength="100" v-model="websiteInfo.keywords"></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="网站描述" required>
                <el-input type="textarea" :rows="3" :maxlength="100" v-model="websiteInfo.description"></el-input>
              </el-form-item>
              <el-button id="website-content-box" type="primary" size="mini" @click="updateWebsiteInfo" round>修改信息</el-button>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>

  </div>
</template>


<script>
import {getWebsiteSeo, getWebsiteTitle, success_code, updateWebsiteSeo, updateWebsiteTitle} from "@/api/api";

export default {
  data(){
    return{
      loading: false,
      syncTitleSign: false,
      syncSeoSign: false,
      websiteInfo:{
        description: '',
        keywords: '',
        title: ''
      },
      oldWebsiteInfo:{
        description: '',
        keywords: '',
        title: ''
      }
    }
  },
  methods:{
    updateWebsiteInfo(){
      // 检查数据
      if (this.websiteInfo.title === '') {
        this.$message.error("网站标题不能为空")
      }
      if (this.websiteInfo.keywords === ''){
        this.$message.error("网站关键字不能为空")
      }
      if (this.websiteInfo.description === ''){
        this.$message.error("网站描述不能为空")
      }
      // 提交数据 如果seo改变了就提交seo 如果title改变了，就提交title
      if (this.websiteInfo.title !== this.oldWebsiteInfo.title){
        updateWebsiteTitle('/admin/website/title?title=' + this.websiteInfo.title).then(result => {
          if (result.code === success_code){
            this.$message.success(result.message)
            this.getWebsiteTitle()
          }else {
            this.$message.error(result.message)
          }
        })
      }
      if (this.websiteInfo.keywords !== this.oldWebsiteInfo.keywords || this.websiteInfo.description !== this.oldWebsiteInfo.description){
        updateWebsiteSeo('/admin/website/seo?description=' + this.websiteInfo.description + '&keywords=' + this.websiteInfo.keywords).then(result => {
          if (result.code === success_code){
            this.$message.success(result.message)
            this.getWebsiteSeo()
          }else {
            this.$message.error(result.message)
          }
        })
      }
    },
    getWebsiteSeo(){
      getWebsiteSeo('/admin/website/seo').then(result => {
        if (result.code === success_code){
          this.syncSeoSign = true
          if (this.syncTitleSign){
            this.loading = false
          }
          this.websiteInfo.description = result.data['key_website_description']
          this.websiteInfo.keywords = result.data['key_website_keywords']
          this.oldWebsiteInfo.description = this.websiteInfo.description
          this.oldWebsiteInfo.keywords = this.websiteInfo.keywords
        }else {
          this.$message.error(result.message)
        }
      })
    },
    getWebsiteTitle(){
      getWebsiteTitle('/admin/website/title').then(result => {
        if (result.code === success_code){
          this.syncTitleSign = true
          if (this.syncSeoSign){
            this.loading = false
          }
          this.websiteInfo.title = result.data.value
          this.oldWebsiteInfo.title = this.websiteInfo.title
        }else {
          this.$message.error(result.message)
        }
      })
    }
  },
  mounted() {
    this.loading = true
    this.getWebsiteSeo()
    this.getWebsiteTitle()
  }
}
</script>

<style>

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
#website-content-box{
  margin-top: 6px;
  margin-bottom: 6px;
  margin-left: 50%;
}
</style>