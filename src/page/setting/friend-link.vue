<template>
  <div>
    <div class="right-content-header-box">
      <el-button type="primary" size="mini" @click="handleDialogShow">添加友情链接</el-button>
    </div>
    <div class="right-content-main-box">
      <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :data="links"
          border
          style="width: 100%">
        <el-table-column
            fixed="left"
            prop="id"
            label="序号"
            width="200">
        </el-table-column>
        <el-table-column
            label="网站名称"
            width="120">
          <template slot-scope="scope">
            <el-link type="primary" :href="target_prefix + scope.row.url">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="网站LOGO">
          <template slot-scope="scope">
            <el-image id="content-image-box" fit="scale-down" :src="'/admin/image/' + scope.row.logo"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            prop="order"
            label="顺序"
            width="50">
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
            label="创建时间"
            width="160">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="更新时间"
            width="160">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="145">
          <template slot-scope="scope">
            <el-button size="mini" @click="updateLink(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteLink(scope.row)">删除
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
    <div class="content-dialog-box">
      <el-dialog
          :title="dialogTitle"
          @close="resetLink"
          :closeOnClickModal="false"
          :visible.sync="dialogVisible"
          width="30%">
        <div class="dialog-inter-box">
          <el-form label-position="right" label-width="80px" :model="link">
            <el-form-item label="网站名称" required>
              <el-input v-model="link.name"></el-input>
            </el-form-item>
            <el-form-item label="网站链接" required>
              <el-input v-model="link.url">
                <template slot="prepend">{{target_prefix}}</template>
              </el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="link.order" controls-position="right" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="link.state" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="LOGO" required>
              <my-upload field="file"
                         @crop-upload-success="cropUploadSuccess"
                         @crop-upload-fail="cropUploadFail"
                         v-model="uploadAvatar"
                         :width="150"
                         :height="100"
                         url="/admin/image?origin=link"
                         img-format="png">
              </my-upload>
              <div class="avatar-uploader" @click="showUploadLogo">
                <img v-if="link.logo" :src="'/admin/image/' + link.logo" class="avatar" alt="LOGO">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini" round>取 消</el-button>
          <el-button type="primary" @click="handleLink" size="mini" round>确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {deleteLink, updateLink, addLink, listLinks} from "@/api/api";
import {success_code} from "@/api/api";
import * as dateUtil from "@/utils/date"
export default {
  data(){
    return{
      uploadAvatar: false,
      dialogTitle: '',
      dialogVisible: false,
      loading: false,
      links: [],
      pageInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 0
      },
      link:{
        id: '',
        name: '',
        logo: '',
        url: '',
        order: 1,
        state: '1',
      },
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
      target_prefix: 'http://'
    }
  },
  methods:{
    showUploadLogo(){
      this.uploadAvatar = !this.uploadAvatar
    },
    cropUploadFail(status){
      this.$message.error(status)
    },
    cropUploadSuccess(result){
      if (result.code === success_code){
        this.$message.success(result.message)
        this.link.logo =  result.data.id
      }else {
        this.$message.error(result.message)
      }
    },
    handleLink(){
      // 检查数据
      if (this.link.name === ''){
        this.$message.error('网站名称不能为空')
        return
      }
      if (this.link.url === ''){
        this.$message.error('网站链接不能为空')
        return;
      }
      if (this.link.logo === ''){
        this.$message.error('网站LOGO不能为空')
      }
      if (this.link.id === ''){
        addLink('/admin/friend_link', this.link).then(result => {
          if (result.code === success_code){
            this.$message.success(result.message)
            this.listLinks(1)
            this.dialogVisible = false
          }else {
            this.$message.error(result.message)
          }
        })
      }else {
        updateLink('/admin/friend_link/' + this.link.id, this.link).then(result => {
          if (result.code === success_code){
            this.$message.success(result.message)
            this.listLinks(this.pageInfo.currentPage)
            this.dialogVisible = false
          }else {
            this.$message.error(result.message)
          }
        })
      }
    },
    resetLink(){
      this.link.id = ''
      this.link.name = ''
      this.link.url = ''
      this.link.logo = ''
      this.link.order = 1
      this.link.state = '1'
    },
    currentChange(val){
      this.listLinks(val)
    },
    handleDialogShow(){
      this.dialogTitle = '添加友情链接'
      this.dialogVisible = true
    },
    updateLink(item){
      this.dialogTitle = '编辑友情链接'
      this.link.id = item.id
      this.link.name = item.name
      this.link.url = item.url
      this.link.order = item.order
      this.link.state = item.state
      this.link.logo = item.logo
      this.dialogVisible = true
    },
    deleteLink(item){
      this.$confirm('此操作将永久删除 <strong style="color: #F56C6C">' + item.name + '</strong> 友情链接, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        deleteLink('/admin/friend_link/' + item.id).then(result => {
          if (result.code === success_code ) {
            this.$message.success(result.message)
            // 更新页面
            this.listLinks(this.pageInfo.currentPage)
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
          message: '已取消删除'
        });
      });
    },
    dateFormat(item){
      return dateUtil.dateFormat(item)
    },
    listLinks(page){
      this.loading = true
      listLinks('/admin/friend_link/list/'+ page + '/' + this.pageInfo.pageSize).then(result => {
        if (result.code === success_code){
          this.loading = false
          this.pageInfo.total = result.data.total
          this.links = result.data.list
        }else {
          this.$message.error(result.message)
        }
      })
    }
  },
  mounted() {
    this.listLinks(1)
  }
}
</script>

<style>
#content-image-box{
  width: 95%;
  padding: 3px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}
.right-content-header-box{
  padding-bottom: 10px;
}

.avatar {
  width: 150px;
  height: 100px;
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar-uploader{
  width: 150px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
</style>