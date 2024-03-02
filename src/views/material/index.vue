<template>
  <div class="material-main">
    <el-button @click="controller()">添加</el-button>
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="materialList" border style="width: 100%">
      <el-table-column fixed label="供应商名称" prop="supplier.supplier_name" />
      <el-table-column fixed label="联系信息" prop="supplier.contact_info" />
      <el-table-column fixed label="公司名称" prop="supplier.supplier_company" />
      <el-table-column fixed label="物料名称" prop="material.material_name" />
      <el-table-column fixed label="物料描述" prop="material.description" />
      <el-table-column fixed label="物料价格" prop="material.price" />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button size="small" type="text" @click="controller(scope.row.material)">编辑</el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="deleteMaterial(scope.row.material.material_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Dialog ref="material" :before-close="beforeClose" :config="config" v-bind="materialList" @close="resetForm">
      <el-form ref="materialFrom" :model="materialFormData" :rules="materialRules" label-width="100px">
        <el-form-item label="物料类型" prop="type_id">
          <el-input v-model="materialFormData.type_id" />
        </el-form-item>
        <el-form-item label="物料库存" prop="in_stock">
          <el-input v-model="materialFormData.in_stock" />
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

import { addMaterial, deleteMaterial, getAllMaterial, modifyMaterial } from '@/api/material'
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
      // 所有物料
      materialList: [{
        supplier: {
          supplier_id: 1,
          supplier_name: '赵彩云',
          contact_info: '123123123',
          supplier_company: '广西科达',
          supplier_social_code: 'dsfafdsafasdf',
          bank_code: 'ddsfdsfadsf',
          company_address: '广西',
          is_deleted: 0
        },
        material: {
          material_id: 11,
          material_name: '从点非',
          description:
              '具总适片重按了展划最百压百气。想列报油白油系观规整称院元至化。干目着能团对领眼文只内儿时。你更国战较点不联导济对道日。革特只打际真器只须成感十须分好合。',
          price: 1,
          supplier_id: 1,
          _deleted: false,
          _available: true
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
      materialFormData: {
        supplier: {
          supplier_id: 1,
          supplier_name: '赵彩云',
          contact_info: '123123123',
          supplier_company: '广西科达',
          supplier_social_code: 'dsfafdsafasdf',
          bank_code: 'ddsfdsfadsf',
          company_address: '广西',
          is_deleted: 0
        },
        material: {
          material_id: 11,
          material_name: '从点非',
          description:
              '具总适片重按了展划最百压百气。想列报油白油系观规整称院元至化。干目着能团对领眼文只内儿时。你更国战较点不联导济对道日。革特只打际真器只须成感十须分好合。',
          price: null,
          supplier_id: 1,
          is_deleted: false,
          is_available: true
        }
      },
      // 用户表单
      // 表单规则
      materialRules: {
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
      getAllMaterial().then(response => {
        this.materialList = response.data
        this.listLoading = false
      })
    },
    // 启动弹窗
    controller(materialFormData) {
      this.MaterialDataRef(materialFormData)
      this.$refs.material.open(
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
      this.$refs.materialFrom.validate((valid) => {
        if (valid) {
          addMaterial(this.materialFormData).then(response => {
            // 关闭弹窗
            this.$refs.material.cancel()
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
      this.$refs.materialFrom.validate((valid) => {
        if (valid) {
          modifyMaterial(this.materialFormData).then(response => {
            // 关闭弹窗
            this.$refs.material.cancel()

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
    deleteMaterial(id) {
      deleteMaterial(id).then(response => {
        if (response.data.result === 20021) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.data.msg)
        }
        // 获取数据
        this.fetchData()
      })
    },
    MaterialDataRef(materialForm) {
      if (materialForm != null) {
        this.materialFormData = materialForm
      }
    }
    // 结尾
  }
}
</script>
