<template>
  <div class="product-main">
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
        <el-table-column fixed="right" label="利润" width="150">
          <template slot-scope="scope">
            {{ calculateProfit(scope.row.product) }}元
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button size="small" type="text" @click="controller(scope.row.product)">编辑</el-button>
            <!-- 删除 -->
            <el-button size="small" type="text" @click="deleteProduct(scope.row.product.product_id)">删除</el-button>
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
    <Dialog ref="product" :before-close="beforeClose" :config="config" v-bind="productList" @close="resetForm">
      <el-form ref="productFrom" :model="productFormData" :rules="productRules" label-width="100px">
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="productFormData.product_name" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="productFormData.description" />
        </el-form-item>
        <el-form-item label="产品售价" prop="price">
          <el-input v-model="productFormData.price" />
        </el-form-item>
        <el-form-item label="产品成本" prop="cost">
          <el-input v-model="productFormData.cost" />
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

import { addProduct, deleteProduct, getAllProduct, modifyProduct } from '@/api/product'
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
      // 所有产品
      productList: [{ product: {
        product_id: 8,
        product_name: 'D58矮座',
        description: '个',
        price: 2.35,
        cost: 2.35,
        is_available: 1,
        is_deleted: 0
      }}],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '温馨提示',
        center: true,
        btnTxt: ['取消', '提交']
      },
      productFormData: {
        'product_id': 8,
        'product_name': 'D58矮座',
        'description': '个',
        'price': 2.35,
        'cost': 2.35,
        'is_available': 1,
        'is_deleted': 0
      },
      // 用户表单
      // 表单规则
      productRules: { },
      loading: false,
      total: 100, // 总条目数，需要根据实际情况设置
      pagesize: 10, // 每页显示的条目数1
      currentPage: 1, // 当前页码
      columns: [ // 表格列配置
        { prop: 'product.product_name', label: '产品名称' },
        { prop: 'product.description', label: '产品描述' },
        { prop: 'product.price', label: '售价' },
        { prop: 'product.cost', label: '成本' }
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
      return this.productList.slice(startIndex, endIndex)
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
      getAllProduct().then(response => {
        this.productList = response.data
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
    controller(productFormData) {
      this.ProductDataRef(productFormData)
      getSupplier().then(response => {
        this.supplierList = response.data
      })
      this.$refs.product.open(
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
      this.$refs.productFrom.validate((valid) => {
        if (valid) {
          addProduct(this.productFormData).then(response => {
            // 关闭弹窗
            this.$refs.product.cancel()
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
      this.$refs.productFrom.validate((valid) => {
        if (valid) {
          modifyProduct(this.productFormData).then(response => {
            // 关闭弹窗
            this.$refs.product.cancel()

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
    deleteProduct(id) {
      deleteProduct(id).then(response => {
        if (response.code === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.msg)
        }
        // 获取数据
        this.fetchData()
      })
    },
    ProductDataRef(productForm) {
      if (productForm != null) {
        this.productFormData = productForm
      }
    },
    calculateProfit(product) {
      // 计算利润的方法
      return (product.price - product.cost).toFixed(2)
    }
    // 结尾
  }
}
</script>
