<template>
  <div
    v-show="intro"
    class="intro_ready"
    @click="hide"
  >
    <video v-if="videoIntro" playsinline autoplay muted loop>
      <source :src="`/${cinema}/video/intro_animation.f4v`" type="video/mp4">
    </video>
  </div>
</template>

<script>
import { clearTimeout, setTimeout } from 'timers'
export default {
  props: {
    timeout: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    cinema: process.env.cinema,
    videoIntro: false,
    intro: false,
    timer: 0
  }),
  mounted() {
    this.videoIntro = this.$store.state.config.videoIntro

    this.resetTimer()

    document.body.addEventListener('click', this.resetTimer, false)
    document.body.addEventListener('touchstart', this.resetTimer, false)
    document.body.addEventListener('mousedown', this.resetTimer, false)
    document.body.addEventListener('mouseup', this.resetTimer, false)
    document.body.addEventListener('touchend', this.resetTimer, false)
  },
  methods: {
    resetTimer() {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.show, this.timeout)
    },
    show() {
      // eslint-disable-next-line no-console
      console.log('show intro')
      this.intro = true

      clearTimeout(this.timer)

      this.$emit("showIntro")
    },
    hide() {
      this.intro = false
      this.resetTimer()
    },
  },
}
</script>
