<template>
  <div class="supplierDispatchNote-main">
    <el-button @click="openSupplierDispatchNoteAddWindows()">添加</el-button>
    <div>
      <el-table v-loading="loading" :data="currentPageData" border size="mini">
        <!-- <el-table-column align="center" label="序号" type="index" width="70px" show-overflow-tooltip /> -->
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"s
          :label="column.label"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button size="small" type="text" @click="openEditWindows(scope.row.supplierDispatchNote)">编辑</el-button>
            <!-- 删除 -->
            <el-button size="small" type="text" @click="deleteSupplierDispatchNote(scope.row.supplierDispatchNote.note_id)">删除</el-button>
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
    <Dialog ref="supplierDispatchNoteAddWindows" :before-close="beforeClose" :config="config" v-bind="supplierDispatchNoteList" @close="resetForm">
      <el-form ref="supplierDispatchNoteFrom" :model="supplierDispatchNoteFormData" :rules="supplierDispatchNoteRules" label-width="100px">
        <el-form-item label="供应商">
          <el-select v-model="supplierDispatchNoteFormData.supplier_id" placeholder="请选择">
            <el-option
              v-for="item in supplierList"
              :key="item.supplier_name"
              :label="item.supplier_name"
              :value="item.supplier_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料型号选择">
          <el-select v-model="supplierDispatchNoteFormData.material_id" placeholder="请选择">
            <el-option
              v-for="item in materialList"
              :key="item.material.material_name"
              :label="item.material.material_name"
              :value="item.material.material_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库选择">
          <el-select v-model="supplierDispatchNoteFormData.warehouse_id" placeholder="请选择">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseInfo.warehouse_name"
              :label="item.warehouseInfo.warehouse_name"
              :value="item.warehouseInfo.warehouse_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送货单经手人">
          <el-select v-model="supplierDispatchNoteFormData.user_id" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.user_name"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送货数量" prop="quantity">
          <el-input-number v-model="supplierDispatchNoteFormData.quantity" />
        </el-form-item>
        <el-form-item label="送货时间" prop="material_name">
          <el-date-picker
            v-model="supplierDispatchNoteFormData.dispatch_date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="操作">
          <el-button @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog ref="supplierDispatchNoteEditWidows" :before-close="beforeClose" :config="config" v-bind="supplierDispatchNoteList" @close="resetForm">
      <el-form ref="supplierDispatchNoteFrom" :model="supplierDispatchNoteFormData" :rules="supplierDispatchNoteRules" label-width="100px">
        <el-form-item label="供应商">
          <el-select v-model="supplierDispatchNoteFormData.supplier_id" placeholder="请选择">
            <el-option
              v-for="item in supplierList"
              :key="item.supplier_name"
              :label="item.supplier_name"
              :value="item.supplier_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料型号选择">
          <el-select v-model="supplierDispatchNoteFormData.material_id" placeholder="请选择">
            <el-option
              v-for="item in materialList"
              :key="item.material.material_name"
              :label="item.material.material_name"
              :value="item.material.material_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库选择">
          <el-select v-model="supplierDispatchNoteFormData.warehouse_id" placeholder="请选择">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseInfo.warehouse_name"
              :label="item.warehouseInfo.warehouse_name"
              :value="item.warehouseInfo.warehouse_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送货单经手人">
          <el-select v-model="supplierDispatchNoteFormData.user_id" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.user_name"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="送货数量" prop="quantity">
          <el-input-number v-model="supplierDispatchNoteFormData.quantity" />
        </el-form-item>
        <el-form-item label="送货时间" prop="material_name">
          <el-date-picker
            v-model="supplierDispatchNoteFormData.dispatch_date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="操作">
          <el-button size="big" style="margin: auto;" @click="modify()">修改</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>

</template>

<script>

