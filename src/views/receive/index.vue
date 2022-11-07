
<template>
  <div class="receive-main">
    <el-button @click="controller(receiveFormData)">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="recordList" border style="width: 100%">

      <el-table-column fixed type="index" label="ID" width="150" />
      <el-table-column fixed prop="record_num" label="入货数量" width="150" />
      <el-table-column fixed prop="record_time" label="入货日期" width="150" />
      <el-table-column fixed prop="supplier.supplier_name" label="负责人" width="150" />
      <el-table-column fixed prop="user.user_name" label="负责人" width="150" />
      <el-table-column fixed prop="goods.goods_id" label="零件" width="150" />
      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button type="text" size="small" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button type="text" size="small" @click="deleteReceive(scope.row.receive_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作弹窗 -->
    <Dialog ref="receive" v-bind="receive" :config="config" :before-close="beforeClose" @close="resetForm">
      <el-form ref="receiveForm" :model="receiveFormData" :rules="receiveRules" label-width="100px">
        <el-form-item label="数量" prop="record_num">
          <el-input v-model="receiveFormData.record_num" />
        </el-form-item>
        <el-form-item label="时间" prop="record_time">
          <el-input v-model="receiveFormData.record_time" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="receiveFormData.supplier.supplier_name" />
        </el-form-item>
        <el-form-item label="负责人" prop="receive.receive_name">
          <el-input v-model="receiveFormData.receive.receive_name" />
        </el-form-item>
        <el-form-item label="零件类型" prop="goods.goods_id">
          <el-input v-model="receiveFormData.goods.goods_id" />
        </el-form-item>
        <el-form-item label="操作">
          <el-button @click="addReceive">添加</el-button>
          <el-button @click="modifyReceive">修改</el-button>
        </el-form-item>
      </el-form>

    </Dialog>
  </div>

</template>

<script>
import { getReceive, addReceive, modifyReceive, deleteReceive } from '@/api/receive'
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
      // 所有用户对象
      recordList: [{
        record_id: '',
        record_num: '',
        record_time: '',
        supplier: {},
        receive: {},
        goods: {}
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
      // 收货表单
      receiveFormData: {
        record_id: '',
        record_num: '99',
        record_time: '999',
        supplier: {},
        receive: {},
        goods: {}
      },
      // 表单规则
      receiveRules: {
        record_num: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        record_time: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
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
      getReceive().then(response => {
        this.recordList = response.data.data
        this.listLoading = false
      })
    },
    // 启动弹窗
    controller(receiveForm) {
      this.receiveDataRef(receiveForm)
      this.$refs.receive.open(
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
    addReceive() {
      this.$refs.receiveForm.validate((valid) => {
        if (valid) {
          addReceive(this.receiveFormData).then(response => {
            // 关闭弹窗
            this.$refs.receive.cancel()
            if (response.data.result === 20011) {
              this.$message.success('添加成功')
            } else this.$message.error('添加成功')

            // 获取数据
            this.fetchData()
          })
        } else {
          this.$message('字段校验失败，请重新输入')
          return false
        }
      })
    },
    modifyReceive() {
      this.$refs.receiveForm.validate((valid) => {
        if (valid) {
          modifyReceive(this.receiveFormData).then(response => {
            // 关闭弹窗
            this.$refs.receive.cancel()

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
    deleteReceive(id) {
      deleteReceive(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('修改成功')
        } else this.$message.error('修改失败')
        // 获取数据
        this.fetchData()
      })
    },
    receiveDataRef(receiveForm) {
      this.receiveFormData = receiveForm
    }
    // 结尾
  }
}
</script>
