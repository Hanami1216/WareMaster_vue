<template>
  <div class="inventory-main">
    <el-button @click="openInventoryAddWindows()">添加</el-button>
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
            <el-button size="small" type="text" @click="openEditWindows(scope.row.inventory)">编辑</el-button>
            <!-- 删除 -->
            <el-button size="small" type="text" @click="deleteInventory(scope.row.inventory.inventory_id)">删除</el-button>
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
    <Dialog ref="inventoryAddWindows" :before-close="beforeClose" :config="config" v-bind="inventoryList" @close="resetForm">
      <el-form ref="inventoryFrom" :model="inventoryFormData" :rules="inventoryRules" label-width="100px">
        <el-form-item label="产品型号选择" prop="product_id">
          <el-select v-model="inventoryFormData.product_id" placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.product.product_name"
              :label="item.product.product_name"
              :value="item.product.product_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="product_id">
          <el-select v-model="inventoryFormData.warehouse_id" placeholder="请选择">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseInfo.warehouse_name"
              :label="item.warehouseInfo.warehouse_name"
              :value="item.warehouseInfo.warehouse_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量" prop="product_name">
          <el-input-number v-model="inventoryFormData.quantity" />
        </el-form-item>
        <el-form-item label="操作">
          <el-button @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog ref="inventory" :before-close="beforeClose" :config="config" v-bind="inventoryList" @close="resetForm">
      <el-form ref="inventoryFrom" :model="inventoryFormData" :rules="inventoryRules" label-width="100px">
        <el-form-item label="产品型号选择" prop="product_id">
          <el-select v-model="inventoryFormData.product_id" placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.product.product_name"
              :label="item.product.product_name"
              :value="item.product.product_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="product_id">
          <el-select v-model="inventoryFormData.warehouse_id" placeholder="请选择">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseInfo.warehouse_name"
              :label="item.warehouseInfo.warehouse_name"
              :value="item.warehouseInfo.warehouse_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量" prop="product_name">
          <el-input-number v-model="inventoryFormData.quantity" />
        </el-form-item>
        <el-form-item label="操作">
          <el-button size="big" @click="modify()">修改</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>

</template>

<script>

import { addInventory, deleteInventory, getAllInventory, modifyInventory } from '@/api/productInventory'
import { getAllProduct } from '@/api/product'
import { getWareHouse } from '@/api/warehouse'
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
      inventoryList: [],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '温馨提示',
        center: true,
        btnTxt: ['取消', '提交']
      },
      inventoryFormData: {
        inventory_id: 2,
        warehouse_id: 1,
        product_id: 8,
        quantity: 123,
        is_delete: 0
      },
      productList: [],
      warehouseList: [],
      // 用户表单
      // 表单规则
      inventoryRules: { },
      loading: false,
      total: 100, // 总条目数，需要根据实际情况设置
      pagesize: 10, // 每页显示的条目数1
      currentPage: 1, // 当前页码
      columns: [

        { prop: 'inventory.product.product_name', label: '产品名称' },
        { prop: 'inventory.product.description', label: '产品描述' },
        { prop: 'inventory.product.price', label: '价格' },
        { prop: 'inventory.product.cost', label: '成本' },
        { prop: 'inventory.quantity', label: '库存数量' },
        { prop: 'inventory.warehouseInfo.warehouse_name', label: '仓库名称' },
        { prop: 'inventory.warehouseInfo.address', label: '仓库地址' }
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
      return this.inventoryList.slice(startIndex, endIndex)
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
      getAllInventory().then(response => {
        this.inventoryList = response.data
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
        this.inventoryFormData = data
      }
      getAllProduct().then(response => {
        this.productList = response.data
      })
      getWareHouse().then(response => {
        this.warehouseList = response.data
      })
      this.$refs.inventory.open()
    },
    openInventoryAddWindows() {
      this.inventoryFormData = {}
      getAllProduct().then(response => {
        this.productList = response.data
      })
      getWareHouse().then(response => {
        this.warehouseList = response.data
      })
      this.$refs.inventoryAddWindows.open()
    },
    beforeClose() {
      console.log('关闭前')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    add() {
      this.$refs.inventoryFrom.validate((valid) => {
        if (valid) {
          addInventory(this.inventoryFormData).then(response => {
            // 关闭弹窗
            this.$refs.inventoryAddWindows.cancel()
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
      this.$refs.inventoryFrom.validate((valid) => {
        if (valid) {
          modifyInventory(this.inventoryFormData).then(response => {
            // 关闭弹窗
            this.$refs.inventory.cancel()

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
    deleteInventory(id) {
      deleteInventory(id).then(response => {
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
