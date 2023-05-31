<template>
  <div class="repository-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="warehouseList" border style="width: 100%">

      <el-table-column fixed label="ID" type="index" />
      <el-table-column fixed label="仓库地址" prop="warehouse_code" />
      <el-table-column fixed label="仓库面积" prop="warehouse_name" />
      <el-table-column fixed label="仓库等级" prop="address" />
      <el-table-column fixed label="仓库简介" prop="contact" />

      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteRepository(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Dialog ref="repository" :before-close="beforeClose" :config="config" v-bind="warehouseList" @close="resetForm">
      <el-form ref="repositoryFrom" :model="repositoryFormData" :rules="repositoryRules" label-width="100px">
        <el-form-item label="仓库地址" prop="warehouse_code">
          <el-input v-model="repositoryFormData.warehouse_code" />
        </el-form-item>
        <el-form-item label="仓库面积" prop="warehouse_name">
          <el-input v-model="repositoryFormData.warehouse_name" />
        </el-form-item>
        <el-form-item label="仓库等级" prop="address">
          <el-input v-model="repositoryFormData.address" />
        </el-form-item>
        <el-form-item label="仓库简介" prop="contact">
          <el-input v-model="repositoryFormData.contact" />
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

import { addRepository, deleteRepository, getWareHouse, modifyRepository } from '@/api/warehouse'
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
      warehouseList: [{
        id: 1,
        warehouse_code: '001',
        warehouse_name: 999,
        address: 1,
        contact: '广州城市理工学院'
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
        id: 1,
        warehouse_code: '001',
        warehouse_name: 999,
        address: '广州市花都区学府1号',
        contact: '联系方式'
      },

      // 用户表单
      // 表单规则
      repositoryRules: {
        warehouse_code: [
          { required: true, message: '请输入仓库编码', trigger: 'blur' }
        ],
        warehouse_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
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
      getWareHouse().then(response => {
        this.warehouseList = response.data

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
