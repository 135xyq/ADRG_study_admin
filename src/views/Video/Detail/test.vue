<template>
  <div class="video-detail-container">
    <video-player
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      class="video-player-box"
      custom-event-name="customstatechangedeventname"

      @canplay="onPlayerCanplay($event)"
      @canplaythrough="onPlayerCanplaythrough($event)"
      @ended="onPlayerEnded($event)"
      @loadeddata="onPlayerLoadeddata($event)"
      @pause="onPlayerPause($event)"
      @play="onPlayerPlay($event)"
      @playing="onPlayerPlaying($event)"
      @ready="playerReadied"
      @statechanged="playerStateChanged($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @waiting="onPlayerWaiting($event)"
    />
  </div>
</template>

<script>
// 视频详情页

import videoPlayer from 'vue-video-player'
import 'vue-video-player/node_modules/video.js/dist/video-js.css'
import { videoDetail } from '@/api/video'

export default {
  name: 'Detail',
  components: {
    videoPlayer
  },
  data() {
    return {
      avideoId: '', // 视频id
      playerOptions: {
        // videojs options
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
        }],
        poster: '/static/images/author.jpg'
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  async created() {
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.videoId = this.$route.params.id
    }
    // 视频id为空则调回文章列表
    if (this.videoId === '') {
      this.$router.push({ name: 'VideoList' })
    } else {
      await this.getVideoDetai()
    }
  },
  methods: {
    async getVideoDetai() {
      const res = await videoDetail(this.avideoId)
      this.playerOptions.sources[0].src = res.data.url
      this.playerOptions.poster = res.data.thumbnail_url
    },
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    }
  }
}
</script>

<style scoped>

</style>
