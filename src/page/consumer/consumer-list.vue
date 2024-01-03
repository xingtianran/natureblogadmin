<template>
  <div>
    <div class="right-content-header-box">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input v-model="searchInfo.userName" size="mini" placeholder="用户名"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input v-model="searchInfo.email" size="mini" placeholder="邮箱"></el-input>
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
          :data="users"
          border
          style="width: 100%">
        <el-table-column
            fixed="left"
            prop="id"
            label="序号"
            width="120">
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户名"
            width="120">
        </el-table-column>
        <el-table-column
            label="头像"
            width="80">
          <template slot-scope="scope">
            <el-avatar shape="square" size="size" :src="'/admin/image/' + scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
            prop="roles"
            label="角色"
            width="105">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱">
        </el-table-column>
        <el-table-column
            prop="sign"
            label="签名"
            width="100">
        </el-table-column>
        <el-table-column
            label="状态"
            width="70">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === '1'" type="success">正常</el-tag>
            <el-tag v-else-if="scope.row.state === '0'" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="regIp"
            label="注册IP"
            width="110">
        </el-table-column>
        <el-table-column
            prop="loginIp"
            label="登录IP"
            width="110">
        </el-table-column>
        <el-table-column
            label="创建时间"
            width="110">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="更新时间"
            width="110">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button v-if="scope.row.state === '1'" type="danger" size="mini" @click="disableItem(scope.row)">禁用
            </el-button>
            <el-button v-if="scope.row.state === '0'" type="warning" size="mini" @click="refreshItem(scope.row)">恢复
            </el-button>
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
    <div class="user-password-dialog-box">
      <el-dialog
          title="重置密码"
          @close="emptyPassword"
          :visible.sync="dialogVisible"
          :closeOnClickModal="false"
          width="30%">
        <span>
          <el-input placeholder="请输入密码" v-model="resetItem.newPassword" size="medium" show-password></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini" round>取 消</el-button>
          <el-button type="primary" @click="postPassword" size="mini" round>确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {listUsers, disableUser, refreshUser, resetPassword} from "@/api/api";
import {success_code} from "@/api/api";

import * as dateUtil from "@/utils/date"
import {md5} from "js-md5";

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
      users: [],
      pageInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 0
      },
      searchInfo:{
        userName:'',
        email:''
      },
      resetItem:{
        userId: '',
        newPassword: ''
      }
    }
  },
  methods: {
    postPassword(){
      if (this.resetItem.newPassword === '') {
        this.$message.error("新密码不能为空")
        return;
      }
      let md5Password = md5(this.resetItem.newPassword);
      // 发起重置密码请求
      resetPassword('/user/password?userId=' + this.resetItem.userId + '&password=' + md5Password).then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
        }else {
          this.$message.error(result.message)
        }
        this.dialogVisible = false
      })
    },
    emptyPassword(){
      this.resetItem.userId = ''
      this.resetItem.newPassword = ''
    },
    resetPassword(item){
      this.dialogVisible = true
      this.resetItem.userId = item.id
    },
    resetSearch(){
      this.searchInfo.userName = ''
      this.searchInfo.email = ''
      this.listUsers(1)
    },
    refreshItem(item) {
      this.$confirm('此操作将恢复 <strong style="color: #67C23A">' + item.userName + '</strong> 用户, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        // 恢复
        refreshUser('/user/state/' + item.id).then(result => {
          if (result.code === 20000) {
            this.$message({
              type: "success",
              message: result.message
            })
            // 更新页面
            this.listUsers(this.pageInfo.currentPage)
          } else {
            this.$message({
              type: "danger",
              message: result.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        });
      });
    },
    disableItem(item) {
      this.$confirm('此操作将禁用 <strong style="color: #F56C6C">' + item.userName + '</strong> 用户, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        disableUser('/user/user_info/' + item.id).then(result => {
          if (result.code === 20000) {
            this.$message({
              type: "success",
              message: result.message
            })
            // 更新页面
            this.listUsers(this.pageInfo.currentPage)
          } else {
            this.$message({
              type: "danger",
              message: result.message
            })
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
      this.listUsers(val)
    },
    listUsers(page) {
      this.pageInfo.currentPage = page
      this.loading = true
      listUsers('/user/list/' + page + '/' + this.pageInfo.pageSize + '?userName='+this.searchInfo.userName+'&email='+this.searchInfo.email).then(result => {
        if (result.code === success_code) {
          this.loading = false
          this.users = result.data.list
          this.pageInfo.total = result.data.total
        } else {
          this.loading = false
          this.$message.error(result.message)
        }
      })
    },
    doSearch(){
      this.listUsers(1)
    }
  },
  mounted() {
    this.listUsers(1)
  }
}
</script>

<style>
.right-content-header-box {
  padding-bottom: 10px;
}
</style>