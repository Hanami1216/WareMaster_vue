<template>
  <div class="material-main">
    <el-button @click="controller()">添加</el-button>
    <div>
      <el-table v-loading="loading" :data="currentPageData" border size="mini">
        <el-table-column align="center" label="序号" type="index" width="70px" show-overflow-tooltip />
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button size="small" type="text" @click="controller(scope.row.material)">编辑</el-button>
            <!-- 删除 -->
            <el-button size="small" type="text" @click="deleteMaterial(scope.row.material.material_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center">
        <el-pagination
          hide-on-single-page
          background
          layout="prev, pager, next,total"
          :total="total"
          :page-size="pagesize"
          @current-change="currentChange"
        />
      </div>
    </div>
    <Dialog ref="material" :before-close="beforeClose" :config="config" v-bind="materialList" @close="resetForm">
      <el-form ref="materialFrom" :model="materialFormData" :rules="materialRules" label-width="100px">
        <el-form-item label="物料名称" prop="material_name">
          <el-input v-model="materialFormData.material_name" />
        </el-form-item>
        <el-form-item label="物料描述" prop="description">
          <el-input v-model="materialFormData.description" />
        </el-form-item>
        <el-form-item label="物料价格" prop="price">
          <el-input v-model="materialFormData.price" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplier_id">
          <el-select v-model="materialFormData.supplier_id" placeholder="请选择">
            <el-option
              v-for="item in supplierList"
              :key="item.supplier_name"
              :label="item.supplier_name"
              :value="item.supplier_id"
            />
          </el-select>
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

import { addMaterial, deleteMaterial, getAllMaterial, modifyMaterial } from '@/api/material'
import { getSupplier } from '@/api/supplier'
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
      supplierList: [],
      // 所有物料
      materialList: [{
        supplier: {
          supplier_id: 1,
          supplier_name: '赵彩云',
          contact_info: '123123123',
          supplier_company: '广西科达',
          supplier_social_code: 'dsfafdsafasdf',
          bank_code: 'ddsfdsfadsf',
          company_address: '广西',
          is_deleted: 0
        },
        material: {
          material_id: 11,
          material_name: '从点非',
          description:
            '规格描述',
          price: 1,
          supplier_id: 1,
          _deleted: false,
          _available: true
        }
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
      materialFormData: {
        material_id: null,
        material_name: '物料名称',
        description: '规格描述',
        price: 0,
        supplier_id: 1,
        is_deleted: 0,
        is_available: 0
      },
      // 用户表单
      // 表单规则
      materialRules: { },
      loading: false,
      total: 100, // 总条目数，需要根据实际情况设置
      pagesize: 10, // 每页显示的条目数1
      currentPage: 1, // 当前页码
      columns: [ // 表格列配置
        { prop: 'material.material_name', label: '物料名称' },
        { prop: 'material.description', label: '物料描述' },
        { prop: 'material.price', label: '价格' },
        { prop: 'supplier.supplier_company', label: '公司名称' },
        { prop: 'supplier.supplier_name', label: '供应商姓名' },
        { prop: 'supplier.contact_info', label: '联系方式' }
        // 其他列配置
      ]
      // 尾
    }
  },
  computed: {
    currentPageData() {
      // 根据当前页码和每页显示的条目数截取数据
      const startIndex = (this.currentPage - 1) * this.pagesize
      const endIndex = this.currentPage * this.pagesize
      return this.materialList.slice(startIndex, endIndex)
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
      getAllMaterial().then(response => {
        this.materialList = response.data
        this.listLoading = false
      })
    },

    currentChange(currentPage) {
      // 处理分页变化事件
      this.currentPage = currentPage
      // 从后端获取当前页数据
      this.fetchData()
    },
    // 启动弹窗
    controller(materialFormData) {
      this.MaterialDataRef(materialFormData)
      getSupplier().then(response => {
        this.supplierList = response.data
      })
      this.$refs.material.open(
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
      this.$refs.materialFrom.validate((valid) => {
        if (valid) {
          addMaterial(this.materialFormData).then(response => {
            // 关闭弹窗
            this.$refs.material.cancel()
            if (response.code === 20011) {
              this.$message.success('添加成功')
            } else {
              this.$message.error(response.msg)
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
      this.$refs.materialFrom.validate((valid) => {
        if (valid) {
          modifyMaterial(this.materialFormData).then(response => {
            // 关闭弹窗
            this.$refs.material.cancel()

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
    deleteMaterial(id) {
      deleteMaterial(id).then(response => {
        if (response.code === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.msg)
        }
        // 获取数据
        this.fetchData()
      })
    },
    MaterialDataRef(materialForm) {
      if (materialForm != null) {
        this.materialFormData = materialForm
      }
    }
    // 结尾
  }
}
</script>
