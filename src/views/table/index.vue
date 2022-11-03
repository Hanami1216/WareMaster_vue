
<template>
  <div class="user-main">
    <!-- slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据 -->
    <el-table v-loading="listLoading" :data="user" border style="width: 100%">

      <el-table-column fixed prop="user_id" label="ID" width="150" />
      <el-table-column fixed prop="user_name" label="姓名" width="150" />
      <el-table-column fixed prop="user_sex" label="性别" width="150" />
      <el-table-column fixed prop="user_age" label="电话" width="150" />
      <el-table-column fixed prop="user_tel" label="薪资" width="150" />
      <el-table-column fixed prop="user_salary" label="日期" width="150" />
      <el-table-column fixed prop="user_password" label="登录密码" width="150" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="open">编辑</el-button>

          <Dialog ref="dialog" :config="config" :before-close="beforeClose" @close="resetForm">
            <span ref="span">{{ scope.row }}</span>
          </Dialog>
        </template>
      </el-table-column>
    </el-table>

    <el-button @click="open">点我打开</el-button>
    <Dialog ref="dialog" :config="config" :before-close="beforeClose" @close="resetForm">
      <span ref="span">this is a dialog</span>
    </Dialog>
  </div>

</template>

<script>
import { getUser } from '@/api/user'
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
      list: null,
      user: [{

      }],
      listLoading: true,
      config: {
        top: '20vh',
        width: '500px',
        title: '温馨提示',
        center: true,
        btnTxt: ['取消', '提交']
      }
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
      getUser().then(response => {
        this.list = response.data
        this.user = response.data.data
        this.listLoading = false
      })
    },
    open() {
      this.$refs.dialog.open(cancel => {
        // cancel();
        console.log('点击提交按钮了')
      })
        .then(() => { console.log(this.$refs.span) }) // 这里就充分利用了open方法中返回的nextTick
    },
    beforeClose() {
      console.log('关闭前')
    },
    resetForm() {
      // 这里可以写重置表单的实现
    }
  }
}
</script>
