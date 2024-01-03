<template>
  <div class="login-box">
    <el-container>
      <el-header>
        <div class="login-header-box">
          <div class="login-header-logo">
            博客管理中心 | 初始化管理员账户
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="login-content-box">
          <div class="login-content">
            <el-row :gutter="20">
              <el-col :span="15">
                <el-form  id="login-content-from" label-position="right" label-width="100px">
                  <el-form-item label="用户名" required>
                    <el-input v-model="userinfo.userName" placeholder="请输入用户名"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" required>
                    <el-input v-model="userinfo.password" type="password" placeholder="请输入密码" show-password></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" required>
                    <el-input v-model="userinfo.email" placeholder="请输入邮箱"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="medium" @click="initAdmin" round>初&nbsp;始&nbsp;化</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>

          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>

import {initAdmin, success_code} from "@/api/api";
import {md5} from "js-md5";
  export default {
    data(){
      return{
        userinfo :{
          userName: '',
          password: '',
          email: '',
        },
      }
    },
    methods:{
      initAdmin(){
        if (this.userinfo.password === ''){
          this.$message.error('密码不能为空');
          return;
        }
        if (this.userinfo.userName === ''){
          this.$message.error('用户名不能为空');
          return;
        }
        if (this.userinfo.email === ''){
          this.$message.error("邮箱不能为空")
          return;
        }
        this.userinfo.password = md5(this.userinfo.password)
        initAdmin(this.userinfo).then(result => {
          if (result.code === success_code){
            this.$message.success(result.message)
            this.$router.push('/login')
          }else {
            this.$message.error(result.message)
          }
        })
      },
    },
  }
</script>

<style>
.login-box .el-header{
  background-color: #409EFF;
  color: #303133;
  height: 46px !important;
}

.login-header-box{
  width: 1140px;
  margin: 0 auto;
}
.login-header-logo{
  width: 60%;
  margin: 0 auto;
  font-weight: bold;
  color: #FFFFFF;
  font-size: 15px;
  line-height: 48px;
}

.login-content-box{
  width: 1120px;
  margin: 0 auto;
}
.login-content{
  padding: 30px 10px 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 5px;
  width: 60%;
  margin: 0 auto;
}


#login-content-from .el-form-item__label{
  border-bottom: solid 1px #e6e6e6;
  border-left: solid 1px #e6e6e6;
  border-top: solid 1px #e6e6e6;
}
#login-content-from .el-input__inner{
  height: 41.6px;
  line-height: 41.6px;
  border-radius: 0;
}
</style>