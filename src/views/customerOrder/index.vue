<template>
  <div class="customerOrder-main">
    <el-button @click="openCustomerOrderAddWindows()">添加</el-button>
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
            <el-button size="small" type="text" @click="openEditWindows(scope.row.CustomerOrder)">编辑</el-button>
            <!-- 删除 -->
            <el-button size="small" type="text" @click="deleteCustomerOrder(scope.row.CustomerOrder.order_id)">删除</el-button>
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
    <Dialog ref="customerOrderAddWindows" :before-close="beforeClose" :config="config" v-bind="customerOrderList" @close="resetForm">
      <el-form ref="customerOrderFrom" :model="customerOrderFormData" :rules="customerOrderRules" label-width="100px">

        <el-form-item label="客户" prop="product_id">
          <el-select v-model="customerOrderFormData.customer_id" placeholder="请选择">
            <el-option
              v-for="item in customerList"
              :key="item.customer_name"
              :label="item.customer_name"
              :value="item.customer_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号选择" prop="product_id">
          <el-select v-model="customerOrderFormData.product_id" placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.product.product_name"
              :label="item.product.product_name"
              :value="item.product.product_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下单数量" prop="quantity">
          <el-input-number v-model="customerOrderFormData.quantity" />
        </el-form-item>
        <el-form-item label="下单时间" prop="product_name">
          <el-date-picker
            v-model="customerOrderFormData.dispatch_date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="操作">
          <el-button @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog ref="customerOrder" :before-close="beforeClose" :config="config" v-bind="customerOrderList" @close="resetForm">
      <el-form ref="customerOrderFrom" :model="customerOrderFormData" :rules="customerOrderRules" label-width="100px">
        <el-form-item label="客户" prop="product_id">
          <el-select v-model="customerOrderFormData.customer_id" placeholder="请选择">
            <el-option
              v-for="item in customerList"
              :key="item.customer_name"
              :label="item.customer_name"
              :value="item.customer_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号选择" prop="product_id">
          <el-select v-model="customerOrderFormData.product_id" placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.product.product_name"
              :label="item.product.product_name"
              :value="item.product.product_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下单数量" prop="quantity">
          <el-input-number v-model="customerOrderFormData.quantity" />
        </el-form-item>
        <el-form-item label="下单时间" prop="product_name">
          <el-date-picker
            v-model="customerOrderFormData.dispatch_date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="操作">
          <el-button @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>

</template>

<script>

import { addCustomerOrder, deleteCustomerOrder, getAllCustomerOrder, modifyCustomerOrder } from '@/api/customerOrder'
import { getAllProduct } from '@/api/product'
import { getCustomer } from '@/api/customer'
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
      customerOrderList: [],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '温馨提示',
        center: true,
        btnTxt: ['取消', '提交']
      },
      customerOrderFormData: {
        order_id: 2,
        customer_id: 1,
        product_id: 8,
        quantity: 123,
        dispatch_date: '2000-12-08',
        order_date: '2006-04-06 13:43:23'
        // is_delete: null
      },
      productList: [],
      customerList: [],
      // 用户表单
      // 表单规则
      customerOrderRules: { },
      loading: false,
      total: 100, // 总条目数，需要根据实际情况设置
      pagesize: 10, // 每页显示的条目数1
      currentPage: 1, // 当前页码
      columns: [
        { prop: 'CustomerOrder.order_id', label: '订单ID' },
        { prop: 'CustomerOrder.customer.customer_name', label: '客户名称' },
        { prop: 'CustomerOrder.product.product_name', label: '产品名称' },
        { prop: 'CustomerOrder.quantity', label: '数量' },
        { prop: 'CustomerOrder.dispatch_date', label: '交货日期' },
        { prop: 'CustomerOrder.order_date', label: '创建订单时间' }
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
      return this.customerOrderList.slice(startIndex, endIndex)
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
      getAllCustomerOrder().then(response => {
        this.customerOrderList = response.data
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
        this.customerOrderFormData = data
      }
      getAllProduct().then(response => {
        this.productList = response.data
      })
      getCustomer().then(response => {
        this.customerList = response.data
      })
      this.$refs.customerOrder.open()
    },
    openCustomerOrderAddWindows() {
      this.customerOrderFormData = {}
      getAllProduct().then(response => {
        this.productList = response.data
      })
      getCustomer().then(response => {
        this.customerList = response.data
      })
      this.$refs.customerOrderAddWindows.open()
    },
    beforeClose() {
      console.log('关闭前')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    add() {
      this.$refs.customerOrderFrom.validate((valid) => {
        if (valid) {
          addCustomerOrder(this.customerOrderFormData).then(response => {
            // 关闭弹窗
            this.$refs.customerOrderAddWindows.cancel()
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
      this.$refs.customerOrderFrom.validate((valid) => {
        if (valid) {
          modifyCustomerOrder(this.customerOrderFormData).then(response => {
            // 关闭弹窗
            this.$refs.customerOrder.cancel()

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
    deleteCustomerOrder(id) {
      deleteCustomerOrder(id).then(response => {
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
