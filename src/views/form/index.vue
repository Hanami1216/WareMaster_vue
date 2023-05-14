<template>
  <div class="repository-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="repositoryList" border style="width: 100%">

      <el-table-column fixed label="ID" type="index"/>
      <el-table-column fixed label="仓库地址" prop="repository_address"/>
      <el-table-column fixed label="仓库面积" prop="repository_area"/>
      <el-table-column fixed label="仓库等级" prop="repository_level"/>
      <el-table-column fixed label="仓库简介" prop="repository_desc"/>

      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteRepository(scope.row.repository_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Dialog ref="repository" :before-close="beforeClose" :config="config" v-bind="repositoryList" @close="resetForm">
      <el-form ref="repositoryFrom" :model="repositoryFormData" :rules="repositoryRules" label-width="100px">
        <el-form-item label="仓库地址" prop="repository_address">
          <el-input v-model="repositoryFormData.repository_address"/>
        </el-form-item>
        <el-form-item label="仓库面积" prop="repository_area">
          <el-input v-model="repositoryFormData.repository_area"/>
        </el-form-item>
        <el-form-item label="仓库等级" prop="repository_level">
          <el-input v-model="repositoryFormData.repository_level"/>
        </el-form-item>
        <el-form-item label="仓库简介" prop="repository_desc">
          <el-input v-model="repositoryFormData.repository_desc"/>
        </el-form-item>
        <el-form-item label="操作">
          <el-button @click="add()">添加</el-button>
          <el-button @click="modify()">修改</el-button>
        </el-form-item>
      </el-form>

    </Dialog>
  </div>

</template>

<script>

import { addRepository, deleteRepository, getRepository, modifyRepository } from '@/api/repository'
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
      // 所有仓库
      repositoryList: [{
        repository_id: 1,
        repository_address: '广州市花都区学府1号',
        repository_area: 999,
        repository_level: 1,
        repository_desc: '广州城市理工学院',
        goods: [{
          goods_id: 1,
          goods_num: 1234,
          goods_type_id: 1,
          goodsType: null,
          repositoryList: null
        }]
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
      repositoryFormData: {
        repository_id: 1,
        repository_address: '广州市花都区学府1号',
        repository_area: 999,
        repository_level: 1,
        repository_desc: '广州城市理工学院'
      },

      // 用户表单
      // 表单规则
      repositoryRules: {
        repository_address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        repository_area: [
          { required: true, message: '请输入面积', trigger: 'blur' }
        ],
        repository_level: [
          { required: true, message: '请输入等级', trigger: 'blur' }
        ],
        repository_desc: [
          { required: true, message: '请输入简介', trigger: 'blur' }
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

    },
    fetchData() {
      this.listLoading = true
      getRepository().then(response => {
        this.repositoryList = response.data

        this.listLoading = false
      })
    },
    // 启动弹窗
    controller(repositoryFormData) {
      this.RepositoryDataRef(repositoryFormData)
      this.$refs.repository.open(
        cancel => {
          // cancel();

        })
        .then(() => {

          }
        )
    },
    beforeClose() {

    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    add() {
      this.$refs.repositoryFrom.validate((valid) => {
        if (valid) {
          addRepository(this.repositoryFormData).then(response => {
            // 关闭弹窗
            this.$refs.repository.cancel()
            if (response.data.result === 20011) {
              this.$message.success('添加成功')
            } else {
              this.$message.error(response.data.msg)
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
    modify() {
      this.$refs.repositoryFrom.validate((valid) => {
        if (valid) {
          modifyRepository(this.repositoryFormData).then(response => {
            // 关闭弹窗
            this.$refs.repository.cancel()

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
    deleteRepository(id) {
      deleteRepository(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.data.msg)
        }
        // 获取数据
        this.fetchData()
      })
    },
    RepositoryDataRef(repositoryForm) {
      if (repositoryForm != null) {
        this.repositoryFormData = repositoryForm
      }
    }
    // 结尾
  }
}
</script>
