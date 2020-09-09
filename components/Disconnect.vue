<template>
  <div
    v-show="disconnect"
    class="intro_disconnect"
  >
    <video v-if="videoIntro" playsinline autoplay muted loop>
      <source :src="`/${cinema}/video/intro_animation.f4v`" type="video/mp4">
    </video>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      cinema: process.env.cinema,
      videoIntro: false,
      disconnect: false
    }
  },
  watch: {
    '$store.state.disconnect': "toggle"
  },
  mounted() {
    this.videoIntro = this.$store.state.config.videoIntro
  },
  methods: {
    toggle(value) {
      this.disconnect = value
    }
  },
}
</script>
