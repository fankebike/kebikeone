<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right margin">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
     <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon>
      </el-alert>
      <el-row>
       <el-col>
         <span>选择商品分类：</span>
         <el-cascader
          v-model="fathId"
          :options="chooseData"
          :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true }"
          @change="handleChange"
          clearable>
         </el-cascader>
         </el-col>
      </el-row>
      <!-- tabs页签区域 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!-- 动态参数面板 -->
       <el-tab-pane label="动态参数" name="many">
         <el-button type="primary" size='mini' :disabled=" judge" @click="dialogVisible = true">添加参数</el-button>
         <!-- 动态参数内容表格 -->
         <el-table :data="manyData" border stripe>
          <!-- 展开行的内容 -->
          <el-table-column type="expand">
           <template slot-scope="scope">
           <!-- 生成tag标签 -->
             <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="clearData(i, scope.row)">
              {{item}}</el-tag>
              <!-- 动态添加页签内容 -->
              <el-input
               class="input-new-tag"
               v-if="scope.row.inputVisible"
               v-model="scope.row.inputValue"
               ref="saveTagInput"
               size="small"
               @keyup.enter.native="handleInputConfirm(scope.row)"
               @blur="handleInputConfirm(scope.row)">
             </el-input>
             <!-- 页签添加按钮 -->
             <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
           </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
          <!-- 将按钮放在作用域插槽中，方便后期获取行数据并对其增删数据提供方便 slot-scope="scope"-->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size='mini' @click="edits(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size='mini' @click="deletes(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
         </el-table>
       </el-tab-pane>
        <!-- 静态属性面板 -->
       <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size='mini'  :disabled=" judge" @click="dialogVisible = true">添加属性</el-button>
           <!-- 静态内容表格 -->
         <el-table :data="onlyData" border stripe>
          <el-table-column type="expand">
           <!-- 静态展开面板 -->
           <template slot-scope="scope">
           <!-- 生成tag标签 -->
             <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="clearData(i, scope.row)">
              {{item}}</el-tag>
              <!-- 动态添加页签内容 -->
              <el-input
               class="input-new-tag"
               v-if="scope.row.inputVisible"
               v-model="scope.row.inputValue"
               ref="saveTagInput"
               size="small"
               @keyup.enter.native="handleInputConfirm(scope.row)"
               @blur="handleInputConfirm(scope.row)">
             </el-input>
             <!-- 页签添加按钮 -->
             <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
           </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
          <!-- 将按钮放在作用域插槽中，方便后期获取行数据并对其增删数据提供方便 slot-scope="scope"-->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size='mini' @click="edits(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size='mini'  @click="deletes(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
         </el-table>
       </el-tab-pane>
      </el-tabs>
   </el-card>
   <!-- 点击添加参数或者添加属性的对话框（共用一个对话框）prop="attr_name" 规则验证，名字一般为数据库规定命名，方便提交 -->
   <el-dialog
    :title=" '添加' + titles"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
    @close="rests">
   <el-form ref="dataRef" :model="increaseData" label-width="80px" :rules="rules"  class="demo-ruleForm">
    <el-form-item :label="titles" prop="attr_name">
    <el-input v-model="increaseData.attr_name" clearable>
    </el-input>
  </el-form-item>
   </el-form>
   <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="subData">确 定</el-button>
  </span>
</el-dialog>
<!-- 点击编辑后的对话框 -->
<el-dialog
    :title=" '修改' + titles"
    :visible.sync="EditDialogVisible"
    width="30%"
    :before-close="handleClose"
    @close="EditRests">
   <el-form ref="EditDataRef" :model="EditIncreaseData" label-width="80px" :rules="EditRules"  class="demo-ruleForm">
    <el-form-item :label="titles" prop="attr_name">
    <el-input v-model="EditIncreaseData.attr_name" clearable>
    </el-input>
  </el-form-item>
   </el-form>
   <span slot="footer" class="dialog-footer">
    <el-button @click="EditDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditSubData">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>
<script>
export default {
  data () {
    return {
    // 选择器数据源
      chooseData: [],
      // 客户选择的id集
      fathId: [],
      // 默认被激活的页签名称
      activeName: 'many',
      // 动态数据内容
      manyData: [],
      //   静态数据内容
      onlyData: [],
      dialogVisible: false,
      // 添加属性/参数时客户所写数据
      increaseData: {
        attr_name: ''
      },
      // 添加属性/参数时客户所写数据的规则限制
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 点击编辑时的数据
      EditIncreaseData: {
        attr_name: ''
      },
      // 点击编辑时窗口事件
      EditDialogVisible: false,
      // 点击编辑后表单的验证规则
      EditRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
      // 添加页签的转换
      // inputVisible: false,
      // 添加页签的数据绑定
      // inputValue: ''
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      const { data: res } = await this.$Axios.get('categories')
      this.chooseData = res.data
    },
    // 当选择器内容被客户选择时的事件
    handleChange () {
    // 当客户选择的id长度不是三级分类中时，设置为空让选不中
      if (this.fathId.length !== 3) {
        this.fathId = []
        this.manyData = []
        this.onlyData = []
        return
      }
      // 当选择了三级分类就展开tabs中对应的动态参数和静态参数
      this.tabsData()
    },
    // 当页签页被点击时
    tabClick () {
    // 当选择了三级分类就展开tabs中对应的动态参数和静态参数
      this.tabsData()
    },
    // tabs中的数据 this.$message.success('获取对应三级分类数据成功')
    async tabsData () {
      const { data: res } = await this.$Axios.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取对应三级分类数据失败')
      // 渲染可视化二级，因为在数据库时一大堆字符串，需要遍历循环提取并对每个单独封装成页签 split分割
      res.data.forEach(item => {
        // 三元表达式判断 当内容是空是不用split,不然会站位tag页签但又没有内容
        item.attr_vals = item.attr_vals
          ? item.attr_vals.split(' ') : []
        // 控制单独每行的隐藏和显示
        item.inputVisible = false
        // 控制每行的输入值，防止同步到其他行中
        item.inputValue = ''
      })
      // 渲染可视化一级
      if (this.activeName === 'many') this.manyData = res.data
      this.onlyData = res.data
    },
    // 点击添加参数和添加属性按钮错号时的事件
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 添加参数和添加属性 二次打开时候重置信息
    rests () {
      this.$refs.dataRef.resetFields()
    },
    // 点击参数添加或者属性添加中确定按钮保存数据
    subData () {
      this.$refs.dataRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$Axios.post(`categories/${this.cateId}/attributes`, { attr_name: this.increaseData.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) return this.$message.error('保存数据修改失败!')
        this.$message.success('保存数据修改成功!')
        this.dialogVisible = false
        this.tabsData()
      })
    },
    // 点击编辑时的事件,获取行内数据和id
    async edits (attrId) {
      const { data: res } = await this.$Axios.get(`categories/${this.cateId}/attributes/${attrId}`, { attr_sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error('获取行内数据失败')
      // 将行内原有数据打印在表单中
      this.$message.success('获取行内数据成功')
      this.EditIncreaseData = res.data
      this.EditDialogVisible = true
    },
    // 点击编辑中确定按钮时
    EditSubData () {
      this.$refs.EditDataRef.validate(async valid => {
        if (!valid) return this.$message.error('提交修改失败')
        const { data: res } = await this.$Axios.put(`categories/${this.cateId}/attributes/${this.EditIncreaseData.attr_id}`, { attr_name: this.EditIncreaseData.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('保存修改失败')
        this.$message.success('保存修改成功')
        this.tabsData()
        this.EditDialogVisible = false
      })
    },
    // 二次打开编辑时清空重置表单
    EditRests () {
      this.$refs.EditDataRef.resetFields()
    },
    // 点击删除按钮时
    async deletes (attrId) {
      const deleData = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (deleData !== 'confirm') return this.$message.info('已取消删除！')
      const { data: res } = await this.$Axios.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) return this.$message.error('删除数据失败!')
      this.$message.success('删除数据成功!')
      this.tabsData()
    },
    // 页签添加被按下去时或者失去焦点时,row是接收到的每行单独的控制
    async handleInputConfirm (row) {
      // 生成页签,优化：trim()删除客户在输入时多余的空格
      row.attr_vals.push(row.inputValue.trim())
      // 相当于表单重置并在失去焦点时关闭表单
      row.inputVisible = false
      row.inputValue = ''
      // 保存数据join是attr_vals将之前转化成数组的再次转化回字符串
      const { data: res } = await this.$Axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.message.error('保存数据失败')
      this.$message.success('保存并添加数据成功')
    },
    // 页签bottom被按下时，row是接收到的每行单独的控制
    showInput (row) {
      // 按钮被按下添加表单打开
      row.inputVisible = true
      // 表单自动获得焦点  this.$nextTick在页面重新被渲染之后
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击tag标签上的错号时删除事件根据索引删除，行数据也删除
    async clearData (i, row) {
      // 页面删除
      row.attr_vals.splice(i, 1)
      //  数据库删除
      const { data: res } = await this.$Axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.message.error('保存数据失败')
      this.$message.success('保存并删除数据成功')
    }
  },
  // true或者false类型函数集合
  computed: {
    // 按钮需要动态设定禁用或者启用事件
    judge () {
    //  当客户没有选择三级分类时，按钮警用,选中则按钮可用
      if (this.fathId.length !== 3) { return true }
      return false
    },
    //  客户所选择的三级ID
    cateId () {
      if (this.fathId.length === 3) { return this.fathId[2] }
      return null
    },
    //  点击添加参数或者添加属性的对话框时候的动态title的判定
    titles () {
      if (this.activeName === 'many') return '动态参数'
      return '静态参数'
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
.el-card{margin-top: 20px;}
.el-row{margin-top: 18px;}
.el-cascader{width: 30%;}
.el-table{margin-top: 15px;}
.input-new-tag{width: 120px;}
.el-tag{margin-right: 15px;}
</style>
