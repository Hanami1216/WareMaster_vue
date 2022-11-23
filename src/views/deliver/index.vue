
<template>
  <div class="receive-main">
    <el-button @click="controller(receiveFormData)">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="recordList" border style="width: 100%">

      <el-table-column fixed type="index" label="ID" width="150" />
      <el-table-column fixed prop="record_number" label="入货数量" width="150" />
      <el-table-column fixed prop="record_time" label="入货日期" width="150" />
      <el-table-column fixed prop="consignee.consignee_name" label="供应商" width="150" />
      <el-table-column fixed prop="user.user_name" label="负责人" width="150" />
      <el-table-column fixed prop="goods.goods_id" label="零件ID" width="150" />
      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button type="text" size="small" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button type="text" size="small" @click="deleteReceive(scope.row.record_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作弹窗 -->
    <Dialog ref="receive" v-bind="recordList" :config="config" :before-close="beforeClose" @close="resetForm">
      <el-form ref="receiveForm" :model="receiveFormData" :rules="receiveRules" label-width="100px">
        <el-form-item label="数量">
          <el-input v-model="receiveFormData.record_number" />
        </el-form-item>
        <el-form-item label="入货时间">
          <el-date-picker
            v-model="receiveFormData.record_time"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="客户">
          <!-- v-model双向绑定数据 -->
          <el-select
            v-model="receiveFormData.consignee.consignee_id"
            size="big"
            placeholder="请选择客户"
            style="width: 140px"
            clearable
          >
            <el-option
              v-for="consignee in recordList.consignee"
              :key="consignee.consignee_id"
              :label="consignee.consignee_name"
              :value="consignee.consignee_id"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            v-model="receiveFormData.user.user_id"
            size="big"
            placeholder="请选择负责人"
            style="width: 140px"
            clearable
          >
            <el-option
              v-for="user in recordList.user"
              :key="user.user_id"
              :label="user.user_name"
              :value="user.user_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="零件类型">
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
import { getOut, addOut, modifyOut, deleteOut } from '@/api/deliver'
import { getUser } from '@/api/user'
import { getConsignee } from '@/api/consignee'
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
        record_number: '',
        record_time: '',
        consignee: {
        },
        user: {
        },
        goods: {}
      }],
      // 下拉框选择
      selectedSupplierId: '',
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '温馨提示',
        center: true,
        btnTxt: ['取消', '提交']
      },
      // 出货表单
      receiveFormData: {
        record_id: 1,
        record_number: '99',
        record_time: '2022-11-01 10:56:04',
        consignee: {
          consignee_id: 1,
          consignee_name: '贪玩计算姬'
        },
        user: {
          user_id: 2,
          user_name: '贪玩计算姬'
        },
        goods: {
          goods_id: 1
        }
      },
      // 表单规则
      receiveRules: {
        record_num: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        record_time: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
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
      getOut().then(response => {
        this.recordList = response.data.data
      })
      getUser().then(response => {
        this.recordList.user = response.data.data
      })
      getConsignee().then(response => {
        this.recordList.consignee = response.data.data
      })
      this.listLoading = false
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
          addOut(this.receiveFormData).then(response => {
            // 关闭弹窗
            this.$refs.receive.cancel()
            if (response.data.result === 20011) {
              this.$message.success('添加成功')
            } else this.$message.error('添加失败')

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
          modifyOut(this.receiveFormData).then(response => {
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
      deleteOut(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('删除成功')
        } else this.$message.error('删除失败')
        // 获取数据
        this.fetchData()
      })
    },
    receiveDataRef(receiveForm) {
      this.receiveFormData = receiveForm
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
    // 结尾
  }
}
</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
