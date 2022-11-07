
<template>
  <div class="user-main">
    <el-button @click="controller(userFormData)">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="user" border style="width: 100%">

      <el-table-column fixed type="index" label="ID" width="150" />
      <el-table-column fixed prop="user_name" label="姓名" width="150" />
      <el-table-column fixed prop="user_sex" label="性别" width="150" />
      <el-table-column fixed prop="user_age" label="年龄" width="150" />
      <el-table-column fixed prop="user_tel" label="电话" width="150" />
      <el-table-column fixed prop="user_salary" label="薪水" width="150" />
      <el-table-column fixed prop="user_password" label="登录密码" width="150" />
      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        // eslint-disable-next-line vue/no-unused-vars
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button type="text" size="small" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button type="text" size="small" @click="deleteUser(scope.row.user_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作弹窗 -->
    <Dialog ref="user" v-bind="user" :config="config" :before-close="beforeClose" @close="resetForm">
      <el-form ref="userForm" :model="userFormData" :rules="userRules" label-width="100px">
        <el-form-item label="姓名" prop="user_name">
          <el-input v-model="userFormData.user_name" />
        </el-form-item>
        <el-form-item label="性别" prop="user_sex">
          <el-input v-model="userFormData.user_sex" />
        </el-form-item>
        <el-form-item label="年龄" prop="user_age">
          <el-input v-model="userFormData.user_age" />
        </el-form-item>
        <el-form-item label="电话" prop="user_tel">
          <el-input v-model="userFormData.user_tel" />
        </el-form-item>
        <el-form-item label="薪水" prop="user_salary">
          <el-input v-model="userFormData.user_salary" />
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input v-model="userFormData.user_password" />
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
import { getUser, addUser, modifyUser, deleteUser } from '@/api/user'
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
      user: [{
        user_id: '',
        user_name: '',
        user_sex: '',
        user_age: '',
        user_tel: '',
        user_salary: '',
        user_password: '',
        user_repository_id: ''
      }],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '温馨提示',
        center: true,
        btnTxt: ['取消', '提交']
      },
      // 用户表单
      userFormData: {
        user_id: '',
        user_name: '贪玩计算姬',
        user_sex: '男',
        user_age: '19',
        user_tel: '180****2335',
        user_salary: '100000',
        user_password: '123456',
        user_repository_id: '1'
      },
      // 表单规则
      userRules: {
        user_name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        user_sex: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        user_age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        user_tel: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        user_salary: [
          { required: true, message: '请输入薪水', trigger: 'blur' }
        ],
        user_password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
        this.user = response.data.data
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
        .then(() => { console.log(this.$refs.span) }
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
          addUser(this.userFormData).then(response => {
            // 关闭弹窗
            this.$refs.user.cancel()
            if (response.data.result === 20011) {
              this.$message.success('添加成功')
            } else this.$message.error('添加成功')

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

            if (response.data.result === 20031) {
              this.$message.success('修改成功')
            } else this.$message.error('修改失败')
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
        if (response.data.result === 20021) {
          this.$message.success('修改成功')
        } else this.$message.error('修改失败')
        // 获取数据
        this.fetchData()
      })
    },
    userDataRef(userForm) {
      this.userFormData = userForm
    }
    // 结尾
  }
}
</script>
