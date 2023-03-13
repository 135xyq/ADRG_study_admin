<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <button @click="getAppletConfig">获取配置</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfig } from '@/api/config'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // 获取小程序配置信息
    async getAppletConfig() {
      let res = await getConfig()
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
