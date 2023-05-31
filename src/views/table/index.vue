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
      <el-table-column fixed label="性别" prop="sex" width="150" />
      <el-table-column
        fixed
        label="用户类型"
        width="150"
      >
        <template slot-scope="scope">
          <span
            v-show="scope.row.user_type === '0' "
          >超级管理员</span>
          <span
            v-show="scope.row.user_type === '1' "
          >管理员</span>
          <span
            v-show="scope.row.user_type === '2' "
          >员工</span>
          <span
            v-show="scope.row.user_type === '3' "
          >供应商</span>
          <span
            v-show="scope.row.user_type === '4' "
          >客户</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        // eslint-disable-next-line vue/no-unused-vars
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteUser(scope.row.user_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作弹窗 -->
    <Dialog ref="user" :before-close="beforeClose" :config="config" v-bind="user" @close="resetForm">
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
      user: [{
        id: '1',
        user_name: 'root',
        nick_name: '贪玩の計算姬',
        password: '$2a$10$estRqCrug679FKMi1y5OxuXiiJ43I2g2hqebIriEkyNsEcqznHj9u',
        status: '0',
        email: '1151509140',
        phone: '18038992335',
        sex: '男',
        user_type: 0
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
        id: '1',
        user_name: 'root',
        nick_name: '贪玩の計算姬',
        password: '$2a$10$estRqCrug679FKMi1y5OxuXiiJ43I2g2hqebIriEkyNsEcqznHj9u',
        status: '0',
        email: '1151509140',
        phone: '18038992335',
        sex: '男',
        user_type: 0
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
            if (response.data.result === 20011) {
              this.$message.success('添加成功')
            } else {
              this.$message.error('添加成功')
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

            if (response.data.result === 20031) {
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
        if (response.data.result === 20021) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(response.data.msg)
        }
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
