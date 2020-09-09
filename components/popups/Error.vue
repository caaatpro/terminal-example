<template>
  <div
    v-show="isShow"
    class="popup_bg"
  >
    <div class="popup">
      <div class="popup_title">
        Ошибка
      </div>
      <div class="popup_content replaceable_text">
        {{ text }}
      </div>
      <span
        class="button_ok popup_button"
        @click="hide"
      >Ок</span>
    </div>
  </div>
</template>

<script>
import { clearTimeout, setTimeout } from 'timers'

export default {
  data() {
    return {
      isShow: false,
      text: '',
      timeoutId: null
    }
  },
  methods: {
    show(text, timeout) {
      this.isShow = true
      this.text = text

      this.timeoutId = setTimeout(this.hide, timeout)
    },
    hide() {
      clearTimeout(this.timeoutId)
      this.isShow = false
    }
  }
}
</script>
