<template>
  <div>
     <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right margin">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片区域 -->
  <el-card>
   <!-- 警告区域 -->
   <el-alert
    title="请按序添加商品消息"
    type="info"
    center
    show-icon
    :closable="false">
  </el-alert>
  <!-- 进度条和标签页联动  :active='actives - 0' 只接收数字，-0可以转化成数字-->
  <el-steps :space="200" :active='actives - 0' finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品信息"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<!-- 左边tab标签页 label-position="top"文字在头部 :before-leave='formControl'表单监控，防止wei填写跳转-->
<el-form :model="addForm" :rules="rules" ref="addRef" label-width="100px" label-position="top">
<el-tabs :tab-position="'left'" v-model="actives" :before-leave="formCont" @tab-click='clickParm'>
    <el-tab-pane label="基本信息" name='0'>
    <el-form-item label="商品名称" prop="goods_name">
     <el-input v-model="addForm.goods_name"></el-input>
    </el-form-item>
    <el-form-item label="商品价格" prop="goods_price">
     <el-input v-model="addForm.goods_price" type="number"></el-input>
    </el-form-item>
    <el-form-item label="商品重量" prop="goods_weight">
     <el-input v-model="addForm.goods_weight" type="number"></el-input>
    </el-form-item>
    <el-form-item label="商品数量" prop="goods_number">
     <el-input v-model="addForm.goods_number" type="number"></el-input>
    </el-form-item>
    <el-form-item label="商品分类" prop="goods_cat">
     <el-cascader
    v-model= "addForm.goods_cat"
    :options= "listData"
    props.checkStrictly
    :props="{expandTrigger: 'hover',value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true}"
    @change= "handle"
    clearable>
    </el-cascader>
    </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name='1'>
    <!-- 参数渲染 列表形式渲染 -->
     <el-form-item :label="item.attr_name" v-for="item in parmData" :key="item.attr_id">
       <!-- 多选框 -->
       <el-checkbox-group v-model="item.attr_vals">
         <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"  border></el-checkbox>
       </el-checkbox-group>
     </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name='2'>
      <!-- 参数渲染 列表形式渲染 -->
     <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
       <el-input v-model="item.attr_vals"></el-input>
     </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name='3'>
      <!-- 图片上传 action上传的api的地址 :on-preview在图片被点击时 :on-remove图片移除事件-->
      <el-upload
          action="http://127.0.0.1:8888/api/private/v1/Upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
          :headers="headToken"
          :on-success="pathData">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name='4'>
      <!-- 富文本编辑器 -->
      <quill-editor v-model="addForm.goods_introduce">
      </quill-editor>
      <!-- 添加商品按钮 -->
      <el-button type='primary' @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
</el-form>
  </el-card>
  <!-- 图片预览 -->
  <el-dialog
  title="图片预览"
  :visible.sync="dialogVisible"
  width="50%">
  <img :src="previewPath" alt="" class="msgStyle">
</el-dialog>
  </div>
</template>
<script>
// 三方插件数据深拷贝，防止操作影响其他应运发生报错
import _ from 'lodash'
export default {
  data () {
    return {
    // tab及进度条默认打开第一个
      actives: '0',
      // 客户所写表单信息
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品详情内容
        goods_introduce: '',
        // 商品上传的动静参数合体
        attrs: []
      },
      // 表单验证基本规则
      rules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品分类', trigger: 'blur' }]
      },
      // 选择器中数据
      listData: [],
      // 商品参数数据
      parmData: [],
      // 商品属性中数据
      onlyData: [],
      // 图片上传添加请求头
      headToken: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片放大或缩小时的图片绝对路径
      previewPath: '',
      // 图片放大对话框开关控制
      dialogVisible: false
    }
  },
  created () {
    this.walkData()
  },
  methods: {
    // 选择器数据
    async walkData () {
      const { data: res } = await this.$Axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error('提取列表数据失败')
      this.listData = res.data
    },
    // 选择器被选择时，只允许选择三级分类
    handle () {
      if (this.addForm.goods_cat.length !== 3) this.addForm.goods_cat = []
    //   console.log(this.addForm.goods_cat)
    },
    // 禁止表单没有填写切换下一流程 activeName下一流程的标签页名称 oldActiveName当前标签页名称
    formCont (activeName, oldActiveName) {
      // 当下一页的标签页name为0且三级分类未选择时，禁止跳转下一标签页，否则跳转，true是默认，所以没有写
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品三级分类')
        return false
      }
    },
    // 点击每个页签数据请求
    async clickParm () {
    // 当页签索引是1（name:1）请求商品参数 ${this.addForm.goods_cat[2]}
      if (this.actives === '1') {
        const { data: res } = await this.$Axios.get(`categories/${this.fathId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('请求商品参数失败')
        res.data.forEach(item => {
          // 三元表达式判断 当内容是空是不用split,不然会站位tag页签但又没有内容
          item.attr_vals = item.attr_vals.length === 0
            ? [] : item.attr_vals.split(' ')
        })
        this.parmData = res.data
        // console.log(this.parmData)
      }
      // 当页签索引是2（name:2）请求商品参数 ${this.addForm.goods_cat[2]}
      if (this.actives === '2') {
        const { data: res } = await this.$Axios.get(`categories/${this.fathId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('请求商品属性失败')
        // res.data.forEach(item => {
        //   // 三元表达式判断 当内容是空是不用split,不然会站位tag页签但又没有内容
        //   item.attr_vals = item.attr_vals.length === 0
        //     ? [] : item.attr_vals.split(' ')
        // })
        this.onlyData = res.data
      }
    },
    // 图片或者名字被点击时的放大缩小,每个图片对象
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    // 图片被移除时的事件,将图片从临时图片数据组中删除file要删除的对象
    handleRemove (file) {
      const fileMsg = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === fileMsg)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 图片上传前端成功后事件(存储在临时图片数据库地址，后和表单一块提交)response服务器传回的数据对象
    pathData (response) {
      const msg = { pics: response.data.tmp_path }
      this.addForm.pics.push(msg)
      console.log(this.addForm)
    },
    // 表单提交及验证(发布商品)
    add () {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单内容')
        // 提交要求将数组转为字符串以逗号拼接 goods_cat.join(',') 数据深拷贝，不影响前面三级分类
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(' , ')
        //  parmData onlyData 动静数据合体且提取其中id和value
        this.parmData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 发布提交商品
        const { data: res } = await this.$Axios.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('提交添加商品失败')
        this.$message.success('提交添加商品成功')
        this.$router.push('/shop')
      })
    }
  },
  computed: {
    // 三级分类判定验证
    fathId () {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{margin-top: 20px;font-size: 15px;margin-left: 20px;}
.el-card{margin-top: 20px;}
.el-steps{margin-top: 20px;}
.el-tabs{margin-top: 20px;}
.el-checkbox{margin: 0 5px 0 0;}
img{width: 100%;height: 100%;
    margin-left: 0;
    position: none;
     position: relative;
    border-radius: 0;
    flex-wrap: none;}
.ql-editor {height: 300px;}
.el-button{margin-top: 20px;}
</style>
