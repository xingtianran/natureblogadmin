<template>
  <div>
    <el-card class="box-card"
             v-loading="loading"
             element-loading-text="拼命加载中">
      <div slot="header" class="clearfix">
        <span>用户信息</span>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form label-position="right" label-width="80px" :model="user">
              <el-form-item label="头像">
                <my-upload field="file"
                           @crop-upload-success="cropUploadSuccess"
                           @crop-upload-fail="cropUploadFail"
                           v-model="uploadAvatar"
                           :width="300"
                           :height="300"
                           url="/admin/image?origin=avatar"
                           img-format="png">
                </my-upload>
                <div @click="toggleShow">
                  <el-tooltip class="item" effect="dark" content="点击设置头像" placement="right-start">
                    <el-avatar shape="square" :size="50" :src="'/admin/image/' + user.avatar"></el-avatar>
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="序号">
                <el-input v-model="user.id" disabled></el-input>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input @change="checkUserName" v-model="user.userName"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="user.email" disabled></el-input>
              </el-form-item>
              <el-form-item label="签名">
                <el-input v-model="user.sign"></el-input>
              </el-form-item>
              <el-button v-if="isSubmit" :key="1" class="update-user-info-button" @click="updateUserInfo" type="success" size="mini">修改信息</el-button>
              <el-button v-else :key="2" class="update-user-info-button" type="success" size="mini" disabled>修改信息</el-button>
            </el-form>
          </el-col>
          <el-col :span="4">
            <el-button @click="$router.push('/consumer/consumer-email')" id="update-email-link-button" type="primary" size="mini">修改邮箱</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>


<script>
import {checkUsername, getUserInfo, success_code, updateUserInfo} from "@/api/api";

export default {
  data(){
    return{
      loading: false,
      uploadAvatar: false,
      user:{
        id: '',
        userName: '',
        avatar: '',
        email: '',
        sign: ''
      },
      isSubmit: false
    }
  },methods:{
    checkUserName(){
      checkUsername('/user/user_name?user_name=' + this.user.userName).then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.isSubmit = true
        }else {
          this.isSubmit = false
          this.$message.error(result.message)
        }
      })
    },
    toggleShow(){
      this.uploadAvatar = !this.uploadAvatar
    },
    cropUploadFail(status){
      this.$message.error(status)
    },
    cropUploadSuccess(result){
      if (result.code === success_code){
        this.$message.success(result.message)
        this.user.avatar =  result.data.id
      }else {
        this.$message.error(result.message)
      }
    },
    getUserInfo(){
      this.loading = true
      getUserInfo('/user/parse_token').then(result => {
        if (result.code === success_code){
          this.user = result.data
          this.loading = false
        }else {
          this.$message.error(result.message)
        }
      })
    },
    updateUserInfo(){
      // 检查数据
      if (this.user.userName === '') {
        this.$message.error('用户名不能为空')
        return
      }
      if (this.user.sign === ''){
        this.$message.error('签名不能为空')
      }
      // 提交数据
      updateUserInfo('/user/user_info/' + this.user.id, this.user).then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          // 回显数据
          this.getUserInfo()
        }else {
          this.$message.error(result.message)
        }
      })
    }
  }
  ,mounted() {
    this.getUserInfo()
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
.update-user-info-button{
  margin-left: 50%;
  margin-top: 6px;
  margin-bottom: 6px;
}
#update-email-link-button{
  margin-top: 385%;
}
</style>