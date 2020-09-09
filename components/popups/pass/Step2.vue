<template>
  <div
    v-show="isShow"
    class="popup_bg"
  >
    <div class="popup">
      <div class="popup_title">
        Получение<br>чека возврата прихода
      </div>
      <div class="form">
        <div class="popup_content">
          <Input
            ref="input_code"
            title="Уникальный код покупки"
            name="code"
            mask="code"
            :max="11"
            @setValue="setInputValue"
          />

          <Input
            ref="input_return_code"
            title="Код возврата"
            name="return_code"
            mask="return_code"
            :max="8"
            @setValue="setInputValue"
          />

          <p class="pass_ticket_text">
            Если у Вас нет <strong>Кода возврата</strong>, обратитесь<br>
            к <strong>Администратору</strong> для его получения,<br>
            предварительно распечатав - <span>Заявление<br>
              на возврат средств</span>
          </p>
        </div>

        <div :class="`button_ok popup_button ${isDisabled ? 'disabled' : ''}`" @click="print">
          Печатать
        </div><br>
        <div
          class="button_cancel popup_button inline"
          @click="hide"
        >
          Отмена
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '~/components/Input.vue'
import { saleCheckReturnCheque, saleCheckReturnChequeeGenapp } from '~/api'
import { getPassErrorText } from '~/libs/error'

export default {
  components: {
    Input
  },
  data() {
    return {
      isShow: false,
      code: '',
      return_code: '',
    }
  },
  computed: {
    isDisabled() {
      if (this.code.length === 11 && (this.return_code.length === 4 || this.return_code.length === 8)) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    show() {
      this.$refs.input_code.inputClean()
      this.$refs.input_return_code.inputClean()

      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    setInputValue(value, field) {
      if (field === 'code') {
        this.code = value
      }

      if (field === 'return_code') {
        this.return_code = value
      }
    },
    async print() {
      if (this.isDisabled) {
        return false
      }

      this.hide()
      this.$emit('preloader', true, 'Проверка данных')
      let req = {}

      try {
        req = await saleCheckReturnCheque(this.code, this.return_code)
      } catch(e) {
        this.$emit('error', 'Ошибка соединения', 1500)

        // eslint-disable-next-line no-console
        console.error(e)
        return false
      }

      this.$emit('preloader', false, null)

      if (req.data.result !== 'OK') {
        let errorText = ''
        if (typeof req.data.error !== 'undefined') {
          if (getPassErrorText(req.data.error.code) != null) {
            errorText = getPassErrorText(req.data.error.code)

            if (req.data.error.code === 'ST-127') {
              errorText = errorText.replace('{code}', '2')
            }
          } else {
            errorText = getPassErrorText('default')
          }
        }

        this.$emit('error', errorText, 15000)

        return false
      }

      this.$emit('passMoney', true, req.data.content.summa || 0)

      req = {}
      try {
        req = await saleCheckReturnChequeeGenapp(this.code, this.return_code)
      } catch(e) {
        this.$emit('error', 'Ошибка соединения', 1500)

        // eslint-disable-next-line no-console
        console.error(e)
        return false
      }

      if (req.data.result !== 'OK') {
        let errorText = ''
        if (getPassErrorText(req.data.error.code) != null) {
          errorText = getPassErrorText(req.data.error.code)

          if (req.data.error.code === 'ST-127') {
            errorText = errorText.replace('{code}', '2')
          }
        } else {
          errorText = getPassErrorText('default')
        }

        this.$emit('passMoney', false, 0)
        this.$emit('error', errorText, 15000)

        return false
      }
    }
  }
}
</script>
