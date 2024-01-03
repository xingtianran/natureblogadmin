<template>
  <div style="overflow: hidden">
    <div class="post-article-title-box">
      <el-input v-model="article.title" placeholder="文章标题（8 - 64）" :minlength="8" :maxlength="64"
                show-word-limit></el-input>
    </div>
    <div class="post-article-content-box">
      <mavon-editor ref="mdEditor" :boxShadow="false" v-model="article.content">
        <!-- 左工具栏前加入自定义按钮 -->
        <template slot="left-toolbar-before">
          <button
              type="button"
              @click="addImageForArticle"
              class="op-icon fa fa-mavon-picture-o"
              aria-hidden="true"
              title="图片"
          ></button>
        </template>
      </mavon-editor>
    </div>
    <div class="post-article-setting-box">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form label-position="right" label-width="80px" :model="article">
            <el-form-item label="分类" required>
              <el-select v-model="article.categoryId" placeholder="请选择分类">
                <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摘要" required>
              <el-input type="textarea" :rows="3" v-model="article.summary"></el-input>
            </el-form-item>
            <el-form-item label="封面">
              <div id="avatar" @click="addImageForCover">
                <el-image fit="cover" v-if="article.cover" :src="'/admin/image/' + article.cover"/>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-form-item>
            <el-form-item label="标签" required>
              <el-tag
                  type="info"
                  :key="label"
                  v-for="label in labels"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(label)">
                {{ label }}
              </el-tag>
              <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveLabelInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm">
              </el-input>
              <el-button v-if="newLabelVisible" class="button-new-tag" size="small" @click="showInput">+ 添加标签
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="post-article-button-box">
      <el-button size="medium" @click="previewArticle" plain round>全屏预览</el-button>
      <el-button v-if="article.state !== '1'" type="primary" @click="saveArticleDraft" size="medium" plain round>
        保存草稿
      </el-button>
      <el-button v-if="article.state === '1'" type="success" @click="updateArticle" size="medium" plain round>更新文章
      </el-button>
      <el-button v-else type="success" @click="postArticle" size="medium" plain round>发表文章</el-button>
    </div>
    <div class="post-article-dialog-box">
      <el-dialog
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          @close="resetSetting"
          width="43.5%">
        <div>
          <div>
            <el-upload
                class="upload-demo"
                action="/admin/image?origin=article"
                :show-file-list="false"
                :on-success="handleImageSuccess"
                :before-upload="beforeAvatarUpload">
              <el-button size="mini" type="success">上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2Mb</div>
            </el-upload>
          </div>
          <div class="radio-selector-box"
               v-loading="loading"
               element-loading-text="拼命加载中">
            <el-radio-group v-model="selectedImageIndex">
              <el-radio-button class="radio-button-all-box" v-for="(image, index) in images" :key="index"
                               :label="index">
                <el-image class="radio-image-box" fit="cover" :src="'/admin/image/' + image.url"></el-image>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="left-image-bottom-box">
            <el-pagination
                background
                @current-change="currentChange"
                layout="prev, pager, next"
                :current-page.sync="pageInfo.currentPage"
                :page-size="pageInfo.pageSize"
                :total="pageInfo.total">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="confirmImage" size="mini">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAllCategories,
  getArticleById,
  listImages,
  postArticle,
  success_code,
  updateArticle
} from "@/api/api";

