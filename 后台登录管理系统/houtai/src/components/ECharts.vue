<template>
  <div>
     <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片中图形列表区域 -->
  <el-card>
    <div id="main" style="width: 750px;height:400px;">
    </div>
  </el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import _ from 'lodash'
// const echarts = require('echarts')
export default {
  data () {
    return {
    // 功能完整的前提下必须让数据库数据和api中option数据合并
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {},
  // dom创建之后的函数
  async mounted () {
    // 初始化echarts
    var myChart = echarts.init(document.getElementById('main'))
    // 获取图标数据
    const { data: res } = await this.$Axios.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('图标数据请求失败')
    // 数据配置合并
    const dates = _.merge(res.data, this.options)
    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(dates)
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
.el-card{margin-top: 20px;}
</style>
