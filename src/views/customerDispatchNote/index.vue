<template>
  <div class="customerDispatchNote-main">
    <el-button @click="openCustomerDispatchNoteAddWindows()">添加</el-button>
    <div>
      <el-table v-loading="loading" :data="currentPageData" border size="mini">
        <!-- <el-table-column align="center" label="序号" type="index" width="70px" show-overflow-tooltip /> -->
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
            <el-button size="small" type="text" @click="openEditWindows(scope.row.CustomerDispatchNote)">编辑</el-button>
            <!-- 删除 -->
            <el-button size="small" type="text" @click="deleteCustomerDispatchNote(scope.row.CustomerDispatchNote.note_id)">删除</el-button>
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
    <Dialog ref="customerDispatchNoteAddWindows" :before-close="beforeClose" :config="config" v-bind="customerDispatchNoteList" @close="resetForm">
      <el-form ref="customerDispatchNoteFrom" :model="customerDispatchNoteFormData" :rules="customerDispatchNoteRules" label-width="100px">
        <el-form-item label="客户">
          <el-select v-model="customerDispatchNoteFormData.customer_id" placeholder="请选择">
            <el-option
              v-for="item in customerList"
              :key="item.customer_name"
              :label="item.customer_name"
              :value="item.customer_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号选择">
          <el-select v-model="customerDispatchNoteFormData.product_id" placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.product.product_name"
              :label="item.product.product_name"
              :value="item.product.product_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库选择">
          <el-select v-model="customerDispatchNoteFormData.warehouse_id" placeholder="请选择">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseInfo.warehouse_name"
              :label="item.warehouseInfo.warehouse_name"
              :value="item.warehouseInfo.warehouse_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送货单经手人">
          <el-select v-model="customerDispatchNoteFormData.user_id" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.user_name"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送货数量" prop="quantity">
          <el-input-number v-model="customerDispatchNoteFormData.quantity" />
        </el-form-item>
        <el-form-item label="送货时间" prop="product_name">
          <el-date-picker
            v-model="customerDispatchNoteFormData.dispatch_date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="操作">
          <el-button @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog ref="customerDispatchNoteEditWidows" :before-close="beforeClose" :config="config" v-bind="customerDispatchNoteList" @close="resetForm">
      <el-form ref="customerDispatchNoteFrom" :model="customerDispatchNoteFormData" :rules="customerDispatchNoteRules" label-width="100px">
        <el-form-item label="客户">
          <el-select v-model="customerDispatchNoteFormData.customer_id" placeholder="请选择">
            <el-option
              v-for="item in customerList"
              :key="item.customer_name"
              :label="item.customer_name"
              :value="item.customer_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号选择">
          <el-select v-model="customerDispatchNoteFormData.product_id" placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.product.product_name"
              :label="item.product.product_name"
              :value="item.product.product_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库选择">
          <el-select v-model="customerDispatchNoteFormData.warehouse_id" placeholder="请选择">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseInfo.warehouse_name"
              :label="item.warehouseInfo.warehouse_name"
              :value="item.warehouseInfo.warehouse_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送货单经手人">
          <el-select v-model="customerDispatchNoteFormData.user_id" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.user_name"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送货数量" prop="quantity">
          <el-input-number v-model="customerDispatchNoteFormData.quantity" />
        </el-form-item>
        <el-form-item label="送货时间" prop="product_name">
          <el-date-picker
            v-model="customerDispatchNoteFormData.dispatch_date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="操作">
          <el-button size="big" style="margin: auto;" @click="modify()">修改</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>

</template>

<script>

