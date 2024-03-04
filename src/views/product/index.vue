<template>
  <div class="product-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="productList" border style="width: 100%">
      <el-table-column fixed label="产品名称" prop="product.product_name" />
      <el-table-column fixed label="产品描述" prop="product.description" />
      <el-table-column fixed label="产品价格" prop="product.price" />
      <el-table-column fixed label="成本价格" prop="product.cost" />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row.product)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteProduct(scope.row.product.product_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Dialog ref="product" :before-close="beforeClose" :config="config" v-bind="productList" @close="resetForm">
      <el-form ref="productFrom" :model="productFormData" :rules="productRules" label-width="100px">
        <el-form-item label="产品类型" prop="type_id">
          <el-input v-model="productFormData.type_id" />
        </el-form-item>
        <el-form-item label="产品库存" prop="in_stock">
          <el-input v-model="productFormData.in_stock" />
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
      // 所有产品
      productList: [
        {'product': {
          'product_id': 8,
          'product_name': 'D58矮座',
          'description': '个',
          'price': 2.35,
          'cost': 2.35,
          'is_available': 1,
          'is_deleted': 0
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
        product_id: 11,
        product_name: '从点非',
        description:
              '具总适片重按了展划最百压百气。想列报油白油系观规整称院元至化。干目着能团对领眼文只内儿时。你更国战较点不联导济对道日。革特只打际真器只须成感十须分好合。',
        price: null,
        supplier_id: 1,
        is_deleted: false,
        is_available: true
      },
      // 用户表单
      // 表单规则
      productRules: {
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
      getAllProduct().then(response => {
        this.productList = response.data
        this.listLoading = false
      })
    },
    // 启动弹窗
    controller(productFormData) {
      this.ProductDataRef(productFormData)
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
      this.$refs.productFrom.validate((valid) => {
        if (valid) {
          modifyProduct(this.productFormData).then(response => {
            // 关闭弹窗
            this.$refs.product.cancel()

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
    deleteProduct(id) {
      deleteProduct(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.data.msg)
        }
        // 获取数据
        this.fetchData()
      })
    },
    ProductDataRef(productForm) {
      if (productForm != null) {
        this.productFormData = productForm
      }
    }
    // 结尾
  }
}
</script>
