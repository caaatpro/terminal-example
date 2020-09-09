<template>
  <div
    v-show="isShow"
    class="popup_bg"
  >
    <div class="popup pass_ticket_steps">
      <div
        class="popup_button pass_ticket_step_button step1"
        @click="selectStep(1)"
      >
        <div class="pass_ticket_step_title">
          Шаг 1
        </div>
        Печать <br>
        Заявления на <br>
        возврат средств
      </div>
      <div
        class="popup_button pass_ticket_step_button step2"
        @click="selectStep(2)"
      >
        <div class="pass_ticket_step_title">
          Шаг 2
        </div>
        Получение <br>
        Чека возврата <br>
        прихода
      </div>

      <div class="popup_content">
        <p>Если вы хотите сдать все или часть билетов, купленных на этом терминале,
          начните процесс с распечатки Заявления на возврат средств</p>
      </div>
      <span
        class="button_cancel pass_ticket_step_button_back"
        @click="hide"
      >Вернуться</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    selectStep(step) {
      this.hide()
      this.$emit('selectStep', step)
    }
  }
}
</script>
