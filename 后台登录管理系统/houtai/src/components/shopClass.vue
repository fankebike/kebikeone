<template>
 <div>
  <el-breadcrumb separator-class="el-icon-arrow-right margin">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row class="bottom">
      <el-button type="primary" @click="edit">添加分类</el-button>
    </el-row>
   <!-- 表格 :columns为列-->
   <tree-table
   :data="classData"
   :columns="columns"
   :selection-type='false'
   :expand-type="false"
   show-index
   index-text="#"
   border>
   <!-- 第二列的自定义模板列的作用域插槽 slot="synchro"同步每行相对于的“是否有效”,slot-scope="scope"获取每行的是否有效-->
    <template slot="synchro" slot-scope="scope">
      <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
      <i class="el-icon-error" v-else style="color: red;"></i>
    </template>
   <!-- 第三列的自定义模板列的作用域插槽 slot="order"同步每行相对于的“排序等级”,slot-scope="scope"获取每行的等级-->
    <template slot="order" slot-scope="scope">
      <el-tag type="success" size='mini' v-if="scope.row.cat_level===0">一级</el-tag>
      <el-tag type="info" size='mini' v-else-if="scope.row.cat_level===1">二级</el-tag>
      <el-tag type="warning" size='mini' v-else>三级</el-tag>
    </template>
    <!-- 第三列的自定义模板列的作用域插槽 slot="operate"同步每行相对于的“操作项”,slot-scope="scope"获取每行的可操作项-->
    <template slot="operate">
     <el-button type="primary" icon="el-icon-edit" size=mini>编辑</el-button>
     <el-button type="danger" icon="el-icon-delete" size=mini>删除</el-button>
    </template>
   </tree-table>
   <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!-- 点击添加用户后的对话框 -->
  <el-dialog
  title="添加分类"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose"
  @close="rest">
  <el-form :model="customData" status-icon :rules="rules" ref="editData" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="customData.cat_name" clearable></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
    <!-- 父级分类列表 :props="relation"父子节点的具体分类,
    v-model="fathId"客户所选择的关系id props.checkStrictly=true   children: 'children',  -->
    <el-cascader
    v-model= "fathId"
    :options= "fathData"
    :key="cascaderKey"
    props.checkStrictly
    :props="{expandTrigger: 'hover',value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true}"
    @change= "handle"
    clearable>
    </el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="holdData">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>
<script>
// import { Template } from 'webpack'
export default {
  data () {
    return {
      // 商品分类数据
      classData: [],
      // 分页参数
      queryInfo: {
      // 1到3级的数据全部获取
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页显示多少条
        pagesize: 5
      },
      // 共计多少条
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将是否有效通过作用域插槽做成自定义模板列
          type: 'template',
          template: 'synchro'
        },
        {
          label: '排序',
          // 将排序通过作用域插槽做成自定义模板列
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 将操作中的按钮通过作用域做成自定义模板列
          type: 'template',
          template: 'operate'
        }
      ],
      dialogVisible: false,
      customData: {
        cat_name: '',
        // 父级分类列表的id之一级分类
        cat_pid: 0,
        // 分类层级,默认一级分类
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类列表的数据
      fathData: [],
      // 客户所选择的关系id集合
      fathId: [],
      cascaderKey: 1
    }
  },
  watch: {
    // 切换数据源
    changeMenu () {
      ++this.cascaderKey
    }
  },
  created () {
    // 请求获取数据
    this.classList()
  },
  methods: {
    // 分类列表数据请求
    async classList () {
      const { data: res } = await this.$Axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('请求分类列表失败')
      this.classData = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.classList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.classList()
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 点击添加按钮后的事件弹窗
    edit () {
      // 在点击按钮时渲染弹框中的父级分类列表
      this.fathList()
      this.dialogVisible = true
    },
    // 获取父级的分类列表
    async fathList () {
      const { data: res } = await this.$Axios.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类列表失败')
      this.fathData = res.data
    },
    // 父级分类中选择项发生变化时的事件,子父节点关系动态发生变化
    handle () {
    // 客户所选fathId集合大于0，证明选中了父级分类，小于0.没有选择任何父级,以最后一项的id为监控对象
      if (this.fathId.length > 0) {
        this.customData.cat_pid = this.fathId[this.fathId.length - 1]
        this.customData.cat_level = this.fathId.length
      } else {
        this.customData.cat_pid = 0
        this.customData.cat_level = 0
      }
    },
    // 点击添加用户确定按钮保存数据
    holdData () {
      // 表单格式预验证
      this.$refs.editData.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$Axios.post('categories', this.customData)
        if (res.meta.status !== 201) return this.$message.error('保存用户添加分类数据失败')
        this.$message.success('保存用户添加分类成功')
        this.classList()
        this.dialogVisible = false
      })
    },
    // 第二次打开添加用户分类时重置表单
    rest () {
      this.$refs.editData.resetFields()
      this.fathId = []
      this.customData.cat_pid = 0
      this.customData.cat_level = 0
    }
  }
}
</script>
<style lang="less" scoped>

.el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
.el-card{margin-top: 20px;}
.bottom{margin-bottom: 20px;}
.el-pagination{margin-top: 20px;}
.el-cascader{width: 100%;}
</style>
