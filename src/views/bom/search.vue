<template>
  <div>
    <el-row>
      <el-col :span="3" class="left">
        <img src="//s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="美团">
      </el-col>
      <el-col :span="8" class="center">
        <el-input v-model="search" placeholder="搜索产品" @keyup.enter.native="searchHandler">
          <el-button id="search" slot="append" icon="el-icon-search" @click="searchHandler" />
        </el-input>
      </el-col>
      <el-col :span="2" class="right">
        <el-button @click="openMaterialInfoFromWindows">产品物料信息添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="[product]" border style="width: 100%">
      <el-table-column fixed label="产品名称" prop="product_name" />
      <el-table-column fixed label="产品描述" prop="description" />
      <el-table-column fixed label="产品价格" prop="price" />
      <el-table-column fixed label="成本价格" prop="cost" />
    </el-table>
    <AddMaterialInfo ref="openDialog" :before-close="beforeClose" :config="config" @close="resetForm">
      <el-form label-width="100px">
        <el-form-item label="产品名称" prop="">
          <h1>{{ product.product_name }}</h1>
        </el-form-item>
        <el-form-item label="物料名称" prop="">
          <el-select v-model="BOM_item.material_id" placeholder="请选择需要添加的物料">
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
          <el-button @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
    </AddMaterialInfo>
  </div>
</template>

<script>
import { addBom, getAllBom } from '@/api/bom'
import AddMaterialInfo from './AddMaterialInfo.vue'
import { getAllMaterial } from '@/api/material'
export default {
  components: {
    AddMaterialInfo
  },
  data() {
    return {
      search: '', // 当前输入框的值
      searchList: ['暂无数据'],
      product: {},
      materialList: [],
      BOM_item: {
        bom_id: null,
        product_name: '',
        material_id: null,
        quantity: 0,
        unit: '',
        is_deleted: 0
      },
      material_list: [], // 物料选择下拉框数据
      config: {
        top: '10vh',
        width: '500px',
        title: '物料信息添加',
        center: true,
        btnTxt: ['取消', '提交']
      }
    }
  },
  computed: {
    isHistorySearch() {
      return this.isFocus && !this.search
    },
    isSearchList() {
      return this.isFocus && this.search
    },
    isSearch() {
      return this.isFocus
    }
  },
  methods: {
    beforeClose() {
      console.log('关闭')
    },
    searchHandler() {
      // 搜索操作
      getAllBom({ productName: this.search }).then(response => {
        if (response.code === 20041) {
          this.$message.success('获取所有物料信息成功')
          // 清空信息
          this.product = {}
          this.materialList = []
          this.searchList = response.data
          this.searchList.forEach(item => {
            if (item.product) {
              this.product = item.product
            } else {
              this.materialList.push(item)
            }
            this.$emit('search', this.materialList, this.product)
          })
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    // 添加物料信息
    openMaterialInfoFromWindows() {
      this.$message.success('窗口打开成功')
      // 刷新操作
      getAllMaterial().then(response => {
        this.material_list = response.data
      })
      this.$refs.openDialog.open(cancel => {
        // cancel();
        console.log('点击提交按钮了')
      })
        .then(() => {
          console.log(this.$refs.span)
        })
    },
    closeHandler() {
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    add() {
      // 关闭弹窗
      this.$refs.openDialog.cancel()
      this.BOM_item.product_name = this.product.product_name
      addBom(this.BOM_item).then(response => {
        // 触发父组件更新数据
        this.$emit('add')
        if (response.code === 20011) {
          this.$message.success('物料添加成功')
          this.searchHandler()
        } else {
          this.$message.error('物料添加失败')
        }
      })
    }
  }
}
</script>

<style>
.left {
  margin-left: 200px;
}

.center {
  margin-top: 15px;
  margin-left: 200px;
}

.right {
  margin-top: 20px;
  margin-left: 200px;
}

#search {
  background-color: #ffffffff;
  border-radius: 0%;
}

.search-title {
  color: #bdbaba;
  font-size: 15px;
  margin-bottom: 5px;
}
</style>
