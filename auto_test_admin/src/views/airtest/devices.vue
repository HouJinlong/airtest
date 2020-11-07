<template>
  <div class="app-container">
    <!-- 列表 -->
    <el-table
      :data="data"
      style="width: 100%"
    >
      <el-table-column
        label="ID"
        prop="id"
      />
      <el-table-column
        label="platform"
        prop="platform"
      />
      <el-table-column
        label="model"
        prop="model"
      />
      <el-table-column
        label="manufacturer"
        prop="manufacturer"
      />
      <el-table-column
        align="center"
        label="正在运行任务"
        prop="task_id"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.task_id" type="text" size="mini">{{ scope.row.task_id }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        prop="status"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ip !== ''" type="success">连接中:{{ scope.row.ip }}</el-tag>
          <el-tag v-else type="danger">已断开</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { get_devices } from '@/api/airtest'
export default {
  name: 'Devices',
  data() {
    return {
      data: []
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    async get_list() {
      this.data = await get_devices()
    }
  }
}
</script>

<style lang="scss" scoped>
.row-pagination{
  padding-top:15px
}
</style>
