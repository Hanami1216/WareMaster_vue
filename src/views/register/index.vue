<template>
  <div class="form-wrapper">
    <div class="form-container">
      <el-form ref="form" :model="form" :rules="rules">
        <h2>创建您的 WareMaster 帐号</h2>
        <el-form-item prop="firstName">
          <div class="input-row">
            <el-input v-model="form.firstName" placeholder="姓氏" />
            <el-input v-model="form.lastName" placeholder="名字" />
          </div>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.nickname" placeholder="昵称" type="nickname" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" type="email" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码" type="password" />
          <span style="font-size: smaller">使用 8 个或更多字符（字母、数字和符号的组合）</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
      <img alt="右侧图片" class="form-image" src="./right-image.svg">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        nickname: ''
      },
      rules: {
        firstName: [{ required: true, message: '请输入姓氏', trigger: 'blur' }],
        lastName: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur,change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '密码长度应在6-20位之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过，可以进行提交
          console.log('提交表单', this.form)
        } else {
          // 如果表单验证不通过，需要进行提示
          this.$message.error('请输入正确的信息')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 在 el-form-item 中嵌套一个 display: flex 的 div 元素，让两个 input 并排显示 */
.input-row {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
}

/* 调整两个 input 之间的距离 */
.input-row .el-input {
  margin-right: 20px;
}

.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

/* 外部容器样式 */
.form-container {
  border-radius: 10px; /* 添加圆角 */
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3); /* 添加阴影 */
  display: flex; /* 添加 Flex 布局 */
  align-items: center; /* 垂直居中 */
  padding: 30px; /* 内边距 */
  position: relative; /* 相对定位 */
  width: auto; /* 自适应宽度 */

  /* 表单图片样式 */
  .form-image {
    width: 200px; /* 图片宽度自适应 */
    height: 200px; /* 图片高度固定为 100px */
  }
}

</style>
