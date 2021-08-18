<template>
    <div>
     <el-breadcrumb separator-class="el-icon-arrow-right margin">
       <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>权限管理</el-breadcrumb-item>
       <el-breadcrumb-item>角色列表</el-breadcrumb-item>
     </el-breadcrumb>
    <el-card>
        <el-row class="mag">
        <el-button type="primary">添加角色</el-button>
        </el-row>
     <el-table border stripe :data = 'partData'>
      <!-- type = 'expand' 内容扩展索引 slot-scope="scope"-->
       <el-table-column type = 'expand'>
      <!--利用作用域插槽获取行数据，对权限进行设置  -->
        <template slot-scope="scope">
         <!-- 内用用栅格布局防止被挤 -->
         <el-row v-for = "(item1, i1) in scope.row.children" :key = 'item1.id' :class = "['rowBottom', i1 === 0 ? 'rowTop' : '']">
         <!-- 一级权限 :class = "['rowBottom']"给每一项都动态绑定class,通过三元表达式获取索引i1，当为0不添加为空,为0添加rowTop-->
         <el-col :span = '5'><el-tag>{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
          <!-- 二级三级权限 -->
         <el-col :span = '19'>
          <!-- 通过for循环渲染第二层 -->
          <el-row v-for="(item2, i2) in item1.children" :key='item2.id' :class = "[ i2 === 0 ? '' : 'rowTop']">
          <!-- 二级空间 -->
           <el-col :span = '6'><el-tag type="success">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
           <!-- 三级级空间 @close="deleId(scope.row,item3.id)"-->
           <el-col :span="18"><el-tag type = "warning"  v-for="(item3) in item2.children" :key="item3.id" closable  @close="deleId(scope.row,item3.id)">{{item3.authName}}</el-tag></el-col>
          </el-row>
         </el-col>
         <!-- 三层for循环每一层代表一层权限并渲染页面 -->
         </el-row>
        </template>
       </el-table-column>
      <!-- type = 'index' 设置索引 slot-scope="scope"-->
      <el-table-column type = 'index' align = 'center'></el-table-column>
      <el-table-column label = '角色名称' prop = 'roleName' align = 'center'></el-table-column>
      <el-table-column label = '路径' prop="roleDesc" align = 'center'></el-table-column>
      <el-table-column label = '操作' align = 'center' width="300px">
          <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" size = "mini">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" size = "mini">删除</el-button>
             <el-button type="warning" icon="el-icon-setting" size = "mini" @click="rootTribute(scope.row)">分配权限</el-button>
          </template>
      </el-table-column>
     </el-table>
     </el-card>
     <!-- 权限分配的内容 -->
     <el-dialog
      title="权限分配"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="cacheClear">
      <!-- 通过树形节点呈现内容,:props="defaultProps"节点信息 show-checkbox选择框 node-key='id' 通过id获取到客户所选择的内容，default-expand-all子节点全部打开,defaultData默认打钩对应的已有权限 alterData为客户修改后的数据-->
       <el-tree :data="rootData" :props="defaultProps" show-checkbox node-key = 'id' default-expand-all :default-checked-keys = 'defaultData' ref="alterData"></el-tree>
       <span slot="footer" class="dialog-footer">
       <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button type="primary"  @click="dataHold">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      partData: [],
      dialogVisible: false,
      rootData: [],
      // 树形节点中节点信息
      defaultProps: {
      // 名字部分
        label: 'authName',
        // 子节点内容
        children: 'children'
      },
      // 默认选中的节点的id
      defaultData: [],
      // 所有节点id
      alls: ''
    }
  },
  created () {
    this.partList()
  },
  methods: {
    async partList () {
      const { data: res } = await this.$Axios.get('roles')
      if (res.meta.status !== 200) return this.$message.console.error('获取用户数据失败')
      this.partData = res.data
    },
    // 点击x号删除相应权限,role是通过space.row得到角色的id, right是通过item3.id得到的权限的id
    async deleId (role, right) {
      const control = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (control !== 'confirm') { return this.$message.info('已取消删除用户权限!') }
      const { data: res } = await this.$Axios.delete(`roles/${role.id}/rights/${right}`)
      if (res.meta.status !== 200) { return this.$message.error('删除用户权限失败') }
      // // 删除成功后消息提示及刷新数据
      this.$message.success('已删除用户权限')
      this.partList()
    },
    // 点击权限分配中的错号时提示确定要关闭
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 权限分配
    async rootTribute (role) {
      // 权限分配中的数据
      const { data: res } = await this.$Axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限分配数据失败')
      this.rootData = res.data
      this.alls = role.id
      //  通过递归获取三级节点id为默认勾选
      this.default(role, this.defaultData)
      this.dialogVisible = true
    },
    // 递归函数方式给默认勾选赋值,node为节点判断，arr为节点下id集合的数组
    default (node, arr) {
      // 通过children属性判断是否有三级节点，三级没有children属性,所以用非
      if (!node.children) return arr.push(node.id)
      // 如果有children属性，用递归遍历出三级节点
      node.children.forEach(item =>
        this.default(item, arr)
      )
    },
    //  清理缓存
    cacheClear () {
      this.defaultData = []
    },
    // 保存修改的权限
    async dataHold () {
      // 获取修改的数据的已选择数据id,后为半选的数据id，...为展开运算符
      const keys = [...this.$refs.alterData.getCheckedKeys(),
        ...this.$refs.alterData.getHalfCheckedKeys()]
      // 按要求以字符串拼接的数组
      const idData = keys.join(',')
      // 发送请求保存数据
      const { data: res } = await this.$Axios.post(`roles/${this.alls}/rights`, { rids: idData })
      if (res.meta.status !== 200) return this.$message.error('保存修改权限数据失败')
      this.$message.success('保存修改权限数据成功')
      this.partList()
      this.dialogVisible = false
    }
  }
}
</script>
<style lang = less scoped>
 .el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
 .el-card{margin-top: 20px;}
 .mg{margin-top: 20px;}
 .el-table{margin-top: 20px;}
 .el-tag{margin: 7px;}
 .rowTop{border-top: 1px solid #eee;}
 .rowBottom{border-bottom: 1px solid #eee;}
</style>
