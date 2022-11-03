
<template>
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
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getUser } from '@/api/user'

export default {
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
      listLoading: true
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
    }
  }
}
</script>
