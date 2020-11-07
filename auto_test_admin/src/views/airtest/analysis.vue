<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col v-for="item in dataMap" :key="item.key" :span="8">
        <div class="title">
          {{ item.title }}
        </div>
        <div v-for="(item_data,index) in data" :key="index" class="img_box" :class="(item.key=='diffImg'&&item_data[item.key].msg)?'diff':''">
          <el-image fit="contain" class="img" :src="item_data[item.key].img" :preview-src-list="[item_data[item.key].img]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          {{ item_data[item.key].msg|| '&nbsp;' }}
        </div>
      </el-col>
    </el-row>
    <div v-loading="loading.status" class="loading" :element-loading-text="loading.text" />
  </div>
</template>

<script>

import { get_analysis } from '@/api/airtest'
export default {
  name: 'Analysis',
  data() {
    return {
      data: [
      ],
      dataMap: [
        {
          title: '当前图片',
          key: 'img'
        },
        {
          title: '分析图片',
          key: 'diffImg'
        },
        {
          title: '基准图片',
          key: 'baseImg'
        }
      ],
      loading: {
        status: true,
        text: '加载中...'
      }
    }
  },
  async created() {
    const { id } = this.$route.query
    await this.init_data(id)
    this.loading.status = false
  },
  methods: {
    async init_data(id) {
      // 加载分析数据  imagediff库
      const [imagediff, data] = await Promise.all([
        import('imagediff'),
        get_analysis({ id })
      ])
      for (let i = 0; i < data.baseImgs.length; i++) {
        const base = data.baseImgs[i]
        const current = data.imgs[i]
        const has_diff = (data.diffImgs.indexOf(base.img) !== -1)
        base.img = data.imgPrefix + data.base_id + base.img
        current.img = data.imgPrefix + data.id + current.img

        const [base_img, current_img] = await Promise.all([
          this.load_img(base.img),
          this.load_img(current.img)
        ])
        const tmp_data = {
          img: current,
          baseImg: base
        }
        if (base_img && current_img) {
          const diff = imagediff.diff(base_img, current_img)
          const canvas = imagediff.createCanvas(diff.width, diff.height)
          const context = canvas.getContext('2d')
          context.putImageData(diff, 0, 0)
          tmp_data['diffImg'] = {
            img: canvas.toDataURL('image/png', 0.6),
            msg: has_diff ? '此图有差异' : ''
          }
        } else {
          tmp_data['diffImg'] = {
            img: '',
            msg: '有图片加载失败'
          }
        }
        this.data.push(tmp_data)
        for (let j = i; j < data.imgs; j++) {
          this.data.push({
            img: {
              img: base.img,
              msg: current.msg
            },
            baseImg: {
              img: '',
              msg: '基准无此图'
            },
            diffImg: {
              img: '',
              msg: '有图片加载失败'
            }
          })
        }
      }
    },
    // 加载图片
    load_img(url) {
      return new Promise((res, rej) => {
        const img = new Image()
        img.crossOrigin = ''
        img.onload = function() {
          res(this)
        }
        img.onerror = function() {
          res(null)
        }
        img.src = url
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title{
  text-align: center;
  font-size: 20px;
  padding: 10px;
  font-weight: bold;
}
.img_box{
  border-radius: 5px;
  padding: 10px;
  background: #ccc;
  text-align: center;
  color: #333;
  font-size: 14px;
  line-height: 18px;
  &.diff{
    background: #f00;
    color: #fff;
  }
}
.img{
  height: 400px;
}
.image-slot{
   line-height: 400px;
   background: #ccc;
   font-size: 60px;
}
.loading{
  height: 80px;
}
</style>
