<template>
  <div class="video-container">
    Video
  </div>
</template>

<script>
export default {
  name: 'Video',
  created() {
    console.log(this.$route.query.id)
  }
}
</script>

<style scoped>

</style>
