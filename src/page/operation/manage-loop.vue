<template>
  <div>
    <div class="right-content-header-box">
      <el-button type="primary" size="mini" @click="handleDialogShow">添加轮播图</el-button>
    </div>
    <div class="right-content-main-box">
      <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :data="loops"
          border
          style="width: 100%">
        <el-table-column
            fixed="left"
            prop="id"
            label="序号"
            width="200">
        </el-table-column>
        <el-table-column
            label="标题"
            width="120">
          <template slot-scope="scope">
            <el-link type="primary" :href="target_prefix + scope.row.targetUrl">{{scope.row.title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="图片">
          <template slot-scope="scope">
            <el-image id="content-image-box" fit="scale-down" :src="'/admin/image/' + scope.row.imageUrl"></el-image>
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
            <el-button size="mini" @click="updateLoop(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除
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
          @close="resetLoop"
          :closeOnClickModal="false"
          :visible.sync="dialogVisible"
          width="30%">
        <div class="dialog-inter-box">
          <el-form label-position="right" label-width="80px" :model="loop">
            <el-form-item label="标题">
              <el-input v-model="loop.title"></el-input>
            </el-form-item>
            <el-form-item label="目标链接">
              <el-input v-model="loop.targetUrl">
                <template slot="prepend">{{target_prefix}}</template>
              </el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="loop.order" controls-position="right" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="loop.state" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面">
              <el-upload
                  class="avatar-uploader"
                  action="/admin/image?origin=loop"
                  :show-file-list="false"
                  :on-success="handleImageSuccess"
                  :before-upload="beforeAvatarUpload">
                <img v-if="loop.imageUrl" :src="'/admin/image/' + loop.imageUrl" class="avatar" alt="封面">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini" round>取 消</el-button>
          <el-button type="primary" @click="handleLoop" size="mini" round>确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {listLoops, deleteLoop, addLoop, updateLoop} from "@/api/api";
import {success_code, error_code} from "@/api/api";
import * as dateUtil from "@/utils/date"
export default {
  data(){
    return{
      dialogTitle: '',
      dialogVisible: false,
      loading: false,
      loops: [],
      pageInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 0
      },
      loop:{
        id: '',
        title: '',
        order: 1,
        state: '1',
        targetUrl: '',
        imageUrl: ''
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
    beforeAvatarUpload(){

    },
    handleImageSuccess(response){
      if (response.code === error_code){
        this.$message.error(response.message)
        return
      }
      this.loop.imageUrl =  response.data.id
    },
    handleLoop(){
      // 检查数据
      if (this.loop.title === ''){
        this.$message.error('标题不能为空')
        return
      }
      if (this.loop.targetUrl === ''){
        this.$message.error('目标链接不能为空')
        return;
      }
      if (this.loop.targetUrl === ''){
        this.$message.error('轮播图不能为空')
      }
      if (this.loop.id === ''){
        addLoop('/admin/looper', this.loop).then(result => {
          if (result.code === success_code){
            this.$message.success(result.message)
            this.listLoops(1)
          }else {
            this.$message.error(result.message)
          }
          this.dialogVisible = false
        })
      }else {
        updateLoop('/admin/looper/' + this.loop.id, this.loop).then(result => {
          if (result.code === success_code){
            this.$message.success(result.message)
            this.listLoops(this.pageInfo.currentPage)
          }else {
            this.$message.error(result.message)
          }
          this.dialogVisible = false
        })
      }
    },
    resetLoop(){
      this.loop.id = ''
      this.loop.title = ''
      this.loop.targetUrl = ''
      this.loop.imageUrl = ''
      this.loop.order = 1
      this.loop.state = '1'
    },
    currentChange(val){
      this.listLoops(val)
    },
    handleDialogShow(){
      this.dialogTitle = '添加轮播图'
      this.dialogVisible = true
    },
    updateLoop(item){
      this.dialogTitle = '编辑轮播图'
      this.loop.id = item.id
      this.loop.title = item.title
      this.loop.imageUrl = item.imageUrl
      this.loop.order = item.order
      this.loop.state = item.state
      this.loop.targetUrl = item.targetUrl
      this.dialogVisible = true
    },
    deleteItem(item){
      this.$confirm('此操作将永久删除 <strong style="color: #F56C6C">' + item.title + '</strong> 分类, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        deleteLoop('/admin/looper/' + item.id).then(result => {
          if (result.code === success_code ) {
            this.$message({
              type: "success",
              message: result.message
            })
            // 更新页面
            this.listLoops(this.pageInfo.currentPage)
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
    refreshItem(item) {
      console.log(item)
    },
    dateFormat(item){
      return dateUtil.dateFormat(item)
    },
    listLoops(page){
      this.loading = true
      listLoops('/admin/looper/list/'+ page + '/' + this.pageInfo.pageSize).then(result => {
        if (result.code === success_code){
          this.loading = false
          this.pageInfo.total = result.data.total
          this.loops = result.data.list
        }else {
          this.$message.error(result.message)
        }
      })
    }
  },
  mounted() {
    this.listLoops(1)
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
  width: 300px;
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
</style>