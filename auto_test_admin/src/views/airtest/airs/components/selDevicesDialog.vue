<template>
  <el-dialog title="请指定运行设备" :visible="true" center :show-close="false">
    <el-table
      ref="multipleTable"
      :data="data"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="ip"
        prop="ip"
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
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">
        取消
      </el-button>
      <el-button type="primary" @click="save">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { get_devices, add_tasks } from '@/api/airtest'
export default {
  name: 'SelDevicesDialog',
  props: {
    'airs': {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      data: [],
      sel_devices: []
    }
  },
  mounted() {
    this.get_list()
    console.log(this.airs)
  },
  methods: {
    handleSelectionChange(val) {
      this.sel_devices = val
    },
    hide() {
      this.$emit('update:airs', [])
    },
    async get_list() {
      // 获取在线设备
      this.data = await get_devices({
        has_ip: 'true'
      })
    },
    async save() {
      const data = {
        air_ids: this.airs,
        device_ids: this.sel_devices.map(v => {
          return v.id
        })
      }
      console.log(data)
      if (data.device_ids.length === 0) {
        this.$message({
          message: '请选择运行设备',
          type: 'error'
        })
      } else {
        await add_tasks(data)
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.hide()
      }
    }
  }
}
</script>

<style scoped>
</style>
