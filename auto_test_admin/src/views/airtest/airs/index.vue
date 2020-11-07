<template>
  <div class="app-container">
    <git :sel-id.sync="selGitId" />
    <air v-if="selGitId.length" :git-id="selGitId" />
  </div>
</template>

<script>
import git from './components/git'
import air from './components/air'
export default {
  name: 'AirsIndex',
  components: {
    git,
    air
  },
  data() {
    return {
      selGitId: ''
    }
  },
  created() {
    this.selGitId = this.$route.query.git_id
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-select{
  width: 100%;
}
.add_git{
  widows: 100%;
  margin-top: 20px;
}
</style>
