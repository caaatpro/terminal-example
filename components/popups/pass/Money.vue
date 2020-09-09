<template>
  <div
    v-show="isShow"
    class="popup_bg"
  >
    <div class="popup">
      <div class="popup_title">
        Сумма к возврату
      </div>
      <div class="popup_content">
        <div class="pass_ticket_sum">
          {{sum}} руб.
        </div>
        <br>
        Заберите <strong>Чек возврата средств.</strong> Ваше <strong>Заявление</strong> поступило в обработку.
        Проверить его статус через интернет можно по ссылке в вашем <strong>Заявление на возврат средств.</strong>
      </div>
      <div
        :class="`button_ok popup_button ${isDisabled ? 'disabled': ''}`"
        @click="hide"
      >
        Принять
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      isShow: false,
      sum: 0,
      isDisabled: false
    }
  },
  methods: {
    show(sum) {
      this.sum = sum
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
