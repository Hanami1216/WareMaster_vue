<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getUser().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<!--
<template>
  <el-table v-loading="listLoading" :data="list" border style="width: 100%">
    <el-table-column fixed prop="date" label="ID" width="150">
      // slot-scope="scope " 来 取得 作用域插槽 :data绑定的数据

    </el-table-column>
    <el-table-column fixed prop="user_id" label="姓名" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.$user_id }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed prop="date" label="性别" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.$user_id }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed prop="date" label="电话" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.$user_id }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed prop="date" label="薪资" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.$user_id }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed prop="date" label="日期" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.$user_id }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed prop="date" label="登录密码" width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.$user_id }}</span>
      </template>
    </el-table-column>
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
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script> -->