export default {
  beforeRouteLeave(to, form, next) {
    this.removeLocalAndInterval()
    let dataSign = false
    let keyList = Object.keys(this.article)
    keyList.forEach(key => {
      if (this.article[key] !== ''){
        dataSign = true
      }
    })
    if (this.commitSign){
      next()
    }else if (dataSign){
      this.$confirm('你现在离开可能会丢失文章数据 ，是否要继续离开?', '提示', {
        dangerouslyUseHTMLString: true,
        roundButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 直接离开
        next()
      }).catch(() => {
        this.$message.info("已取消离开")
      });
    }else {
      next()
    }
  },
  data() {
    return {
      commitSign: false,
      storage: null,
      interval: null,
      isImageFor: '',
      loading: false,
      selectedImageIndex: 0,
      pageInfo: {
        total: 0,
        pageSize: 12,
        currentPage: 0
      },
      dialogVisible: false,
      coverUrl: '',
      newLabelVisible: true,
      inputValue: '',
      inputVisible: false,
      labels: [],
      categories: [],
      labelTemp: '',
      article: {
        id: '',
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        cover: '',
        state: '',
        type: '',
        label: ''
      },
      images: []
    }
  }, methods: {
    previewArticle() {
      this.$refs.mdEditor.toolbar_right_click('read')
    },
    saveArticleDraft() {
      // 检查数据
      if (this.article.title === '') {
        this.$message.error("文章标题不能为空")
        return
      }
      this.article.state = '2'
      this.article.type = '1'
      // 处理标签
      if (this.labels.length !== 0) {
        this.labels.forEach((label, index) => {
          this.article.label += label;
          if (index !== this.labels.length - 1) {
            this.article.label += '-'
          }
        })
      }
      // 提交数据
      postArticle('/admin/article', this.article).then(result => {
        if (result.code === success_code) {
          this.removeLocalAndInterval()
          this.commitSign = true
          this.$message.success(result.message)
          // 跳转到文章列表
          this.$router.push({path: '/content/manage-article'})
        } else {
          this.$message.error(result.message)
        }
      })
    },
    removeLocalAndInterval() {
      // 删除local数据
      this.storage.removeItem("nature_article")
      // 关闭定时器
      clearInterval(this.interval)
    },
    updateArticle() {
      // 检查数据
      if (this.article.title === '') {
        this.$message.error("文章标题不能为空")
        return
      }
      if (this.article.content === '') {
        this.$message.error("文章内容不能为空")
        return
      }
      if (this.article.categoryId === '') {
        this.$message.error("分类还没有选择")
        return
      }
      if (this.article.cover === '') {
        this.$message.error("摘要不能为空")
        return
      }
      if (this.labels.length === 0) {
        this.$message.error("文章标签不能为空")
        return
      }
      // 需要数据 标题、内容、分类、摘要、状态、文本类型(1表示markdown，0表示富文本)、封面可选、标签
      this.article.state = '1'
      this.article.type = '1'
      // 处理标签
      this.labels.forEach((label, index) => {
        this.article.label += label;
        if (index !== this.labels.length - 1) {
          this.article.label += '-'
        }
      })
      // 提交数据
      updateArticle('/admin/article/' + this.article.id, this.article).then(result => {
        if (result.code === success_code) {
          this.removeLocalAndInterval()
          this.commitSign = true
          this.$message.success(result.message)
          // 跳转到文章列表
          this.$router.push({path: '/content/manage-article'})
        } else {
          this.$message.error(result.message)
          this.article.label = ''
        }
      })
    },
    postArticle() {
      // 检查数据
      if (this.article.title === '') {
        this.$message.error("文章标题不能为空")
        return
      }
      if (this.article.content === '') {
        this.$message.error("文章内容不能为空")
        return
      }
      if (this.article.categoryId === '') {
        this.$message.error("分类还没有选择")
        return
      }
      if (this.article.cover === '') {
        this.$message.error("摘要不能为空")
        return
      }
      if (this.labels.length === 0) {
        this.$message.error("文章标签不能为空")
        return
      }
      // 需要数据 标题、内容、分类、摘要、状态、文本类型(1表示markdown，0表示富文本)、封面可选、标签
      this.article.state = '1'
      this.article.type = '1'
      // 处理标签
      this.labels.forEach((label, index) => {
        this.article.label += label;
        if (index !== this.labels.length - 1) {
          this.article.label += '-'
        }
      })
      // 提交数据
      postArticle('/admin/article', this.article).then(result => {
        if (result.code === success_code) {
          this.removeLocalAndInterval()
          this.commitSign = true
          this.$message.success(result.message)
          // 跳转到文章列表
          this.$router.push({path: '/content/manage-article'})
        } else {
          this.$message.error(result.message)
        }
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif'

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG PNG GIF 格式!');
        return isPNG && isPNG && isGIF
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return isLt2M
      }
    },
    handleImageSuccess(result) {
      this.$message.success(result.message)
      this.listImages(1)
    },
    resetSetting() {
      this.pageInfo.currentPage = 0
    },
    confirmImage() {
      let image = this.images[this.selectedImageIndex]
      if (this.isImageFor === 'article') {
        this.$refs.mdEditor.toolbar_left_addlink('no-link', image.name, '/admin/image/' + image.url)
      } else if (this.isImageFor === 'cover') {
        this.article.cover = image.url
      }
      this.dialogVisible = false
    },
    currentChange(val) {
      this.listImages(val)
    },
    listImages(page) {
      this.loading = true
      listImages('/admin/image/list/' + page + '/' + this.pageInfo.pageSize + '?origin=article').then(result => {
        if (result.code === success_code) {
          this.loading = false
          this.images = result.data.list
          this.pageInfo.total = result.data.total
        } else {
          this.$message.error(result.message)
        }
      })
    },
    addImageForArticle() {
      this.isImageFor = 'article'
      this.dialogVisible = true
      this.listImages(1)
    },
    addImageForCover() {
      this.isImageFor = 'cover'
      this.dialogVisible = true
      this.listImages(1)
    },
    handleClose(label) {
      this.labels.splice(this.labels.indexOf(label), 1)
      if (this.labels.length < 5) {
        this.newLabelVisible = true
      }
    },
    showInput() {
      this.inputVisible = true
      this.newLabelVisible = false
      this.$nextTick(() => {
        this.$refs.saveLabelInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputValue === '') {
        return
      }
      this.labels.push(this.inputValue)
      this.inputValue = ''
      if (this.labels.length >= 5) {
        this.newLabelVisible = false
        this.inputVisible = false
      }
    },
    getAllCategories() {
      getAllCategories('/admin/category/all').then(result => {
        if (result.code === success_code) {
          this.categories = result.data
        } else {
          this.$message.error(result.message)
        }
      })
    },
    getArticleById(articleId) {
      getArticleById('/admin/article/' + articleId + '?isCache=0').then(result => {
        if (result.code === success_code) {
          let data = result.data
          this.article.id = data.id
          this.article.title = data.title
          this.article.content = data.content
          this.article.categoryId = data.categoryId
          this.article.summary = data.summary
          this.article.cover = data.cover
          this.labelTemp = data.label
          this.article.state = data.state
          this.article.type = data.type
          // 打散标签 格式化标签
          if (this.labelTemp !== '') {
            if (this.labelTemp.indexOf('-') === -1) {
              this.labels.push(this.labelTemp)
            } else {
              let labelList = this.labelTemp.split('-');
              this.labels = this.labels.concat(labelList)
            }
          }
          if (this.labels.length >= 5) {
            this.newLabelVisible = false
          }
        } else {
          this.$message.error(result.message)
        }
      })
    },
    saveLocal() {
      let articleCopy = this.article
      articleCopy.label = this.labelTemp
      let jsonArticle = JSON.stringify(articleCopy);
      this.storage.setItem("nature_article", jsonArticle);
      this.$message.info("自动保存成功")
    },
    setSaveInterval() {
      // 创建一个定时器，定时器相隔多少时间，调用一个方法
      let time = 1000 * 60 * 10
      // 每5分钟调用一次保存方法
      this.interval = setInterval(() => {
        this.saveLocal()
      }, time)
    }
  }
  , mounted() {
    // 如果本地有数据，就回显本地数据
    this.storage = window.localStorage;
    let jsonArticle = this.storage.getItem("nature_article")
    // 如果local不为空，询问，用户是否恢复数据
    // 进入该页面后，恢复数据优先，编辑文章其次
    // 判断对象内数据是否全为空
    let hasData = false
    let objArticle = null
    if (jsonArticle != null) {
      objArticle = JSON.parse(jsonArticle)
      let keyList = Object.keys(objArticle)
      keyList.forEach(key => {
        if (objArticle[key] !== '') {
          hasData = true
        }
      })
    }
    if (hasData) {
      console.log("has local...")
      this.$confirm('检测到你有未保存数据，是否恢复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        // 取出local数据
        this.article = objArticle
        this.getAllCategories()
      }).catch(() => {
        this.$message.info("已取消数据恢复")
        // 删除原来的数据
        this.storage.removeItem("nature_article")
        // 查看是否通过编辑模式过来
        let articleId = this.$route.query.id
        if (articleId !== '' && articleId != null) {
          // 回显数据
          this.getArticleById(articleId)
        }
        this.getAllCategories()
      });
    } else {
      let articleId = this.$route.query.id
      if (articleId !== '' && articleId != null) {
        // 回显数据
        this.getArticleById(articleId)
      }
      this.getAllCategories()
    }
    // 定时器启动
    this.setSaveInterval()
  }
}
</script>

<style>

.post-article-content-box .markdown-body {
  height: 600px;
}

.post-article-setting-box {
  margin-top: 60px;
}

.post-article-button-box {
  padding-bottom: 10px;
  position: fixed;
  z-index: 10000;
  bottom: 0;
  right: 1%;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

#avatar {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

#avatar:hover {
  border-color: #409EFF;
}

#avatar .el-image {
  width: 178px;
  height: 178px;
}

.post-article-dialog-box .el-dialog__header {
  padding: 0;
}

.radio-image-box {
  width: 150px;
  height: 100px;
}

.radio-selector-box {
  padding-top: 20px;
}

.radio-selector-box .el-radio-button__inner {
  padding: 2px;
}

.post-article-content-box .op-icon.dropdown-wrapper.dropdown[type=button][data-v-548e2160] {
  display: none;
}

.post-article-title-box .el-input__inner {
  font-size: 20px;
  font-weight: bold;
  border: 0;
}

.radio-selector-box .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #FFF;
  background-color: #67C23A;
  border-color: #67C23A;
  box-shadow: -1px 0 0 0 #67C23A;
}

.radio-button-all-box {
  padding: 1px;
}
</style>