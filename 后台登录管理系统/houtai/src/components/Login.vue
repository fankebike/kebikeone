<template>
<!-- 此为主页内容(此页采用流式布局+媒体查询) -->
    <div class="bgc">
    <div class="main">
      <!-- logo部分 -->
    <div class="logbook">
      <img src="../assets/logo.png">
    </div>
    <!-- 表单部分 -->
    <!--LoginForm 表单数据  Rules表单规则  LoginRef 获取客户填写的数据-->
   <el-form class="xia"  :model="LoginForm" ref="LoginRef" :rules="Rules">
     <!-- 用户名 -->
     <!-- 表单格式及时验证 -->
      <el-form-item class="suo" prop="username">
       <!--clearable 错号加清除功能 el-icon-s-custom 左侧图标 -->
       <el-input v-model="LoginForm.username" clearable  prefix-icon="el-icon-s-custom" placeholder="请输入用户名" ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item class="suo" prop="password">
       <el-input  v-model="LoginForm.password" show-password  prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item class="float suo">
       <el-button type="primary" @click="verify">登录</el-button>
       <el-button type="info">注册</el-button>
      </el-form-item>
    </el-form>
    </div>
    </div>
</template>
<script>
// vue中js代码存放区
export default {
  data () {
    return {
      // 表单数据参数
      LoginForm: {
        username: '',
        password: ''
      },

      // 在文本框失去焦点时表单格式及时验证
      Rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // this指表单，$refs.LoginRef获取表单数据，validate((valid)表单的数据函数处理，valid与布尔值类似，判断信息对错，提交按钮初验证表单
    verify () {
      this.$refs.LoginRef.validate(
        async valid => {
          if (!valid) return
          const { data: res } = await this.$Axios.post('login', this.LoginForm)
          if (res.meta.status !== 200) return this.$message.error('登陆失败，请确认填写信息')
          this.$message.success('登录成功,正在为您跳转')
          // 用sessionStorage暂时保存token令牌，用于后期防止客户没有令牌而通过url访问
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('from')
        }
      )
    }
  }
}
</script>
 <style lang="less" scoped>
  /* 主页样式 */
.bgc{background-color:cadetblue;height: 100%;position: relative;}
.main{width: 40%;height: 50%;background-color:#fff;
    position: absolute;left: 50%;top: 50%;
    transform: translate(-50%,-50%);}
.logbook{width: 130px;height: 130px;margin: auto;border-radius: 50%;
    box-shadow: 0 -5px 10px #fff;position: relative;margin-top: -75px;
    border: 15px groove rgb(194, 193, 193); background-color:#F0F0F0;
    overflow: hidden;}
img{width: 110%;height: 110%;margin-left: -5%;position: absolute;}
/* 按钮部分*/
.float{float: right;}
.xia{position: absolute;text-align: center;bottom: 0;width: 100%;
    padding: 0 20px;box-sizing: border-box;}
 @media screen and(max-width: 768px){
    .main{width: 50%;}
    .logbook{width: 120px;height: 120px;}
             }
 @media screen and(max-height:550px){
    .suo{margin-bottom: 10px;}
     ::v-deep{.el-form-item__content,  .el-input, .el-form-item, .el-input__inner{height: 25px;line-height: 25px;}}
    .el-button{height: 0;line-height: 0;}
   }
 @media screen and(max-width: 550px){
    .main{width: 60%;}
             }
  @media screen and(max-width: 350px){
     .main{width: 80%;height: 30%;}
      .logbook{width: 50px;height: 50px;margin-top: -28px;}
      //  ::v-deep{.el-form-item__content,  .el-input, .el-form-item, .el-input__inner{height: 17px;line-height: 17px;}}
      .xia{height: 160px;line-height: 130px;}
      .el-button{height: 0;line-height: 0;}
   }
 </style>
