<template>
  <div class="supplier-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="supplierList" border style="width: 100%">
      <el-table-column type="index" fixed label="序号" width="50" />
      <el-table-column fixed label="供应商名称" prop="supplier_name" />
      <el-table-column fixed label="联系信息" prop="contact_info" />
      <el-table-column fixed label="公司名称" prop="supplier_company" />
      <el-table-column fixed label="统一社会信用代码" prop="supplier_social_code" />
      <el-table-column fixed label="收款账号" prop="bank_code" />
      <el-table-column fixed label="公司地址" prop="company_address" />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteSupplier(scope.row.supplier_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Dialog ref="supplier" :before-close="beforeClose" :config="config" @close="resetForm">
      <el-form ref="supplierFrom" :model="supplierFormData" :rules="supplierRules" label-width="100px">
        <el-form-item label="供应商名称" prop="supplier_name">
          <el-input v-model="supplierFormData.supplier_name" />
        </el-form-item>
        <el-form-item label="联系信息" prop="contact_info">
          <el-input v-model="supplierFormData.contact_info" />
        </el-form-item>
        <el-form-item label="供应商公司" prop="supplier_company">
          <el-input v-model="supplierFormData.supplier_company" />
        </el-form-item>
        <el-form-item label="社会代码" prop="supplier_social_code">
          <el-input v-model="supplierFormData.supplier_social_code" />
        </el-form-item>
        <el-form-item label="银行代码" prop="bank_code">
          <el-input v-model="supplierFormData.bank_code" />
        </el-form-item>
        <el-form-item label="公司地址" prop="company_address">
          <el-input v-model="supplierFormData.company_address" />
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

import { addSupplier, deleteSupplier, getSupplier, modifySupplier } from '@/api/supplier'
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
      // 所有supplier
      supplierList: [{
        supplier_id: null,
        supplier_name: '赵彩云',
        contact_info: '13450295413',
        supplier_company: '广西科达',
        supplier_social_code: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        bank_code: 'abc',
        company_address: '广西',
        is_deleted: 0
      }],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '信息操作',
        center: true,
        btnTxt: ['取消', '提交']
      },
      supplierFormData: {
        supplier_id: null,
        supplier_name: '张三',
        contact_info: '18012345678',
        supplier_company: '北京科技有限公司',
        supplier_social_code: '1234567890abcdefgh',
        bank_code: '1234567890123456',
        company_address: '北京市海淀区',
        is_deleted: 0
      },
      // 用户表单
      // 表单规则
      supplierRules: {
        supplier_name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/, message: '供应商名称只能包含中文、字母和数字', trigger: 'blur' }
        ],
        contact_info: [
          { required: true, message: '请输入联系信息', trigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '联系信息需要是有效的手机号码', trigger: 'blur' }
        ],
        supplier_company: [
          { required: true, message: '请输入供应商公司', trigger: 'blur' }
        ],
        supplier_social_code: [
          { required: true, message: '请输入社会代码', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]{18}$/, message: '社会代码需要是18位的数字和字母的组合', trigger: 'blur' }
        ],
        bank_code: [
          { required: true, message: '请输入银行代码', trigger: 'blur' },
          { pattern: /^\d{16,19}$/, message: '银行代码需要是16到19位的数字', trigger: 'blur' }
        ],
        company_address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
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
      getSupplier().then(response => {
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
            if (response.code === 20011) {
              this.$message.success('添加成功')
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
    modify() {
      this.$refs.supplierFrom.validate((valid) => {
        if (valid) {
          modifySupplier(this.supplierFormData).then(response => {
            // 关闭弹窗
            this.$refs.supplier.cancel()

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
    deleteSupplier(id) {
      deleteSupplier(id).then(response => {
        if (response.code === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.msg)
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
