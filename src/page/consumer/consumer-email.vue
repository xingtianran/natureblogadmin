<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>邮箱修改</span>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form size="medium" label-position="right" label-width="80px" :model="emailInfo">
              <el-form-item label="邮箱地址" required>
                <el-input @change="emailChange" v-model="emailInfo.email"></el-input>
              </el-form-item>
              <el-form-item id="email-captcha-box" label="验证码" required>
                <el-input v-model="emailInfo.captcha"></el-input>
              </el-form-item>
              <el-button id="email-content-box" type="primary" size="mini" @click="updateEmail" round>修改邮箱</el-button>
            </el-form>
          </el-col>
          <el-col :span="4">
            <el-button v-if="!isVerifyVisible && !checkEmailVisible" id="email-send-box" type="success" size="mini" :key="1" @click="sendVerifyCode" round disabled>发送验证码</el-button>
            <el-button v-else-if="!isVerifyVisible" id="email-send-box" type="success" size="mini" :key="2" @click="sendVerifyCode" round>发送验证码</el-button>
              <el-button v-else id="email-send-box" type="success" size="mini" :key="3" round disabled>{{verifyCodeText}}</el-button>
          </el-col>
        </el-row>

      </div>
    </el-card>
  </div>
</template>


<script>
import {checkEmail, sendVerifyCode, success_code, updateEmail} from "@/api/api";

export default {
  data(){
    return{
      emailInfo: {
        email: '',
        captcha: ''
      },
      verifyCodeText : '发送验证码(60)',
      isVerifyVisible : false,
      checkEmailVisible : false
    }
  },
  methods:{
    updateEmail(){
      if (this.emailInfo.captcha === ''){
        this.$message.error("验证码不能为空")
        return
      }
      // 更新邮箱
      updateEmail('/user/email?email=' + this.emailInfo.email + '&verify_code=' + this.emailInfo.captcha).then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.emailInfo.captcha = ''
        }else {
          this.$message.error(result.message)
        }
      })
    },
    emailChange(){
      // 当邮箱输入框失去焦点时，检查邮箱是否已经被注册
      if (this.emailInfo.email === ''){
        this.$message.error("邮箱地址不能为空")
        return
      }
      let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      if (!reg.test(this.emailInfo.email)){
        this.$message.error("邮箱格式不正确")
        return
      }
      checkEmail('/user/email?email=' + this.emailInfo.email).then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.checkEmailVisible = true
        }else {
          this.$message.error(result.message)
          this.checkEmailVisible = false
        }
      })
    },
    sendVerifyCode(){
      // 检查数据
      if (this.emailInfo.email === ''){
        this.$message.error("邮箱地址不能为空")
        return
      }
      let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      if (!reg.test(this.emailInfo.email)){
        this.$message.error("邮箱格式不正确")
        return
      }
      // 将发送验证码设置成倒计时
      // 定时器
      this.isVerifyVisible = true
      let count = 60
      let that = this
      let interval = setInterval( () => {
        count--;
        if (count <= 0){
          that.isVerifyVisible = false
          clearInterval(interval)
        }
        that.verifyCodeText = '发送验证码(' + count + ')'
      }, 1000)
      // 直接发送验证码
      sendVerifyCode('/user/verify_code?email_address='+this.emailInfo.email+'&type=update').then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
        }else {
          this.$message.error(result.message)
        }
      })
    }
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
#email-send-box{
  margin-top: 10%;
}
#email-captcha-box{
  width: 65%;
}
#email-content-box{
  margin-top: 6px;
  margin-bottom: 5px;
}
</style>