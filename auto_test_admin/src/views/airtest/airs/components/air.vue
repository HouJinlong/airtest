<template>
  <el-card shadow="never">
    <!-- 列表 -->
    <el-table
      :data="data"
      style="width: 100%"
    >
      <el-table-column
        label="脚本路径"
        prop="path"
      />
      <el-table-column
        label="脚本名称"
        prop="title"
      />
      <el-table-column
        label="基准"
        prop="base"
        width="80px"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.base" type="text">{{ scope.row.base }}</el-button>
          <el-button v-else type="text" disabled>暂无</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="定时"
        prop="type"
        width="80px"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '1'">定时</el-tag>
          <el-tag v-else-if="scope.row.type === '0'" type="info">普通</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="通知邮箱"
        prop="email"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.email">
            <el-button v-for="item in scope.row.email.split(',')" :key="item" size="mini" type="text" style="margin-left:0">{{ item }}</el-button>
          </div>
          <el-button v-else type="text" disabled>暂无</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
      >
        <template slot="header">
          <el-button
            size="medium"
            type="primary"
            @click="handle('fnAdd')"
          >添加</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="add_task(scope.row)"
          >运行</el-button>
          <el-button
            size="mini"
            @click="handle('fnUpdate',{index:scope.$index,data:scope.row})"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="fnDel({index:scope.$index,data:scope.row})"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改弹框 -->
    <el-dialog :title="form.title" :visible.sync="form.visible" width="600px">
      <el-form ref="dataForm" :rules="form.rules" :model="form.data" label-position="right" label-width="110px">
        <el-form-item label="脚本路径" prop="path">
          <el-input v-model.trim="form.data.path" />
        </el-form-item>
        <el-form-item label="脚本备注" prop="title">
          <el-input v-model="form.data.title" />
        </el-form-item>
        <el-form-item label="脚本类型" prop="type">
          <el-select v-model="form.data.type">
            <el-option
              v-for="item in form.type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="通知邮箱" prop="email">
          <el-input v-model="form.data.email" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.visible = false">
          取消
        </el-button>
        <el-button type="primary" @click="form.fn()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- 删除确认弹框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="300px"
    >
      <span>{{ dialog.text }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="dialog.fn()">确 定</el-button>
      </span>
    </el-dialog>
    <devices-dialog v-if="run_airs.length" :airs.sync="run_airs" />
  </el-card>
</template>

<script>

import DevicesDialog from './selDevicesDialog'
import { get_airs, del_airs, add_airs, update_airs } from '@/api/airtest'

function form_data({ _id = '', path = '', title = '', email = '', type = '0' } = {}) {
  return {
    _id,
    path,
    title,
    email,
    type
  }
}

export default {
  name: 'Air',
  components: {
    DevicesDialog
  },
  props: {
    'gitId': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: [],
      dialog: {
        title: '提示',
        text: '这是一段信息',
        visible: false,
        fn: () => {}
      },
      form: {
        status: '',
        title: '添加/修改',
        visible: false,
        fn: () => {},
        data: form_data(),
        type_options: [{
          value: '0',
          label: '普通任务'
        }, {
          value: '1',
          label: '定时任务'
        }],
        rules: {
          path: [{ required: true, message: '脚本路径 是必填的', trigger: 'blur' }],
          title: [{ required: true, message: '脚本备注 是必填的', trigger: 'blur' }]
        }
      },
      run_airs: []
    }
  },
  watch: {
    gitId() {
      this.get_list()
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    async add_task(data) {
      this.run_airs = [data._id]
    },
    async get_list() {
      this.data = await get_airs({ git_id: this.gitId })
    },
    handle(type, { index, data = {}} = {}) {
      this.form.visible = true
      const mapData = {
        'fnAdd': {
          title: '添加',
          data: {}
        },
        'fnUpdate': {
          title: '修改',
          data: data
        }
      }[type]
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        Object.assign(this.form, {
          visible: true,
          title: mapData.title,
          data: form_data(mapData.data),
          fn: () => {
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                this[type](index)
              }
            })
          }
        })
      })
    },
    async fnAdd() {
      const ret = await add_airs(Object.assign({}, this.form.data, {
        git_id: this.gitId
      }))
      this.form.visible = false
      this.data.unshift(ret)
    },
    async fnUpdate(index) {
      const ret = await update_airs(this.form.data)
      this.form.visible = false
      this.$set(this.data, index, ret)
    },
    fnDel({ index, data }) {
      Object.assign(this.dialog, {
        visible: true,
        text: '确认删除 【' + data['title'] + '】',
        fn: async() => {
          await del_airs(data)
          this.data.splice(index, 1)
          this.dialog.visible = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
