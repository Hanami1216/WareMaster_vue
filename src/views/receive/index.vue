<template>
  <div class="receive-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="recordList" border style="width: 100%">

      <el-table-column fixed label="ID" type="index" width="150" />
      <el-table-column fixed label="入货数量" prop="out_order_number" width="150" />
      <el-table-column fixed label="入货日期" prop="out_time" width="150" />
      <el-table-column fixed label="供应商" prop="manufacturer.manufacturer_name" width="150" />
      <el-table-column fixed label="业务操作员" prop="salesman.nick_name" width="150" />
      <el-table-column fixed label="零件名称" prop="goodsType.name" width="150" />
      <el-table-column fixed label="零件类型" prop="goodsType.type" width="150" />
      <el-table-column fixed label="零件类型" prop="goodsType.price" width="150" />
      <!-- 操作 -->
      <el-table-column fixed="left" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteReceive(scope.row.record_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作弹窗 -->
    <Dialog ref="receive" :before-close="beforeClose" :config="config" @close="resetForm">
      <el-form ref="receiveForm" :model="receiveFormData" :rules="receiveRules" label-width="100px">
        <el-form-item label="数量">
          <el-input v-model="receiveFormData.record_num" />
        </el-form-item>
        <el-form-item label="入货时间">
          <el-date-picker
            v-model="receiveFormData.out_time"
            default-time="12:00:00"
            placeholder="选择日期时间"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <!--        <el-form-item label="供应商">-->
        <!--          &lt;!&ndash; v-model双向绑定数据 &ndash;&gt;-->
        <!--          <el-select-->

        <!--            v-model="receiveFormData.supplier.supplier_id"-->
        <!--            clearable-->
        <!--            placeholder="请选择供应商"-->
        <!--            size="big"-->
        <!--            style="width: 140px"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              v-for="supplier in recordList.supplier"-->
        <!--              :key="supplier.supplier_id"-->
        <!--              :label="supplier.supplier_name"-->
        <!--              :value="supplier.supplier_id"-->
        <!--            />-->
        <!--          </el-select>-->

        <!--        </el-form-item>-->
        <!--        <el-form-item label="负责人">-->
        <!--          <el-select-->

        <!--            v-model="receiveFormData.user.user_id"-->
        <!--            clearable-->
        <!--            placeholder="请选择负责人"-->
        <!--            size="big"-->
        <!--            style="width: 140px"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              v-for="user in recordList.user"-->
        <!--              :key="user.user_id"-->
        <!--              :label="user.user_name"-->
        <!--              :value="user.user_id"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="零件类型">-->
        <!--          <el-input v-model="receiveFormData.goods.goods_id" />-->
        <!--        </el-form-item>-->
        <el-form-item label="操作">
          <el-button @click="addReceive">添加</el-button>
          <el-button @click="modifyReceive">修改</el-button>
        </el-form-item>
      </el-form>

    </Dialog>
  </div>

</template>

<script>
import { addReceive, deleteReceive, getReceive, modifyReceive } from '@/api/receive'
import { getUser } from '@/api/user'
// import { getSupplier } from '@/api/supplier'
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
      recordList: [{
        id: 1,
        out_order_number: 'order-1',
        quantity: 10,
        out_time: '2023-05-31T09:50:05',
        manufacturer_id: 2,
        salesman_id: 1,
        goodsType_id: 1,
        remark: 'order-1 remark',
        salesman: {
          name: null,
          nick_name: '贪玩の計算姬',
          sex: '0',
          age: null,
          phone: '18038992335',
          user_type: '0'
        },
        manufacturer: null,
        goodsType: {
          id: 1,
          type: '显卡',
          price: 3999,
          name: '微星显卡 3060ti'
        }
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
      // 收货表单
      receiveFormData: {
        id: 1,
        out_order_number: 'order-1',
        manufacturer_id: 2,
        out_time: '',
        item_id: 1,
        quantity: 10,
        remark: '备注',
        salesman_id: 1
      },
      // 表单规则
      receiveRules: {
        record_num: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        out_time: [
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
      getReceive().then(response => {
        this.recordList = response.data
      })
      getUser().then(response => {
        this.recordList.user = response.data
      })
      // getSupplier().then(response => {
      //   this.recordList.supplier = response.data
      // })
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
        .then(() => {

        }
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
            } else {
              this.$message.error('添加失败')
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
    modifyReceive() {
      this.$refs.receiveForm.validate((valid) => {
        if (valid) {
          modifyReceive(this.receiveFormData).then(response => {
            // 关闭弹窗
            this.$refs.receive.cancel()

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
    deleteReceive(id) {
      deleteReceive(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
        // 获取数据
        this.fetchData()
      })
    },
    receiveDataRef(receiveForm) {
      if (receiveForm != null) {
        this.receiveFormData = receiveForm
      }
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
