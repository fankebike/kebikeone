<template>
<div class="from">
<div class="header">
  <div class="logo">
  <div class="log"><img src="../assets/头像.png" alt="头像"></div>
  <span class="magSize">电商后台管理系统</span>
  </div>
<el-tooltip effect="dark" content="亲，确定要狠心离开吗?" placement="top" :enterable = 'false'>
<el-button type="success" @click="out" round>退出登录</el-button>
</el-tooltip>
</div>
<div class="flex">
<div class="nav">
 <el-menu
       background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened router>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span class="show">用户管理</span>
        </template>
         <el-menu-item-group>
          <el-menu-item index="/user"><i class="el-icon-female"></i>用户列表</el-menu-item>
          </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
         <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title" class="show">权限管理</span>
         </template>
          <el-menu-item-group>

          <el-menu-item index="/part"><i class="el-icon-user"></i>角色列表</el-menu-item>
          <el-menu-item index="/root-li"><i class="el-icon-mouse"></i>权限列表</el-menu-item>
          </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
         <template slot="title">
        <i class="el-icon-s-goods"></i>
        <span slot="title" class="show">商品管理</span>
         </template>
          <el-menu-item-group>
          <el-menu-item index="/shop"><i class="el-icon-tickets"></i>商品列表</el-menu-item>
          <el-menu-item index="/class"><i class="el-icon-folder"></i>分类参数</el-menu-item>
          <el-menu-item index="/shopClass"><i class="el-icon-collection-tag"></i>商品分类</el-menu-item>
          </el-menu-item-group>
      </el-submenu>
       <el-submenu index="4">
         <template slot="title">
        <i class="el-icon-upload"></i>
        <span slot="title" class="show">订单管理</span>
         </template>
          <el-menu-item-group>
          <el-menu-item index="/order"><i class="el-icon-reading"></i>订单列表</el-menu-item>
          </el-menu-item-group>
      </el-submenu>
       <el-submenu index="5">
         <template slot="title">
        <i class="el-icon-s-data"></i>
        <span slot="title" class="show">数据设计</span>
         </template>
          <el-menu-item-group>
          <el-menu-item index="charts"><i class="el-icon-coin"></i>数据报表</el-menu-item>
          </el-menu-item-group>
      </el-submenu>
    </el-menu>
</div>
<div class="mainer"><router-view></router-view></div>
</div>
<div class="footer">
  <p class="foot">@http://localhost:8080/#/welcome</p>
</div>
</div>
<!-- <el-container>
  <el-header>header</el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container> -->
</template>
<script>
export default {

  methods: {
    // 退出登录，回到没有登录状态（销毁令牌，跳转到首页）
    out () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
 @media screen and(max-width: 565px){
    .el-menu{width: 50px;}
    .nav{width: 50px;}
    .mainer{width: 90%;}
   .show{display: none;}
  .el-submenu .el-menu-item {min-width: 135px;z-index: 1;}
   .logo{width: 150px;font-size: 10px;}
  // .log{width: 105px;border-radius: 50%}
 }
 @media screen and(min-width: 565px){
   ul{overflow: hidden;}
 }
  .from{width: 100%;height: 100%;display: flex;flex-direction: column;font-size: 15px;}
   .header{min-height: 12%;background-color: #B3C0D1;display: flex;justify-content: space-between;align-items: center;padding-right:  10px;width: 100%;}
   .logo{display: flex;align-items: center;padding-left: 10px;justify-content: space-between;font-weight: bold;color:#fff;font-size: 16px;}
   .log{min-width: 60px;height: 60px;border-radius: 50%;position: relative;overflow: hidden;}
    img{position: absolute;border-radius: 50%;width: 60px;height: 60px;flex-wrap: nowrap;}
   .magSize{display: inline;margin-left: 10px;}
   .flex{flex:1;display: flex;max-height: 510px;overflow-y:auto;}
   .nav{width: 20%;background-color: #545c64;}
   .el-menu {border-right: none;width: 100%;}
    /* ul{overflow: hidden;}   */

   .mainer{width: 80%; background-color: #E9EEF3;position: relative;overflow-x: hidden;}
   .footer{min-height: 7%;background-color: #B3C0D1;text-align: center;position: relative;}
   .foot{height: 100%;width: 100%; line-height: 300%;position: absolute;}

</style>
