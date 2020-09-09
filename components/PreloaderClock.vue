<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-show="isShow"
    class="preloader"
  >
    <div class="preloader_clock" >
      <div
        v-if="text"
        class="preloader_text"
        v-html="text"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      text: ''
    }
  },
  methods: {
    show(text) {
      this.isShow = true
      this.text = text
    },
    hide() {
      this.isShow = false
      this.text = null
    }
  }
}
</script>
