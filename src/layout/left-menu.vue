<template>
  <div>
    <el-menu
        :default-active="menuIndex"
        :unique-opened="true"
        class="el-menu-vertical">
      <template v-for="(item, index) in menuList">
        <router-link :to="item.path" v-if="!item.children && !item.hidden" :key="index">
          <el-menu-item :index="index + ''">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
          </el-menu-item>
        </router-link>
        <el-submenu v-else-if="!item.hidden" :index="index + ''" :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <template v-for="(childItem, childIndex) in item.children">
            <router-link :to="item.path + '/' + childItem.path" v-if="!childItem.hidden" :key="childIndex">
              <el-menu-item :index="index + '-' + childIndex">
                <template slot="title">
                  <i :class="childItem.icon"></i>
                  <span>{{childItem.name}}</span>
                </template>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
  import {routes} from "@/router";
  export default {
    data(){
      return{
        menuList: [],
        menuIndex: '',
      }
    },
    mounted() {
      let menuList = routes[0];
      this.menuList = menuList.children
      this.menuIndex = this.$route.meta.menuIndex
    }
  }
</script>

<style>
  .el-menu-vertical a{
    text-decoration: none;
  }
  .el-menu-vertical{
    border-right: 0;
  }
</style>