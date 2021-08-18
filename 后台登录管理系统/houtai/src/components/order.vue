<template>
  <div>
     <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right margin">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
     <el-col :span='12'>
       <el-input placeholder="请输入内容" clearable v-model="orderInfo.query" @clear="orderList">
         <el-button slot="append" icon="el-icon-search" @click="orderList"></el-button>
       </el-input>
    </el-col>
    </el-row>
    <el-table border stripe :data = 'orderData'>
     <!-- type = 'index' 设置索引-->
      <el-table-column type = 'index' align = 'center'></el-table-column>
      <el-table-column label = '订单编号' prop = 'order_number'></el-table-column>
      <el-table-column label = '订单价格' prop="order_price" width="110px"></el-table-column>
      <el-table-column label = '是否付款' width="110px">
        <template slot-scope="scope">
           <el-tag>
               <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
               <el-tag type="success" v-else>已付款</el-tag>
           </el-tag>
        </template>
        <!-- <el-tag type="danger">{{pay_status}}</el-tag> -->
      </el-table-column>
      <el-table-column label = '是否发货' prop="is_send" width="110px"></el-table-column>
      <el-table-column label = '下单时间' width="110px">
        <template slot-scope="scope">
         {{scope.row.create_time | dateFormat}}
       </template>
      </el-table-column>
      <el-table-column label = '操作' width="130px">
       <template>
        <el-button type="primary" icon="el-icon-edit" size = 'mini' @click="dialogVisible = true"></el-button>
        <el-button type="success" icon="el-icon-location" size = 'mini' @click="logistics"></el-button>
       </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="orderInfo.pagenum"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="this.orderInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total
      background>
    </el-pagination>
  </el-card>
  <!-- 地址修改弹窗 -->
   <el-dialog
  title="地址修改"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose"
   @close="clearData">
  <el-form :model="addressForm" :rules="rules" ref="addressRef" label-width="100px">
 <!-- 联动选择器 -->
    <el-form-item label="省市区/县" prop="address1">
    <el-cascader
    v-model="addressForm.address1"
    :options="cityData"
    :props="{ expandTrigger: 'hover', checkStrictly: true}"
    clearable>
    </el-cascader>
    </el-form-item>
 <!-- 详细地址 -->
    <el-form-item label="详细地址" prop="address2">
      <el-input v-model="addressForm.address2"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
<!-- 物流信息查询弹窗 -->
<el-dialog
  title="物流查询"
  :visible.sync="serDialogVisible"
  width="50%"
  :before-close="handleClose">
  <!-- 时间线 -->
   <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in logisticsData"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>
<script>
// 导入地址文件
import cityData from './citydata'
export default {
  data () {
    return {
      // 订单管理列表数据
      orderData: [],
      // 共计条数
      total: 0,
      // 订单管理列表参数
      orderInfo: {
        // 搜索关键字
        query: '',
        //  当前页码
        pagenum: 1,
        // 每页显示几条
        pagesize: 4
      },
      //   修改地址弹窗开关控制
      dialogVisible: false,
      // 物流查询按钮开关控制
      serDialogVisible: false,
      // 地址表单客户数据
      addressForm: {
        //  客户选择的选择器数据id
        address1: [],
        // 详细地址的内容
        address2: ''
      },
      rules: {
        address1: [{ required: true, message: '请输入省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      //   联级选择器数据
      cityData,
      //  物流查询文本
      logisticsData: []
    }
  },
  created () {
    this.orderList()
  },
  methods: {
    // 当前页码内数据数量发生变化时事件
    handleSizeChange (newSize) {
      this.orderInfo.pagesize = newSize
      this.orderList()
    },
    // 页码发生变化时内容也变化
    handleCurrentChange (newPage) {
      this.orderInfo.pagenum = newPage
      this.orderList()
    },
    //   管理列表数据获取
    async orderList () {
      const { data: res } = await this.$Axios.get('orders', { params: this.orderInfo })
      if (res.meta.status !== 200) return this.$message.error('获取管理列表失败')
      this.orderData = res.data.goods
      this.total = res.data.total
    },
    // 地址修改中点击叉号事件
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 选择器被选择时
    handleChange () {
    //    console.log(addressId)
    },
    // 二次点击修改地址重置表单内容
    clearData () {
      this.$refs.addressRef.resetFields()
    },
    // 物流弹框文本内容请求async
    async logistics () {
      const { data: res } = await this.$Axios.get('http://localhost:8080/data.json')
      if (res.meta.status !== 200) return this.$message.error('物流信息查询失败')
      this.logisticsData = res.data
      console.log(this.logisticsData)
      this.serDialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
.el-card{margin-top: 20px;}
.el-table{margin-top: 20px;}
.el-pagination{margin-top: 15px;}
.el-cascader{width: 100%;}
 .el-tag{padding: 0;width: 70px;text-align: center;}
// span{padding: 0;width: 70px;text-align: center;}
</style>
