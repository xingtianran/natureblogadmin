<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="21">
        <div id="left-top-header">
          <div>
            <span>天然博客管理中心</span>
          </div>
        </div>
      </el-col>
      <el-col :span="2">
        <div id="right-top-header">
          <el-dropdown size="medium" @command="handleCommand">
            <div class="right-top-header-avatar">
              <el-avatar class="el-dropdown-link" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)" :src="'/admin/image/' + this.avatar">
              </el-avatar>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a" icon="el-icon-user">个人信息</el-dropdown-item>
              <el-dropdown-item command="b" icon="el-icon-unlock">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {checkUser, doLogout, success_code} from "@/api/api";

export default {
  data() {
    return {
      visible: false,
      avatar: ''
    }
  },
  methods: {
    handleCommand(command){
      if (command === 'a'){
        this.$router.push('/consumer/consumer-info')
      }else if (command === 'b'){
        // 退出登录
        this.doLogout()
      }
    },
    doLogout(){
      doLogout('/user/logout').then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.$router.push('/login')
        }else {
          this.$message.error(result.message)
        }
      })
    },
    getUserInfo() {
      checkUser('/user/parse_token').then(result => {
        if (result.code === success_code) {
          this.avatar = result.data.avatar
        } else {
          this.$message.error(result.message)
        }
      })
    }
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style>
#left-top-header {
  width: 70%;
  font-weight: bold;
  color: #FFFFFF;
  font-size: 20px;
  line-height: 48px;
}

#right-top-header {
  margin-top: 3%;
  width: 20%;
  float: right;
}
.right-top-header-avatar{
  cursor: pointer;
}

</style>