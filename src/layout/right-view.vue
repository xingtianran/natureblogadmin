<template>
  <div>
    <div class="content-right-box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.meta.parentName}} - {{$route.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-main-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
</script>
<style>
.content-right-box{
  font: 14px Base;
  padding: 10px;
  border-bottom: solid 1px #e6e6e6;
}
.content-main-box{
  font: 14px Base;
  padding: 10px;
}
</style>
