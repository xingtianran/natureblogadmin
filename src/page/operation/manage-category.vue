<template>
  <div>
    <div class="right-content-header-box">
      <el-button type="primary" size="mini" @click="handleDialogShow">添加分类</el-button>
    </div>
    <div class="right-content-main-box">
      <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :data="categories"
          border
          style="width: 100%">
        <el-table-column
            fixed="left"
            prop="id"
            label="序号"
            width="150">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="pinyin"
            label="拼音"
            width="120">
        </el-table-column>
        <el-table-column
            prop="description"
            label="描述">
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
            width="120">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="更新时间"
            width="120">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="145">
          <template slot-scope="scope">
            <el-button size="mini" @click="updateCategory(scope.row)">编辑</el-button>
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
    <div class="content-dialog-box">
      <el-dialog
          :title="dialogTitle"
          @close="resetCategory"
          :closeOnClickModal="false"
          :visible.sync="dialogVisible"
          width="30%">
        <div class="dialog-inter-box">
          <el-form label-position="right" label-width="80px" :model="category">
            <el-form-item label="名称">
              <el-input v-model="category.name"></el-input>
            </el-form-item>
            <el-form-item label="拼音">
              <el-input v-model="category.pinyin"></el-input>
            </el-form-item>
            <el-form-item label="简介">
              <el-input
                  type="textarea"
                  maxlength="128"
                  placeholder="请输入简介"
                  v-model="category.description">
              </el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="category.order" controls-position="right" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="category.state" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini" round>取 消</el-button>
          <el-button type="primary" @click="handleCategory" size="mini" round>确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getCategories, updateCategory} from "@/api/api";
import {disableCategory} from "@/api/api";
import {refreshCategory} from "@/api/api";
import {addCategory} from "@/api/api";
import {success_code} from "@/api/api";

import * as dateUtil from "@/utils/date"

export default {
  data() {
    return {
      dialogTitle: '',
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
      dialogVisible: false,
      loading: false,
      categories: [],
      pageInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 0
      },
      category: {
        id: '',
        name: '',
        pinyin: '',
        description: '',
        order: 1,
        state: '1'
      }
    }
  },
  methods: {
    updateCategory(item){
      this.dialogTitle = '编辑分类'
      this.category.id = item.id
      this.category.name = item.name
      this.category.pinyin = item.pinyin
      this.category.description = item.description
      this.category.state = item.state
      this.category.order = item.order
      this.dialogVisible = true
    },
    resetCategory(){
      this.category.id = '';
      this.category.name = '';
      this.category.pinyin = '';
      this.category.description = '';
      this.category.order = 1;
      this.category.state = '1';
    },
    handleCategory(){
      // 检查数据
      if (this.category.name === '') {
        this.$message.error("分类名称不能为空")
        return;
      }
      if (this.category.pinyin === ''){
        this.$message.error("分类拼音不能为空")
        return;
      }
      if (this.category.description === ''){
        this.$message.error("分类描述不能为空")
        return;
      }
      // 添加数据
      if (this.category.id === ''){
        addCategory('/admin/category', this.category).then(result => {
          if (result.code === success_code){
            this.dialogVisible = false
            this.$message.success(result.message)
            // 清空添加框内的数据,close回调，已经关闭
            this.listCategories(1)
          }else {
            this.dialogVisible = false
            this.$message.error(result.message)
          }
        })
      }else {
        updateCategory('/admin/category/'+this.category.id, this.category).then(result => {
          if (result.code === success_code){
            this.dialogVisible = false
            this.$message.success(result.message)
            // 清空添加框内的数据,close回调，已经关闭
            this.listCategories(this.pageInfo.currentPage)
          }else {
            this.dialogVisible = false
            this.$message.error(result.message)
          }
        })
      }

    },
    handleDialogShow() {
      this.dialogTitle = '添加分类'
      this.dialogVisible = true
    },
    refreshItem(item) {
      this.$confirm('此操作将恢复 <strong style="color: #67C23A">' + item.name + '</strong> 分类, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        // 删除
        refreshCategory('/admin/category/state/' + item.id).then(result => {
          if (result.code === 20000) {
            this.$message({
              type: "success",
              message: result.message
            })
            // 更新页面
            this.listCategories(this.pageInfo.currentPage)
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
      this.$confirm('此操作将禁用 <strong style="color: #F56C6C">' + item.name + '</strong> 分类, 是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        disableCategory('/admin/category/' + item.id).then(result => {
          if (result.code === 20000) {
            this.$message({
              type: "success",
              message: result.message
            })
            // 更新页面
            this.listCategories(this.pageInfo.currentPage)
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
      this.listCategories(val)
    },
    listCategories(page) {
      this.pageInfo.currentPage = page
      this.loading = true
      getCategories('/admin/category/list/' + page + '/' + this.pageInfo.pageSize).then(result => {
        if (result.code === 20000) {
          this.loading = false
          this.categories = result.data.list
          this.pageInfo.total = result.data.total
        } else {
          this.loading = false
          this.$message({
            message: '获取分类列表失败',
            type: 'error'
          })
        }
      })
    }
  },
  mounted() {
    this.listCategories(1)
  }
}
</script>

<style>
.right-content-header-box {
  padding-bottom: 10px;
}
</style>