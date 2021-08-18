<template>
<div>
    <!-- 用户列表导航区域 -->
 <el-breadcrumb separator-class="el-icon-arrow-right margin">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>活动管理</el-breadcrumb-item>
  <el-breadcrumb-item>活动列表</el-breadcrumb-item>
  <el-breadcrumb-item>活动详情</el-breadcrumb-item>
</el-breadcrumb>
   <!-- 用户列表中首页,利用bootstrap栅格布局加element ui 内容 -->
   <el-card class="box-card">
    <div class="row">
  <div class="col-lg-8 col-md-8 col-sm-8">
    <!-- @clear='getList'刷新数据到初始状态 -->
    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" @clear='getList' clearable>
    <el-button slot="append" icon="el-icon-search" @click="getList"></el-button></el-input>
  </div>
  <div class="col-lg-4 col-md-4 col-sm-4"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></div>

  <!-- 表格 bootstrap加ui结合-->
   <el-table border stripe :data = 'shuju'>
     <!-- type = 'index' 设置索引-->
      <el-table-column type = 'index' align = 'center'></el-table-column>
      <el-table-column label = '姓名' prop = 'username' align = 'center'></el-table-column>
      <el-table-column label = '邮箱' prop="email" align = 'center' width = '130px'></el-table-column>
      <el-table-column label = '电话' prop="mobile" align = 'center'></el-table-column>
      <el-table-column label = '角色' prop="role_name" align = 'center'></el-table-column>
      <el-table-column label = '状态' align = 'center'>
        <!--template作用域，slot-scope作用域标签，用来获取数据，scope为起的数据名，scope.row为获取它的内容(作用域插槽),  -->
        <template slot-scope="scope">
           <!-- 根据数据库中的state的true或者false定义开关是否打开或者关闭， 监听state通过回调函数change保存客户对于开关的设置数据-->
           <el-switch  v-model='scope.row.mg_state' active-color="#13ce66" inactive-color="#ff4949"  @change='states(scope.row)'></el-switch>
        </template>
      </el-table-column>
      <el-table-column label = '操作' width = '175px'>
        <!-- 通过作用域插槽来获取ID从而实现按钮对数据的增删 -->
         <template slot-scope="scope">
           <!-- 给按钮家消息提示scope.row.id获取这一行数据信息id -->
           <el-tooltip effect="dark" content="修改用户信息" placement="top" :enterable = 'false'>
           <el-button type="primary" icon="el-icon-edit" size = 'mini' @click='alters(scope.row.id)'></el-button>
           </el-tooltip>
           <el-tooltip effect="dark" content="删除用户" placement="top" :enterable = 'false'>
           <el-button type="danger " icon="el-icon-delete" size = 'mini' @click="ClearData(scope.row.id)"></el-button>
           </el-tooltip>
           <el-tooltip effect="dark" content="分配角色" placement="top" :enterable = 'false'>
           <el-button type="warning" icon="el-icon-setting" size = 'mini' @click="roleTribute(scope.row)"></el-button>
           </el-tooltip>
         </template>
      </el-table-column>
   </el-table>
   <!-- 分页  @size-change="handleSizeChange"切换下拉菜单里面内容时触发，layout="total sizes, prev, pager, next, jumper"-->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, next, jumper"
      :total="total">
    </el-pagination>
   </div>
  </el-card>
  <div>
    <!--  @close = 'resetting'点击取消或者x号重置表单 -->
    <el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose"
  @close = 'resetting'>
  <!-- 添加客户表单部分 -->
  <!-- adds表单数据,DataRules规则，ClientData客户所填数据 -->
 <el-form :model="adds" :rules="DataRules" ref="ClientData" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="adds.username" clearable></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="adds.password" show-password></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="adds.email" clearable></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="mobile">
    <el-input v-model="adds.mobile"  clearable></el-input>
  </el-form-item>
 </el-form>
  <!-- 底部按钮验证部分 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="verify">确 定</el-button>
  </span>
</el-dialog>
  </div>
  <div>
     <el-dialog
  title="修改用户"
  :visible.sync="AlertsDialogVisible"
  width="50%"
  :before-close="handleClose">
  <!-- 修改客户表单部分 -->
  <!-- adds表单数据,DataRules规则，ClientData客户所填数据 -->
 <el-form :model="RowData" :rules="DataRules" ref="RowClientData" label-width="70px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="RowData.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="RowData.email" clearable></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="mobile">
    <el-input v-model="RowData.mobile"  clearable></el-input>
  </el-form-item>
 </el-form>
  <!-- 底部按钮验证部分 -->
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="AlterVerify">确 定</el-button>
  </span>
</el-dialog>
  </div>
  <div>
    <!-- 角色分配 -->
    <el-dialog
  title="分配角色"
  :visible.sync="getDialogVisible"
  width="30%"
  :before-close="handleClose"
  @close='restClear'>
  <div>
    <p>当前用户:{{ roleData.username}}</p>
    <p>当前角色:{{ roleData.role_name}}</p>
    <p>分配角色:
      <el-select v-model="roleListId" placeholder="请选择">
        <!-- 客户选择的角色保存在roleListId中 -->
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dataHold">确 定</el-button>
  </span>
</el-dialog>
  </div>