import { addSupplierDispatchNote, deleteSupplierDispatchNote, getAllSupplierDispatchNote, modifySupplierDispatchNote } from '@/api/supplierDispatchNote'
import { getAllMaterial } from '@/api/material'
import { getSupplier } from '@/api/supplier'
import Dialog from '@/components/dialog.vue'
import { getWareHouse } from '@/api/warehouse'
import { getUser } from '@/api/user'

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
      supplierDispatchNoteList: [],
      // 信息加载开关
      listLoading: true,
      config: {
        top: '10vh',
        width: '500px',
        title: '出货单',
        center: true,
        btnTxt: ['取消', '提交']
      },
      supplierDispatchNoteFormData: {
        note_id: 18,
        supplier_id: 1,
        material_id: 1,
        warehouse_id: 1,
        quantity: 49,
        out_time: '2002-11-13 17:26:37',
        user_id: 1,
        remark: null
        // is_delete: null
      },
      materialList: [],
      supplierList: [],
      warehouseList: [],
      userList: [],
      // 用户表单
      // 表单规则
      supplierDispatchNoteRules: { },
      loading: false,
      total: 100, // 总条目数，需要根据实际情况设置
      pagesize: 10, // 每页显示的条目数1
      currentPage: 1, // 当前页码
      // columns: [
      //   { prop: 'SupplierDispatchNote.note_id', label: '订单ID' },
      //   { prop: 'SupplierDispatchNote.supplier.supplier_name', label: '供应商名称' },
      //   { prop: 'SupplierDispatchNote.material.material_name', label: '物料名称' },
      //   { prop: 'SupplierDispatchNote.quantity', label: '数量' },
      //   { prop: 'SupplierDispatchNote.dispatch_date', label: '交货日期' },
      //   { prop: 'SupplierDispatchNote.order_date', label: '创建订单时间' }
      //   // 其他列配置
      // ]
      columns: [
        { prop: 'supplierDispatchNote.note_id', label: '订单ID' },
        { prop: 'supplierDispatchNote.supplier.supplier_name', label: '供应商名称' },
        { prop: 'supplierDispatchNote.supplier.supplier_company', label: '供应商公司' },
        { prop: 'supplierDispatchNote.supplier.contact_info', label: '联系信息' },
        { prop: 'supplierDispatchNote.supplier.company_address', label: '公司地址' },
        { prop: 'supplierDispatchNote.material.material_name', label: '物料名称' },
        { prop: 'supplierDispatchNote.material.description', label: '物料描述' },
        { prop: 'supplierDispatchNote.material.price', label: '价格' },
        { prop: 'supplierDispatchNote.quantity', label: '数量' },
        { prop: 'supplierDispatchNote.out_time', label: '出货时间' },
        { prop: 'supplierDispatchNote.user.user_name', label: '送货单经手人' },
        { prop: 'supplierDispatchNote.warehouseInfo.warehouse_name', label: '仓库名称' }
      ]

      // 尾
    }
  },
  computed: {
    currentPageData() {
      // 根据当前页码和每页显示的条目数截取数据
      const startIndex = (this.currentPage - 1) * this.pagesize
      const endIndex = this.currentPage * this.pagesize
      return this.supplierDispatchNoteList.slice(startIndex, endIndex)
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
      getAllSupplierDispatchNote().then(response => {
        this.supplierDispatchNoteList = response.data
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
        this.supplierDispatchNoteFormData = data
      }
      getAllMaterial().then(response => {
        this.materialList = response.data
      })
      getSupplier().then(response => {
        this.supplierList = response.data
      })
      getWareHouse().then(response => {
        this.warehouseList = response.data
      })
      getUser().then(response => {
        this.userList = response.data
      })
      this.$refs.supplierDispatchNoteEditWidows.open()
    },
    openSupplierDispatchNoteAddWindows() {
      this.supplierDispatchNoteFormData = {}
      getAllMaterial().then(response => {
        this.materialList = response.data
      })
      getSupplier().then(response => {
        this.supplierList = response.data
      })
      getWareHouse().then(response => {
        this.warehouseList = response.data
      })
      getUser().then(response => {
        this.userList = response.data
      })
      this.$refs.supplierDispatchNoteAddWindows.open()
    },
    beforeClose() {
      console.log('关闭前')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    add() {
      this.$refs.supplierDispatchNoteFrom.validate((valid) => {
        if (valid) {
          addSupplierDispatchNote(this.supplierDispatchNoteFormData).then(response => {
            // 关闭弹窗
            this.$refs.supplierDispatchNoteAddWindows.cancel()
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
      this.$refs.supplierDispatchNoteFrom.validate((valid) => {
        if (valid) {
          modifySupplierDispatchNote(this.supplierDispatchNoteFormData).then(response => {
            // 关闭弹窗
            this.$refs.supplierDispatchNoteEditWidows.cancel()

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
    deleteSupplierDispatchNote(id) {
      deleteSupplierDispatchNote(id).then(response => {
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
