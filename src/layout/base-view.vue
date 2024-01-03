<template>
  <div class="base-box">
    <el-container>
      <el-header id="admin-header-box">
        <top-view></top-view>
      </el-header>
      <el-container>
        <el-aside id="left-menu-list-box" width="202px">
          <left-menu></left-menu>
        </el-aside>
        <el-main id="right-content-box">
          <div>
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    mounted() {
      // 动态设置导航栏的高度 与浏览器同高
      let leftMenuList = document.getElementById("left-menu-list-box");
      let adminHeader = document.getElementById("admin-header-box");
      if (leftMenuList && adminHeader){
        leftMenuList.style.height = (window.innerHeight - adminHeader.offsetHeight) + "px"
      }
    }
  }
</script>

<style>
.base-box .el-header{
  background-color: #409EFF;
  color: #303133;
  height: 46px !important;
}

.base-box .el-aside {
  line-height: 200px;
  border-right: solid 1px #e6e6e6;
}
.base-box .el-main{
  padding: 0;
}
</style>
