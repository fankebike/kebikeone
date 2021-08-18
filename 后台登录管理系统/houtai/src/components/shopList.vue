<template>
 <div>
   <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right margin">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片区域 -->
  <el-card>
  <!-- hang -->
   <el-row :gutter="20">
  <!-- lie  @clear="shopList"清理后表单重新加载到初始状态-->
    <el-col :span='8'>
    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="shopList">
      <el-button slot="append" icon="el-icon-search" @click="shopList"></el-button>
    </el-input>
    </el-col>
    <el-col :span='4'>
       <el-button type="primary" @click="topAdd">添加商品</el-button>
    </el-col>
   </el-row>
   <!-- 表单区域 :data = 'powerData'-->
   <el-table border stripe :data = 'shopData'>
      <el-table-column type = 'index'></el-table-column>
      <el-table-column label = '商品名称' prop='goods_name'></el-table-column>
      <el-table-column label = '商品价格(元)' prop='goods_price' width="110px"></el-table-column>
      <el-table-column label = '商品重量' prop='goods_weight' width="80px"></el-table-column>
      <!-- 利用时间过滤器将时间拼接组合 -->
      <el-table-column label = '创建时间' prop='add_time' width="110px">
       <template slot-scope="scope">
         {{scope.row.add_time | dateFormat}}
       </template>
      </el-table-column>
      <el-table-column label = '操作' width="120px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size = 'mini'></el-button>
              <el-button type="danger" icon="el-icon-delete" size = 'mini' @click="delData(scope.row.goods_id)"></el-button>
          </template>
      </el-table-column>
   </el-table>
   <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="this.queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total
      background>
    </el-pagination>
  </el-card>
 </div>
</template>
<script>
export default {
  data () {
    return {
      // 页面数据
      shopData: [],
      // 请求商品的参数
      queryInfo: {
        // 查询关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 单页内数据数量
        pagesize: 3
      },
      total: 0
    }
  },
  created () {
    this.shopList()
  },
  methods: {
    // 当前页码内数据数量发生变化时事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.shopList()
    },
    // 页码发生变化时内容也变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.shopList()
    },
    // 商品表格数据渲染
    async shopList () {
      const { data: res } = await this.$Axios.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.console.error('获取商品列表失败')
      this.shopData = res.data.goods
      this.total = res.data.total
    },
    // 表单删除功能 获取表单id删除
    async delData (goodsId) {
      const confirmJudge = await this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmJudge !== 'confirm') return this.$message.info('已取消删除商品信息')
      const { data: res } = await this.$Axios.delete(`goods/${goodsId}`)
      if (res.meta.status !== 200) return this.$message.console.error('删除商品信息失败')
      this.$message.success('删除商品信息成功')
      this.shopList()
    },
    // 点击添加商品跳转页面
    topAdd () {
      this.$router.push('/shop/addShop')
    }
  }

}
</script>
<style lang='less' scoped>
.el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
.el-card{margin-top: 20px;}
.el-table{margin-top: 20px;}
.el-pagination{margin-top: 15px;}
</style>
