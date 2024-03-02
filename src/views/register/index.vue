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
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称" type="nickname" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
            <el-option label="未知" value="2" />
          </el-select>
          <el-tooltip
            :content="`当前选择的是${form.sex=== 0?'男':form.sex===1?'女':'未知'}性别`"
            class="item"
            effect="dark"
            placement="right-end"
          ><i class="el-icon-info" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="用户类型" prop="sex">
          <el-select v-model="form.user_type" placeholder="请选择用户类型">
            <el-option label="超级管理员" value="0" />
            <el-option label="管理员" value="1" />
            <el-option label="员工" value="2" />
            <el-option label="供应商" value="3" />
            <el-option label="客户" value="4" />
            <el-option label="未知" value="unknown" />
          </el-select>
        </el-form-item>
        <el-form-item prop="email">
          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="邮箱" type="email" />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="form.phone" placeholder="手机" type="phone" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="密码" type="password" />
            <span style="font-size: smaller">使用 4 个或更多字符（字母、数字和符号的组合）</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Register">提交</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
      <img alt="右侧图片" class="form-image" src="./right-image.svg">
    </div>
  </div>
</template>

<script>

import { userRegister } from '@/api/user'

export default {
  data() {
    return {
      form: {
        firstName: '潘',
        lastName: '豪',
        email: '1151509140@qq.com',
        password: 'root',
        nickname: 'root',
        phone: '18038992335',
        sex: 0,
        user_type: 0
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
            min: 4,
            max: 20,
            message: '密码长度应在6-20位之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]

      }
    }
  },
  methods: {
    Register() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过，可以进行提交
          console.log('提交表单', this.form)
          const user_name = `${this.form.firstName}${this.form.lastName}`
          userRegister({
            user_name: user_name, // 将 fullName 作为参数提交
            email: this.form.email,
            password: this.form.password,
            nick_name: this.form.nickname,
            phone: this.form.phone,
            status: 0,
            user_type: this.form.user_type,
            sex: this.form.sex
          }).then(response => {
            if (response.code === 20011) {
              this.$message.success('注册成功')
              this.$router.push({ path: '/login' })
            } else {
              this.$message.error('注册失败')
            }
          })
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