import { addCustomerDispatchNote, deleteCustomerDispatchNote, getAllCustomerDispatchNote, modifyCustomerDispatchNote } from '@/api/customerDispatchNote'
import { getAllProduct } from '@/api/product'
import { getCustomer } from '@/api/customer'
import Dialog from '@/components/dialog.vue'
import { getWareHouse } from '@/api/warehouse'
import { getUser } from '@/api/user'

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
      customerDispatchNoteList: [],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '出货单',
        center: true,
        btnTxt: ['取消', '提交']
      },
      customerDispatchNoteFormData: {
        note_id: 18,
        customer_id: 1,
        product_id: 1,
        warehouse_id: 1,
        quantity: 49,
        out_time: '2002-11-13 17:26:37',
        user_id: 1,
        remark: null
        // is_delete: null
      },
      productList: [],
      customerList: [],
      warehouseList: [],
      userList: [],
      // 用户表单
      // 表单规则
      customerDispatchNoteRules: { },
      loading: false,
      total: 100, // 总条目数，需要根据实际情况设置
      pagesize: 10, // 每页显示的条目数1
      currentPage: 1, // 当前页码
      // columns: [
      //   { prop: 'CustomerDispatchNote.note_id', label: '订单ID' },
      //   { prop: 'CustomerDispatchNote.customer.customer_name', label: '客户名称' },
      //   { prop: 'CustomerDispatchNote.product.product_name', label: '产品名称' },
      //   { prop: 'CustomerDispatchNote.quantity', label: '数量' },
      //   { prop: 'CustomerDispatchNote.dispatch_date', label: '交货日期' },
      //   { prop: 'CustomerDispatchNote.order_date', label: '创建订单时间' }
      //   // 其他列配置
      // ]
      columns: [
        { prop: 'CustomerDispatchNote.note_id', label: '订单ID' },
        { prop: 'CustomerDispatchNote.customer.customer_name', label: '客户名称' },
        { prop: 'CustomerDispatchNote.customer.customer_company', label: '客户公司' },
        { prop: 'CustomerDispatchNote.customer.contact_info', label: '联系信息' },
        { prop: 'CustomerDispatchNote.customer.company_address', label: '公司地址' },
        { prop: 'CustomerDispatchNote.product.product_name', label: '产品名称' },
        { prop: 'CustomerDispatchNote.product.description', label: '产品描述' },
        { prop: 'CustomerDispatchNote.product.price', label: '价格' },
        { prop: 'CustomerDispatchNote.quantity', label: '数量' },
        { prop: 'CustomerDispatchNote.out_time', label: '出货时间' },
        { prop: 'CustomerDispatchNote.user.user_name', label: '送货单经手人' },
        { prop: 'CustomerDispatchNote.warehouseInfo.warehouse_name', label: '仓库名称' }
      ]

      // 尾
    }
  },
  computed: {
    currentPageData() {
      // 根据当前页码和每页显示的条目数截取数据
      const startIndex = (this.currentPage - 1) * this.pagesize
      const endIndex = this.currentPage * this.pagesize
      return this.customerDispatchNoteList.slice(startIndex, endIndex)
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
      getAllCustomerDispatchNote().then(response => {
        this.customerDispatchNoteList = response.data
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
        this.customerDispatchNoteFormData = data
      }
      getAllProduct().then(response => {
        this.productList = response.data
      })
      getCustomer().then(response => {
        this.customerList = response.data
      })
      getWareHouse().then(response => {
        this.warehouseList = response.data
      })
      getUser().then(response => {
        this.userList = response.data
      })
      this.$refs.customerDispatchNoteEditWidows.open()
    },
    openCustomerDispatchNoteAddWindows() {
      this.customerDispatchNoteFormData = {}
      getAllProduct().then(response => {
        this.productList = response.data
      })
      getCustomer().then(response => {
        this.customerList = response.data
      })
      getWareHouse().then(response => {
        this.warehouseList = response.data
      })
      getUser().then(response => {
        this.userList = response.data
      })
      this.$refs.customerDispatchNoteAddWindows.open()
    },
    beforeClose() {
      console.log('关闭前')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    add() {
      this.$refs.customerDispatchNoteFrom.validate((valid) => {
        if (valid) {
          addCustomerDispatchNote(this.customerDispatchNoteFormData).then(response => {
            // 关闭弹窗
            this.$refs.customerDispatchNoteAddWindows.cancel()
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
      this.$refs.customerDispatchNoteFrom.validate((valid) => {
        if (valid) {
          modifyCustomerDispatchNote(this.customerDispatchNoteFormData).then(response => {
            // 关闭弹窗
            this.$refs.customerDispatchNoteEditWidows.cancel()

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
    deleteCustomerDispatchNote(id) {
      deleteCustomerDispatchNote(id).then(response => {
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