</div>
</template>
<script>
export default {
  data () {
    // email自定义验证规则，规则，值，回调函数
    var CheckEmail = (rule, value, cd) => {
      // 通过正则验证
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      // 值为true,通过
      if (regEmail.test(value)) { return cd() }
      // 值为false,回调函数内提示错误信息
      cd(new Error('请输入正确格式的邮箱地址'))
    }
    // 手机号自定义验证规则
    var CheckMobile = (rule, value, cd) => {
      // 通过正则验证
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]14[57])[0-9]{8}$/
      if (regMobile.test(value)) { return cd() }
      cd(new Error('请输入正确格式的手机号码'))
    }
    // 数据存放
    return {
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      },
      shuju: [],
      total: 0,
      // 添加用户弹窗的显示和隐藏
      dialogVisible: false,
      AlertsDialogVisible: false,
      // 修改用户数据时调取到的行内数据
      RowData: {},
      // adds表单数据
      adds: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // DataRules表单验证规则
      DataRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          { validator: CheckEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { min: 7, max: 11, message: '请输入正确手机号', trigger: ['blur', 'change'] }
          { validator: CheckMobile, trigger: 'blur' }
        ]

      },
      // 分配角色弹框控制
      getDialogVisible: false,
      // 分配角色的行数据
      roleData: {},
      // 获取所有可选角色
      roleList: [],
      // 客户所选择角色的id
      roleListId: ''
    }
  },
  // 生命周期函数
  created () {
  //   // 如果数据要用于渲染页面，请在created中声明，在methods中执行
    this.getList()
  },
  methods: {
    async getList () {
      const { data: res } = await this.$Axios.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.console.error('获取数据列表失败!')
      this.shuju = res.data.users
      this.total = res.data.total
    },
    // 监听下拉菜单,newSize用来定义每页多少条，从而改变页码当前应该因此而呈现的页数
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getList()
    },
    // 监听页码。页码改变时改变数据内容
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getList()
    },
    // 接收客户状态修改的数据，hold是保存的 状态中监听@change="states(scope.row）而得到的数据
    async states (hold) {
      console.log(hold)
      const { data: res } = await this.$Axios.put(`users/${hold.id}/state/${hold.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
      // 更新失败时状态回到原来默认状态
        hold.state = !hold.state
        return this.$message.error('更新数据状态失败!')
      }
      this.$message.success('更新数据状态成功!')
    },
    // 表单重置事件
    resetting () { this.$refs.ClientData.resetFields() },
    // 关闭弹窗错号时的提醒
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 点击确定按钮(添加数据)，
    verify () {
    //  表单初次格式验证
      this.$refs.ClientData.validate(async valid => {
        //  表单初次格式验证错误时跳出不再进行下一步验证
        if (!valid) return
        // 格式正确请求数据库添加数据并刷新列表内容添加及弹窗的关闭
        const { data: res } = await this.$Axios.post('users', this.adds)
        if (res.meta.status !== 201) return this.$message.error('添加用户数据失败')
        this.$message.success('添加用户数据成功')
        this.dialogVisible = false
        this.getList()
      })
    },
    // 点击修改用户信息时的事件.scope.row.id获取这一行数据信息id,通过id获取行内所有数据库信息。scope.row也可以直接获得
    async alters (id) {
      this.AlertsDialogVisible = true
      const { data: res } = await this.$Axios.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('调取用户数据失败')
      this.RowData = res.data
    },
    // 点击确定保存修改数据
    AlterVerify () {
      this.$refs.RowClientData.validate(async valid => {
        //  表单初次格式验证错误时跳出不再进行下一步验证
        if (!valid) return
        // 格式正确请求数据库添加数据并刷新列表内容添加及弹窗的关闭+this.RowData.id, { email: this.RowData.email }, { mobile: this.RowData.mobile }
        const { data: res } = await this.$Axios.put('users/' + this.RowData.id, { email: this.RowData.email, mobile: this.RowData.mobile })
        if (res.meta.status !== 200) return this.$message.error('修改用户数据失败')
        this.$message.success('修改用户数据成功')
        this.AlertsDialogVisible = false
        this.getList()
      })
    },
    // 点击删除用户信息时事件
    async ClearData (id) {
      const dele = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (dele !== 'confirm') { return this.$message.info('已取消删除') }
      const { data: res } = await this.$Axios.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户数据失败')
      this.$message.success('删除用户数据成功')
      this.getList()
    },
    // 点击角色分配时的事件roleData是通过scope.row中获取的行数据
    async roleTribute (roleData) {
      this.roleData = roleData
      // 获取所有角色列表方便客户选择
      const { data: res } = await this.$Axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data
      this.getDialogVisible = true
    },
    // 点击确定保存角色分配的修改
    async dataHold () {
      // 当客户没有选择分配角色时
      if (!this.roleListId) return this.$message.error('请选择要分配的角色')
      // 客户选择了对应的角色那就请求保存数据
      const { data: res } = await this.$Axios.put(`users/${this.roleData.id}/role`, { rid: this.roleListId })
      if (res.meta.status !== 200) return this.$message.error('保存角色修改失败!')
      this.$message.success('保存角色修改成功!')
      this.getList()
      this.getDialogVisible = false
    },
    // 再次打开角色分配时重置清理上次的表格信息
    restClear () {
      this.roleListId = ''
      this.roleData = {}
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
.el-card{margin-top: 20px;width: 90%;margin-left: 5%;}
.el-table{margin-top: 25px;width: 80%;margin-left: 15px;margin-right: 15px;
font-size: 8px;padding: 0;}
 .el-pagination{margin-top: 20px;}
</style>
