<template>
  <div class="user-main">
    <el-button @click="controller(userFormData)">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="user" border style="width: 100%">

      <el-table-column fixed label="ID" type="index" width="150" />
      <el-table-column fixed label="姓名" prop="user_name" width="150" />
      <el-table-column fixed label="昵称" prop="nick_name" width="150" />
      <el-table-column fixed label="邮箱" prop="email" width="200" />
      <el-table-column fixed label="电话" prop="phone" width="150" />
      <el-table-column fixed label="性别" prop="sex" width="150">
        <template slot-scope="scope">
          <span v-show="scope.row.sex === 0">男</span>
          <span v-show="scope.row.user_type === 1">女</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="用户类型" width="150">
        <template slot-scope="scope">
          <span v-show="scope.row.user_type === 0">超级管理员</span>
          <span v-show="scope.row.user_type === 1">管理员</span>
          <span v-show="scope.row.user_type === 2">员工</span>
          <span v-show="scope.row.user_type === 3">供应商</span>
          <span v-show="scope.row.user_type === 4">客户</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作弹窗 -->
    <Dialog ref="user" :before-close="beforeClose" :config="config" v-bind="user" @close="resetForm">
      <el-form ref="userForm" :model="userFormData" :rules="userRules" label-width="100px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="userFormData.user_name" />
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input v-model="userFormData.nick_name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userFormData.password" type="password" :show-password="true" />
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-select v-model="userFormData.status" placeholder="请选择账号状态">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userFormData.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userFormData.phone" />
        </el-form-item>
        <el-form-item label="用户性别" prop="sex">
          <el-select v-model="userFormData.sex" placeholder="请选择用户性别">
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
            <el-option label="未知" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="user_type">
          <el-select v-model="userFormData.user_type" placeholder="请选择用户类型">
            <el-option label="超级管理员" value="0" />
            <el-option label="管理员" value="1" />
            <el-option label="员工" value="2" />
            <el-option label="供应商" value="3" />
            <el-option label="客户" value="4" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作">
          <el-button @click="addUser">添加</el-button>
          <el-button @click="modifyUser">修改</el-button>
        </el-form-item>
      </el-form>

    </Dialog>
  </div>

</template>

<script>
import { deleteUser, getUser, modifyUser, userRegister } from '@/api/user'
import Dialog from '@/components/dialog.vue'

export default {
  components: {
    Dialog
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // 所有用户对象
      user: [],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '信息修改',
        center: true,
        btnTxt: ['取消', '提交']
      },
      // 用户表单
      userFormData: {
        id: null,
        user_name: null,
        nick_name: '潘豪',
        password: '123456',
        status: '0',
        email: '1151509140@qq.com',
        phone: '18038992335',
        sex: null,
        user_type: null
      },
      // 表单规则
      userRules: {
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]*$/, message: '用户名只能包含中文、字母、数字和下划线', trigger: 'blur' }
        ],
        nick_name: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]*$/, message: '昵称只能包含中文、字母、数字和下划线', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        user_type: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      }

      // 尾
    }
  },
  created() {
    // 执行获取数据函数
    this.fetchData()
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
    fetchData() {
      this.listLoading = true
      getUser().then(response => {
        this.user = response.data
        this.listLoading = false
      })
    },
    // 启动弹窗
    controller(userForm) {
      this.userDataRef(userForm)
      this.$refs.user.open(
        cancel => {
          // cancel();
          console.log('点击提交按钮了')
        })
        .then(() => {
          console.log(this.$refs.span)
        }
        )
    },
    beforeClose() {
      console.log('关闭前')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          userRegister(this.userFormData).then(response => {
            // 关闭弹窗
            this.$refs.user.cancel()
            if (response.code === 20011) {
              this.$message.success('添加成功')
              this.fetchData()
            } else {
              this.$message.error('添加失败')
            }

            // 获取数据
            this.fetchData()
          })
        } else {
          this.$message('字段校验失败，请重新输入')
          return false
        }
      })
    },
    modifyUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          modifyUser(this.userFormData).then(response => {
            // 关闭弹窗
            this.$refs.user.cancel()

            if (response.code === 20031) {
              this.$message.success('修改成功')
            } else {
              this.$message.error('修改失败')
            }
            // 获取数据
            this.fetchData()
          })
        } else {
          this.$message.error('字段校验失败，请重新输入')
          return false
        }
      })
    },
    // 发送删除请求
    deleteUser(id) {
      deleteUser(id).then(response => {
        console.log(response)
        if (response.code === 20021) {
          this.$message.success('删除成功')
          this.fetchData()
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    userDataRef(userForm) {
      this.userFormData = userForm
    }
    // 结尾
  }
}
</script>
