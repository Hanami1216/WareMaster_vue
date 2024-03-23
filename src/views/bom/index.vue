<template>
  <div class="material-main">
    <Search @search="handleSearch" />
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table :data="materialList" border style="width: 100%">
      <el-table-column fixed label="ID" type="index" width="150" />
      <el-table-column fixed label="物料名称" prop="material.material_name" />
      <el-table-column fixed label="物料描述" prop="material.description" />
      <el-table-column fixed label="物料价格" prop="material.price" />
      <!-- <el-table-column fixed label="数量" prop="quantity" />
      <el-table-column fixed label="单位" prop="unit" /> -->
      <el-table-column fixed label="供应商名称" prop="supplier.supplier_name" />
      <el-table-column fixed label="联系信息" prop="supplier.contact_info" />
      <el-table-column fixed label="公司名称" prop="supplier.supplier_company" />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row.material)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteMaterial(scope.row.material.material_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Dialog ref="openDialog" :before-close="beforeClose" :config="config" @close="resetForm">
      <el-form label-width="100px">
        <el-form-item label="产品名称" prop="">
          <h1>{{ product.product_name }}</h1>
        </el-form-item>
        <el-form-item label="物料名称" prop="">
          <el-select v-model="BOM_item.material_id" placeholder="请选择需要修改的物料型号">
            <el-option
              v-for="item in material_list"
              :key="item.material.material_name"
              :label="item.material.material_name"
              :value="item.material.material_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="">
          <el-input-number v-model="BOM_item.quantity" />
        </el-form-item>
        <el-form-item label="单位" prop="">
          <el-input v-model="BOM_item.unit" size="mini" style="width: 100px;" />
        </el-form-item>
        <el-form-item label="操作">
          <el-button @click="modify()">修改</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>

</template>

<script>

import Dialog from '@/components/dialog.vue'
import Search from './search.vue'
import { getAllMaterial } from '@/api/material'
import { modifyBom } from '@/api/bom'
export default {
  components: {
    Dialog,
    Search
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
      product: {},
      // 所有物料清单
      materialList: [],
      config: {
        top: '10vh',
        width: '500px',
        title: '温馨提示',
        center: true,
        btnTxt: ['取消', '提交']
      },
      materialFormData: {},
      // 用户表单
      // 表单规则
      materialRules: {
        id: 1,
        type_id: 1,
        in_stock: 1
      },
      BOM_item: {
        bom_id: null,
        product_name: '',
        material_id: null,
        quantity: 0,
        unit: '',
        is_deleted: 0
      },
      material_list: []
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
    },
    handleSearch(materialList, product) {
      this.materialList = materialList
      this.product = product
    },
    // 启动弹窗
    controller(materialFormData) {
      this.MaterialDataRef(materialFormData)
      this.$refs.openDialog.open()
      getAllMaterial().then(response => {
        this.material_list = response.data
      })
    },
    beforeClose() {
      // console.log('关闭前')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    MaterialDataRef(materialForm) {
      if (materialForm != null) {
        this.materialFormData = materialForm
      }
    },
    modify() {
      modifyBom(this.BOM_item).then(response => {
        if (response.code === 20011) {
          this.$message.success('物料修改成功')
        } else {
          this.$message.error('物料修改失败')
        }
      })
    }
    // 结尾
  }
}
</script>
