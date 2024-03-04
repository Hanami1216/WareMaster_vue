<template>
  <div class="supplier-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="supplierList" border style="width: 100%">
      <el-table-column fixed label="供应商名称" prop="supplier.supplier_name" />
      <el-table-column fixed label="供应商描述" prop="supplier.description" />
      <el-table-column fixed label="供应商价格" prop="supplier.price" />
      <el-table-column fixed label="供应商名称" prop="supplier.supplier_name" />
      <el-table-column fixed label="联系信息" prop="supplier.contact_info" />
      <el-table-column fixed label="公司名称" prop="supplier.supplier_company" />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row.supplier)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteSupplier(scope.row.supplier.supplier_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Dialog ref="supplier" :before-close="beforeClose" :config="config" v-bind="supplierList" @close="resetForm">
      <el-form ref="supplierFrom" :model="supplierFormData" :rules="supplierRules" label-width="100px">
        <el-form-item label="供应商类型" prop="type_id">
          <el-input v-model="supplierFormData.type_id" />
        </el-form-item>
        <el-form-item label="供应商库存" prop="in_stock">
          <el-input v-model="supplierFormData.in_stock" />
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

import { addSupplier, deleteSupplier, getAllSupplier, modifySupplier } from '@/api/supplier'
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
      // 所有供应商
      supplierList: [{
        supplier_id: 1,
        supplier_name: '赵彩云',
        contact_info: '123123123',
        supplier_company: '广西科达',
        supplier_social_code: 'abc',
        bank_code: 'abc',
        company_address: '广西',
        is_deleted: 0
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
      supplierFormData: {
        supplier_id: 1,
        supplier_name: '赵彩云',
        contact_info: '123123123',
        supplier_company: '广西科达',
        supplier_social_code: 'dsfafdsafasdf',
        bank_code: 'ddsfdsfadsf',
        company_address: '广西',
        is_deleted: 0
      },
      // 用户表单
      // 表单规则
      supplierRules: {
        id: 1,
        type_id: 1,
        in_stock: 1
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
      getAllSupplier().then(response => {
        this.supplierList = response.data
        this.listLoading = false
      })
    },
    // 启动弹窗
    controller(supplierFormData) {
      this.SupplierDataRef(supplierFormData)
      this.$refs.supplier.open(
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
    add() {
      this.$refs.supplierFrom.validate((valid) => {
        if (valid) {
          addSupplier(this.supplierFormData).then(response => {
            // 关闭弹窗
            this.$refs.supplier.cancel()
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
      this.$refs.supplierFrom.validate((valid) => {
        if (valid) {
          modifySupplier(this.supplierFormData).then(response => {
            // 关闭弹窗
            this.$refs.supplier.cancel()

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
    deleteSupplier(id) {
      deleteSupplier(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.data.msg)
        }
        // 获取数据
        this.fetchData()
      })
    },
    SupplierDataRef(supplierForm) {
      if (supplierForm != null) {
        this.supplierFormData = supplierForm
      }
    }
    // 结尾
  }
}
</script>
