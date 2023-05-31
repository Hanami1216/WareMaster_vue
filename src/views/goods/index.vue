<template>
  <div class="goods-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="goodsList" border style="width: 100%">

      <el-table-column fixed label="ID" type="index" />
      <el-table-column fixed label="零件名称" prop="goodsType.name" />
      <el-table-column fixed label="零件类型" prop="goodsType.type" />
      <el-table-column fixed label="零件数量" prop="in_stock" />
      <el-table-column fixed label="零件价格" prop="goodsType.price" />
      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Dialog ref="goods" :before-close="beforeClose" :config="config" v-bind="goodsList" @close="resetForm">
      <el-form ref="goodsFrom" :model="goodsFormData" :rules="goodsRules" label-width="100px">
        <el-form-item label="零件类型" prop="type_id">
          <el-input v-model="goodsFormData.type_id" />
        </el-form-item>
        <el-form-item label="零件库存" prop="in_stock">
          <el-input v-model="goodsFormData.in_stock" />
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

import { addGoods, deleteGoods, getAllGoods, modifyGoods } from '@/api/goods'
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
      // 所有零件
      goodsList: [{
        id: 1,
        in_stock: 99997398,
        goodsType: {
          id: 1,
          type: '微星显卡 3060ti',
          name: 'null',
          price: 3999
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
      goodsFormData: {
        id: 1,
        type_id: 1,
        in_stock: 1
      },

      // 用户表单
      // 表单规则
      goodsRules: {
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
      getAllGoods().then(response => {
        this.goodsList = response.data
        this.listLoading = false
      })
    },
    // 启动弹窗
    controller(goodsFormData) {
      this.GoodsDataRef(goodsFormData)
      this.$refs.goods.open(
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
      this.$refs.goodsFrom.validate((valid) => {
        if (valid) {
          addGoods(this.goodsFormData).then(response => {
            // 关闭弹窗
            this.$refs.goods.cancel()
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
      this.$refs.goodsFrom.validate((valid) => {
        if (valid) {
          modifyGoods(this.goodsFormData).then(response => {
            // 关闭弹窗
            this.$refs.goods.cancel()

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
    deleteGoods(id) {
      deleteGoods(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.data.msg)
        }
        // 获取数据
        this.fetchData()
      })
    },
    GoodsDataRef(goodsForm) {
      if (goodsForm != null) {
        this.goodsFormData = goodsForm
      }
    }
    // 结尾
  }
}
</script>
