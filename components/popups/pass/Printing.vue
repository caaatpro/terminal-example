<template>
  <div
    v-show="isShow"
    class="popup_bg"
  >
    <div class="popup popup_preloader">
      <div class="preloader_print" />
      <div class="popup_title">
        Идет печать Заявления
      </div>
      <div class="popup_content">
        <p class="subtitle">
          Заберите <strong>Заявление на возврат средств</strong>
          и обратитесь с ним к <strong>Администратору</strong>
          для получения <strong>Кода возврата</strong>
        </p>
      </div>
      <span
        :class="`button_ok popup_button ${isDisabled ? 'disabled': ''}`"
        @click="hide"
      >ОК</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      isDisabled: false
    }
  },
  methods: {
    show() {
      this.isShow = true

      this.isDisabled = true

      setTimeout(() => {
        this.isDisabled = false
      }, 10000)
    },
    hide() {
      if (this.isDisabled) {
        return false
      }

      this.isShow = false
    }
  }
}
</script>
