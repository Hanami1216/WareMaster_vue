
<template>
  <div class="goods-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="goodsList" border style="width: 100%">

      <el-table-column fixed type="index" label="ID" />
      <el-table-column fixed prop="goodsType.type_desc" label="零件简介" />id
      <el-table-column fixed prop="goodsType.type_id" label="零件类型ID" />
      <el-table-column fixed prop="goods_num" label="零件数量" />
      <el-table-column fixed prop="goodsType.type_price" label="零件价格" />
<!-- 
      <el-table-column fixed label="仓库">

        <el-select
          v-model="goodsForm.repositoryList.repository_id"
          size="big"
          placeholder="请选择负责人"
          style="width: 140px"
          clearable
        >
          <el-option
            v-for="repository in goodsList.repositoryList"
            :key="repository.repository_id"
            :label="repositoryList.repository_desc"
            :value="repositoryList.repository_id"
          />
        </el-select>

      </el-table-column> -->
      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        // eslint-disable-next-line vue/no-unused-vars
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button type="text" size="small" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button type="text" size="small" @click="delete(scope.row.goods_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作弹窗 -->
    <Dialog ref="goods" :config="config" :before-close="beforeClose" @close="resetForm">
      <el-form ref="goodsForm" :model="goodsForm" :rules="goodsRules" label-width="100px">
        <el-form-item label="零件简介">
          <el-input v-model="goodsForm.goodsType.type_desc" :disabled="true" />
        </el-form-item>
        <el-form-item label="零件类型ID">
          <el-input v-model="goodsForm.goodsType" />
          <el-select
            v-model="goodsForm.goodsType"
            size="big"
            placeholder="请选择负责人"
            style="width: 200px"
          >
            <el-option
              v-for="goods in goodsList"
              :key="goods.goodsType"
              :label="goods.goodsType.type_desc"
              :value="goods.goodsType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="零件数目">
          <el-input v-model="goodsForm.goods_num" />
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

import { getGoods, addGoods, modifyGoods, deleteGoods } from '@/api/goods'
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
        goods_id: 1,
        goods_num: 99997398,
        goodsType: {
          type_id: 1,
          type_desc: '微星显卡 3060ti',
          type_price: 3999
        },
        repositoryList: [
          {
            repository_id: 1,
            repository_address: '广州市花都区学府1号',
            repository_area: 999,
            repository_level: 1,
            repository_desc: '广州城市理工学院',
            goods: null
          },
          {
            repository_id: 2,
            repository_address: '广州市花都区学府1号',
            repository_area: 999,
            repository_level: 1,
            repository_desc: '广州城市理工学院',
            goods: null
          }
        ]
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
      goodsForm: {
        goods_id: 1,
        goods_num: 99997398,
        goodsType: {
          type_id: 1,
          type_desc: '微星显卡 3060ti',
          type_price: 3999
        },
        repositoryList: [
          {
            repository_id: 1,
            repository_address: '广州市花都区学府1号',
            repository_area: 999,
            repository_level: 1,
            repository_desc: '广州城市理工学院',
            goods: null
          },
          {
            repository_id: 2,
            repository_address: '广州市花都区学府1号',
            repository_area: 999,
            repository_level: 1,
            repository_desc: '广州城市理工学院',
            goods: null
          }
        ]
      },

      // 用户表单
      // 表单规则
      goodsRules: {
        goods_num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
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
      getGoods().then(response => {
        this.goodsList = response.data.data
        this.listLoading = false
      })
    },
    // 启动弹窗
    controller(goodsForm) {
      this.GoodsDataRef(goodsForm)
      this.$refs.goods.open(
        cancel => {
        // cancel();
          console.log('点击提交按钮了')
        })
        .then(() => { console.log(this.$refs.span) }
        )
    },
    beforeClose() {
      console.log('关闭前')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    add() {
      this.$refs.goodsForm.validate((valid) => {
        if (valid) {
          addGoods(this.goodsForm).then(response => {
            // 关闭弹窗
            this.$refs.goods.cancel()
            if (response.data.result === 20011) {
              this.$message.success('添加成功')
            } else this.$message.error(response.data.msg)

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
      this.$refs.goodsForm.validate((valid) => {
        if (valid) {
          modifyGoods(this.goodsForm).then(response => {
            // 关闭弹窗
            this.$refs.goods.cancel()

            if (response.data.result === 20031) {
              this.$message.success('修改成功')
            } else this.$message.error('修改失败')
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
    delete(id) {
      deleteGoods(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('修改成功')
        } else this.$message.error(response.data.msg)
        // 获取数据
        this.fetchData()
      })
    },
    GoodsDataRef(goodsForm) {
      if (goodsForm != null) {
        this.goodsForm = goodsForm
      }
    }
    // 结尾
  }
}
</script>
