<template>
  <div class="login-box">
    <el-container>
      <el-header>
        <div class="login-header-box">
          <div class="login-header-logo">
            博客管理中心 | 登录
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="login-content-box">
          <div class="login-content">
            <el-row :gutter="20">
              <el-col :span="15">
                <el-form  id="login-content-from" label-position="right" label-width="100px">
                  <el-form-item label="账号" required>
                    <el-input v-model="userinfo.userName" placeholder="请输入用户名/邮箱"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" required>
                    <el-input v-model="userinfo.password" type="password" placeholder="请输入密码" show-password></el-input>
                  </el-form-item>
                  <el-form-item label="人类验证码" required>
                    <el-input v-model="loginInfo.captcha" placeholder="请输右侧图片验证码" @keyup.enter.native="doLogin"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="medium" @click="doLogin" round>登 录</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="5">
                <el-image class="login-content-image" :src="captchaPath" @click="updateCaptchaKey"></el-image>
              </el-col>
            </el-row>

          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>

  import {doLogin} from "@/api/api";
  import {md5} from "js-md5";
  export default {
    data(){
      return{
        userinfo :{
          userName: '',
          password: '',
        },
        loginInfo: {
          captcha:'',
          captchaKey: '',
          from: ''
        },
        captchaPath:'',
      }
    },
    methods:{
      printError(msg){
        this.$message({
          message: msg,
          type: 'error'
        })
      },
      doLogin(){
        // 检查数据
        if (this.loginInfo.captcha === ''){
          this.printError('验证码不能为空');
          return;
        }
        if (this.userinfo.password === ''){
          this.printError('密码不能为空');
          return;
        }
        if (this.userinfo.userName === ''){
          this.printError('用户名不能为空');
          return;
        }
        this.userinfo.password = md5(this.userinfo.password)
        doLogin('/user/login/'+ this.loginInfo.captcha + '/' + this.loginInfo.captchaKey, this.userinfo).then(result => {
          if (result.code === 20002){
            this.$message({
              message: result.message,
              type: 'success'
            })
            this.$router.push('/')
          }else {
            this.updateCaptchaKey()
            this.printError(result.message)
          }
        })
      },
      updateCaptchaKey(){
        this.captchaPath = '/user/captcha?captcha_key=' + this.loginInfo.captchaKey + '&random=' + Date.parse(new Date())
      }
    },
    mounted() {
      this.loginInfo.captchaKey = Date.parse(new Date());
      this.updateCaptchaKey()
    }
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
.login-content-image{
  height: 40px;
  margin-top: 103%;
  cursor: pointer;
  border: solid 1px #e6e6e6;
}
</style>