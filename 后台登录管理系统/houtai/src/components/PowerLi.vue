<template>
 <div>
     <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right margin">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
 </el-breadcrumb>
 <div>
 <el-card>
     <!-- 卡片 -->
    <el-table border stripe :data = 'powerData'>
     <!-- type = 'index' 设置索引-->
      <el-table-column type = 'index' align = 'center'></el-table-column>
      <el-table-column label = '权限名称' prop = 'authName' align = 'center'></el-table-column>
      <el-table-column label = '路径' prop="path" align = 'center'></el-table-column>
      <el-table-column label = '权限等级' prop="level" align = 'center'>
     <!-- 通过作用域插槽获取行等级，渲染不同意义颜色de按钮 -->
        <template slot-scope="scope">
           <el-tag>
               <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
               <el-tag type="info" v-else-if="scope.row.level=== '1'">二级</el-tag>
               <el-tag type="warning" v-else>三级</el-tag>
           </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
 </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      powerData: []
    }
  },
  created () {
    this.powerList()
  },
  methods: {
    async powerList () {
      const { data: res } = await this.$Axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取用户数据成功')
      this.powerData = res.data
    }
  }
}
</script>
<style lang = "less" scoped>
 .el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
 .el-card{margin-top: 20px;}
  .el-tag{padding: 0;width: 70px;}
</style>
