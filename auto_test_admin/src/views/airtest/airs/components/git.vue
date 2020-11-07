<template>
  <el-row :gutter="12" class="mb20">
    <el-col :span="8">
      <el-card shadow="never">
        <el-select :value="selId" class="w100 mb20" clearable placeholder="请选择项目" @change="fnSelChange">
          <el-option
            v-for="item in gits"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" class="w100" @click="fnEditHandle('fnAdd')">添加项目</el-button>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="never">
        <el-row :gutter="12" class="mb20">
          <el-col :span="8">
            <el-input placeholder="暂未选择项目" :value="selGit.id" disabled />
          </el-col>
          <el-col :span="12">
            <el-input placeholder="暂未选择项目" :value="selGit.title" disabled />
          </el-col>
          <el-col :span="4">
            <el-button type="primary" class="w100" :disabled="selGit.id.length===0" @click="fnEditHandle('fnUpdate')">修改</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="16">
            <el-input placeholder="暂未选择项目" :value="selGit.url" disabled />
          </el-col>
          <el-col :span="4">
            <el-input placeholder="暂未更新" :value="selGit.version" disabled />
          </el-col>
          <el-col :span="4">
            <el-button type="danger" class="w100" :disabled="selGit.id.length===0" @click="fnDel">删除</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>

    <!-- 添加或修改弹框 -->
    <el-dialog :title="form.title" :visible.sync="form.visible">
      <el-form ref="dataForm" :rules="form.rules" :model="form.data" label-position="right" label-width="80px">
        <el-form-item label="项目名称" prop="id">
          <el-input v-model="form.data.id" :disabled="form.data._id.length!=0" />
        </el-form-item>
        <el-form-item label="项目地址" prop="url">
          <el-input v-model="form.data.url" />
        </el-form-item>
        <el-form-item label="项目备注" prop="title">
          <el-input v-model="form.data.title" />
        </el-form-item>
        <el-form-item v-if="form.data.version" label="更新代码">
          <el-switch v-model="form.data.update" />
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

    <!-- 删除二次确认框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="30%"
    >
      <span>{{ dialog.text }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="dialog.fn()">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>

import { get_gits, del_gits, add_gits, update_gits } from '@/api/airtest'

function form_data({ _id = '', id = '', url = '', title = '', version = '' } = {}) {
  return {
    _id,
    id,
    url,
    title,
    update: version.length === 0,
    version
  }
}

export default {
  name: 'Git',
  props: {
    'selId': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      gits: [],
      form: {
        status: '',
        title: '添加/修改',
        visible: false,
        fn: () => {},
        data: form_data(),
        rules: {
          id: [{ required: true, message: 'id 是必填的', trigger: 'blur' }],
          url: [{ required: true, message: 'url 是必填的', trigger: 'blur' }],
          title: [{ required: true, message: 'title 是必填的', trigger: 'blur' }]
        }
      },
      dialog: {
        title: '提示',
        text: '这是一段信息',
        visible: false,
        fn: () => {}
      }
    }
  },
  computed: {
    selGit() {
      return (this.gits.filter(v => {
        return v.id === this.selId
      })[0] || form_data())
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    async get_list() {
      this.gits = await get_gits()
    },
    fnSelChange(value) {
      this.$router.push({ query: { git_id: value }})
      this.$emit('update:selId', value)
    },
    fnEditHandle(type) {
      const mapData = {
        'fnAdd': {
          title: '添加',
          data: {}
        },
        'fnUpdate': {
          title: '修改',
          data: Object.assign({}, this.selGit)
        }
      }[type]
      this.form.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        Object.assign(this.form, {
          visible: true,
          title: mapData.title,
          data: form_data(mapData.data),
          fn: () => {
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                this[type]()
              }
            })
          }
        })
      })
    },
    async fnAdd() {
      const ret = await add_gits(this.form.data)
      this.form.visible = false
      this.gits.unshift(ret)
      this.fnSelChange(ret.id)
    },
    async fnUpdate() {
      const ret = await update_gits(this.form.data)
      this.form.visible = false
      this.gits = this.gits.map(v => {
        return ((v.id === this.selGit.id) ? ret : v)
      })
    },
    fnDel() {
      const { id, title } = this.selGit
      Object.assign(this.dialog, {
        visible: true,
        text: '确认删除 【' + title + '】',
        fn: async() => {
          await del_gits({ id })
          this.fnSelChange('')
          this.gits = this.gits.filter(v => {
            return v.id !== id
          })
          this.dialog.visible = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mb20{
  margin-bottom: 20px;
}
.w100{
  width: 100%;
}
</style>
