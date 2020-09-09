<template>
  <div
    v-show="isShow"
    class="popup_bg"
  >
    <div class="popup pay_window">
      <div class="preloader_clock" />
      <div class="popup_title">
        Идет Работа с <br>терминалом оплаты
      </div>
      <div class="popup_content">
        <p class="subtitle">
          Для оплаты билетов следуйте <br> инструкциям на банковском <br> терминале.
        </p>
        <p class="text">
          Для оплаты билетов отведено <br>
          <span>2 минуты.</span>
        </p>
        <p class="text">
          Для отмены нажмите <br> красную клавишу <span class="nowrap">"Отмена"<i class="icon_close" /></span>
          <br> на банковском терминале.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import { saleCancel, salePay } from '~/api'
import { getPayErrorText } from '~/libs/error'

export default {
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    show() {
      this.isShow = true

      setTimeout(async () => {
        const req = await salePay()

        if (req.data.result === 'OK') {
          this.isShow = false
          this.$emit("print")

          return false
        }

        await saleCancel()

        let text = getPayErrorText('default')

        if (typeof req.data.error !== 'undefined') {
          text = getPayErrorText(req.data.error.code)
        }

        this.isShow = false
        this.$emit("error", text, 15000)
      }, 1500)
    },
    async hide() {
      await saleCancel()
      this.isShow = false
    }
  }
}
</script>
