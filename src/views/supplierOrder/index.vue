<template>
  <div class="supplierOrder-main">
    <el-button @click="openSupplierOrderAddWindows()">添加</el-button>
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
            <el-button size="small" type="text" @click="openEditWindows(scope.row.SupplierOrder)">编辑</el-button>
            <!-- 删除 -->
            <el-button size="small" type="text" @click="deleteSupplierOrder(scope.row.SupplierOrder.order_id)">删除</el-button>
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
    <Dialog ref="supplierOrderAddWindows" :before-close="beforeClose" :config="config" v-bind="supplierOrderList" @close="resetForm">
      <el-form ref="supplierOrderFrom" :model="supplierOrderFormData" :rules="supplierOrderRules" label-width="100px">

        <el-form-item label="供应商">
          <el-select v-model="supplierOrderFormData.supplier_id" placeholder="请选择">
            <el-option
              v-for="item in supplierList"
              :key="item.supplier_name"
              :label="item.supplier_name"
              :value="item.supplier_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料型号">
          <el-select v-model="supplierOrderFormData.material_id" placeholder="请选择">
            <el-option
              v-for="item in materialList"
              :key="item.material.material_name"
              :label="item.material.material_name"
              :value="item.material.material_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下单数量" prop="quantity">
          <el-input-number v-model="supplierOrderFormData.quantity" />
        </el-form-item>
        <el-form-item label="下单时间" prop="material_name">
          <el-date-picker
            v-model="supplierOrderFormData.dispatch_date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="操作">
          <el-button @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog ref="supplierOrderEditWindows" :before-close="beforeClose" :config="config" v-bind="supplierOrderList" @close="resetForm">
      <el-form ref="supplierOrderFrom" :model="supplierOrderFormData" :rules="supplierOrderRules" label-width="100px">
        <el-form-item label="供应商" prop="material_id">
          <el-select v-model="supplierOrderFormData.supplier_id" placeholder="请选择">
            <el-option
              v-for="item in supplierList"
              :key="item.supplier_name"
              :label="item.supplier_name"
              :value="item.supplier_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料型号" prop="material_id">
          <el-select v-model="supplierOrderFormData.material_id" placeholder="请选择">
            <el-option
              v-for="item in materialList"
              :key="item.material.material_name"
              :label="item.material.material_name"
              :value="item.material.material_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下单数量" prop="quantity">
          <el-input-number v-model="supplierOrderFormData.quantity" />
        </el-form-item>
        <el-form-item label="下单时间" prop="material_name">
          <el-date-picker
            v-model="supplierOrderFormData.dispatch_date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="操作">
          <el-button @click="modify()">修改</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>

</template>

<script>

import { addSupplierOrder, deleteSupplierOrder, getAllSupplierOrder, modifySupplierOrder } from '@/api/supplierOrder'
import { getAllMaterial } from '@/api/material'
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
      // 所有库存
      supplierOrderList: [],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '温馨提示',
        center: true,
        btnTxt: ['取消', '提交']
      },
      supplierOrderFormData: {
        order_id: 2,
        supplier_id: 1,
        material_id: 8,
        quantity: 123,
        dispatch_date: '2000-12-08',
        order_date: '2006-04-06 13:43:23'
        // is_delete: null
      },
      materialList: [],
      supplierList: [],
      // 用户表单
      // 表单规则
      supplierOrderRules: { },
      loading: false,
      total: 100, // 总条目数，需要根据实际情况设置
      pagesize: 10, // 每页显示的条目数1
      currentPage: 1, // 当前页码
      columns: [
        { prop: 'SupplierOrder.order_id', label: '订单ID' },
        { prop: 'SupplierOrder.supplier.supplier_name', label: '供应商名称' },
        { prop: 'SupplierOrder.material.material_name', label: '物料名称' },
        { prop: 'SupplierOrder.quantity', label: '数量' },
        { prop: 'SupplierOrder.dispatch_date', label: '交货日期' },
        { prop: 'SupplierOrder.order_date', label: '创建订单时间' }
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
      return this.supplierOrderList.slice(startIndex, endIndex)
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
      getAllSupplierOrder().then(response => {
        this.supplierOrderList = response.data
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
    openEditWindows(data) {
      if (data != null) {
        this.supplierOrderFormData = data
      }
      getAllMaterial().then(response => {
        this.materialList = response.data
      })
      getSupplier().then(response => {
        this.supplierList = response.data
      })
      this.$refs.supplierOrderEditWindows.open()
    },
    openSupplierOrderAddWindows() {
      this.supplierOrderFormData = {}
      getAllMaterial().then(response => {
        this.materialList = response.data
      })
      getSupplier().then(response => {
        this.supplierList = response.data
      })
      this.$refs.supplierOrderAddWindows.open()
    },
    beforeClose() {
      console.log('关闭前')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    add() {
      this.$refs.supplierOrderFrom.validate((valid) => {
        if (valid) {
          addSupplierOrder(this.supplierOrderFormData).then(response => {
            // 关闭弹窗
            this.$refs.supplierOrderAddWindows.cancel()
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
      this.$refs.supplierOrderFrom.validate((valid) => {
        if (valid) {
          modifySupplierOrder(this.supplierOrderFormData).then(response => {
            // 关闭弹窗
            this.$refs.supplierOrderEditWindows.cancel()

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
    deleteSupplierOrder(id) {
      deleteSupplierOrder(id).then(response => {
        if (response.code === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.msg)
        }
        // 获取数据
        this.fetchData()
      })
    }
    // 结尾
  }
}
</script>
