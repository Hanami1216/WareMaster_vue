
<template>
  <div class="user-main">
    <el-button @click="controller">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="user" border style="width: 100%">

      <el-table-column fixed prop="user_id" label="ID" width="150" />
      <el-table-column fixed prop="user_name" label="姓名" width="150" />
      <el-table-column fixed prop="user_sex" label="性别" width="150" />
      <el-table-column fixed prop="user_age" label="年龄" width="150" />
      <el-table-column fixed prop="user_tel" label="电话" width="150" />
      <el-table-column fixed prop="user_salary" label="薪水" width="150" />
      <el-table-column fixed prop="user_password" label="登录密码" width="150" />
      <!-- 操作 -->
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 查看这行数据 -->
          <el-button type="text" size="small" @click="controller">查看</el-button>
          <!-- 修改 -->
          <el-button type="text" size="small" @click="controller">编辑</el-button>
          <!-- 删除 -->
          <el-button type="text" size="small" @click="controller">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作弹窗 -->
    <Dialog ref="user" v-bind="user" :config="config" :before-close="beforeClose" @close="resetForm">
      <el-form ref="userForm" :model="userForm" :rules="userRules" label-width="100px">
        <el-form-item label="姓名" prop="user_id">
          <el-input v-model="userForm.user_id" />
        </el-form-item>
        <el-form-item label="性别" prop="user_sex">
          <el-input v-model="userForm.user_sex" />
        </el-form-item>
        <el-form-item label="年龄" prop="user_age">
          <el-input v-model="userForm.user_age" />
        </el-form-item>
        <el-form-item label="电话" prop="user_tel">
          <el-input v-model="userForm.user_tel" />
        </el-form-item>
        <el-form-item label="薪水" prop="user_salary">
          <el-input v-model="userForm.user_salary" />
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input v-model="userForm.user_password" />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>

</template>

<script>
import { getUser } from '@/api/user'
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
        name: '',
        user_id: '',
        user_name: '',
        user_sex: '',
        user_age: '',
        user_tel: '',
        user_salary: '',
        user_password: ''
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
      userForm: {
        user_id: '',
        user_name: '',
        user_sex: '',
        user_age: '',
        user_tel: '',
        user_salary: '',
        user_password: ''
      },
      userRules: {
        user_id: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
    controller() {
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
    // resetForm() {
    //   // 这里可以写重置表单的实现
    // },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }

    // 结尾
  }
}
</script>
