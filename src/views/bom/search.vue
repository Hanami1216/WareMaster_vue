<template>
  <div>
    <el-row>
      <el-col :span="3" class="left">
        <img src="//s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="美团">
      </el-col>
      <el-col :span="8" class="center">
        <el-input
          v-model="search"
          placeholder="搜索产品"
          @keyup.enter.native="searchHandler"
        >
          <el-button id="search" slot="append" icon="el-icon-search" @click="searchHandler" />
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="productList" border style="width: 100%">
      <el-table-column fixed label="产品名称" prop="product_name" />
      <el-table-column fixed label="产品描述" prop="description" />
      <el-table-column fixed label="产品价格" prop="price" />
      <el-table-column fixed label="成本价格" prop="cost" />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="editProduct(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteProduct(scope.row.product_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllBom } from '@/api/bom'

export default {
  data() {
    return {
      search: '', // 当前输入框的值
      searchList: ['暂无数据'],
      productList: [],
      materialList: []
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
    searchHandler() {
      // 搜索操作
      getAllBom({ productName: this.search }).then(response => {
        console.log('1')
        console.log(response)
        if (response.code === 20041) {
          console.log('2')
          this.$message.success('获取所有物料信息成功')

          // 清空信息
          // this.productList = []
          // this.materialList = []
          this.searchList = response.data
          this.searchList.forEach(item => {
            if (item.product) {
              this.productList.push(item.product)
            } else {
              this.materialList.push(item)
            }
            this.$emit('search', this.materialList)
          })
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    closeHandler() {
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
  #search {
    background-color: #ffffffff;
    border-radius: 0%;
  }
  .search-title {
    color: #bdbaba;
    font-size: 15px;
    margin-bottom: 5px;
  }
  .remove-history {
    color: #bdbaba;
    font-size: 15px;
    float: right;
    margin-top: -22px;
  }
  #search-box {
    width: 555px;
    height: 300px;
    margin-top: 0px;
    padding-bottom: 20px;
  }
  </style>
