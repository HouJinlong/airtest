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
        width="70px"
      />
      <el-table-column
        label="脚本项目"
        prop="git_id"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.git_id" type="text" size="mini">{{ scope.row.git_id }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="脚本路径"
        prop="path"
      />
      <el-table-column
        label="版本"
        width="80px"
      >
        <template slot-scope="scope">
          {{ scope.row.version }}
        </template>
      </el-table-column>
      <el-table-column
        label="运行设备"
        prop="device_id"
        width="80px"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.device_id" type="text" size="mini">{{ scope.row.device_id }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="运行报告"
        prop="log_url"
        width="80px"
      >
        <template slot-scope="scope">
          <a
            :href="base_log_url+scope.row.log_url"
            target="_blank"
          >
            <el-button type="text" :disabled="!scope.row.log_url">{{ scope.row.log_url?'运行报告':'无' }}</el-button>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="基准"
        prop="base"
        width="80px"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.base" type="text" size="mini">{{ scope.row.base }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="分析结果"
        prop="analysis"
        width="analysis"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.status==2&&scope.row.base">
            <el-button v-if="scope.row.diff_imgs" type="text" size="mini" @click="go_analysis(scope.row)">
              {{ scope.row.diff_imgs.length?'共有'+scope.row.diff_imgs.length+'个不同':'运行截图相同' }}
            </el-button>
            <el-button v-else type="text" size="mini">正在分析中</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="info">等待中</el-tag>
          <el-tag v-if="scope.row.status === 1">进行中</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">成功</el-tag>
          <el-tag v-if="scope.row.status === 3" type="danger">{{ scope.row.msg || "失败" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        prop="time"
        width="160px"
      />
      <el-table-column
        align="right"
        width="220px"
      >
        <template slot-scope="scope">
          <el-button
            :type="scope.row.is_base?'danger':'primary'"
            size="mini"
            @click="set_base(scope.row)"
          >{{ scope.row.is_base?'取消基准':'设为基准' }}</el-button>
          <el-button
            v-if="!scope.row.is_base"
            type="danger"
            size="mini"
            @click="del({index:scope.$index,data:scope.row})"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="row-pagination" justify="center">
      <el-pagination
        :current-page="page_number"
        :page-sizes="[1, 2, 5]"
        :page-size="page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
import { get_tasks_list, del_tasks, update_tasks } from '@/api/airtest'
export default {
  name: 'Tasks',
  data() {
    return {
      base_log_url: process.env.VUE_APP_BASE_API,
      data: [],
      page_total: 0,
      page_number: 1,
      page_size: 5
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    go_analysis(row) {
      this.$router.push({ name: 'analysis', query: { id: row.id }})
    },
    handleSizeChange(val) {
      this.page_size = val
      this.page_number = 1
      this.get_list()
    },
    handleCurrentChange(val) {
      this.page_number = val
      this.get_list()
    },
    async get_list() {
      const ret = await get_tasks_list({
        page_number: this.page_number,
        page_size: this.page_size
      })
      this.data = ret.list
      this.page_total = ret.count
      console.log(this.data)
    },
    async del({ index, data }) {
      await del_tasks({
        id: data.id
      })
      this.data.splice(index, 1)
    },
    async set_base({ id, is_base }) {
      await update_tasks({
        id,
        is_base: !is_base
      })
      this.get_list()
    }
  }
}
</script>

<style lang="scss" scoped>
.row-pagination{
  padding-top:15px
}
</style>
