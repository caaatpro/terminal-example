<template>
  <div
    v-show="isShow"
    class="popup_bg"
  >
    <div class="popup">
      <div class="popup_title">
        Заявление<br>на возврат средств
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
            ref="input_phone"
            title="Ваш номер телефона"
            name="phone"
            mask="phone"
            :max="10"
            @setValue="setInputValue"
          />
        </div>
        <div :class="`button_ok popup_button ${isDisabled ? 'disabled' : ''}`" @click="print">
          Печать
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
import { saleCheckgenapp, saleGenapp } from '~/api'
import { getPassErrorText } from '~/libs/error'

export default {
  components: {
    Input
  },
  data() {
    return {
      isShow: false,
      code: '',
      phone: '',
    }
  },
  computed: {
    isDisabled() {
      if (this.code.length === 11 && this.phone.length === 10) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    show() {
      this.isShow = true

      this.$refs.input_code.inputClean()
      this.$refs.input_phone.inputClean()
      this.code = ''
      this.phone = ''
    },
    hide() {
      this.isShow = false
    },
    setInputValue(value, field) {
      if (field === 'code') {
        this.code = value
      }

      if (field === 'phone') {
        this.phone = value
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
        req = await saleCheckgenapp(this.code)
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

      if (req.data.content.appPrinted === '1') {
        this.$emit('error', getPassErrorText('printed'), 15000)
        return false
      }

      this.$emit('preloader', true, 'Формирования Заявление<br>на возврат средств')

      req = {}

      try {
        req = await saleGenapp(this.code, this.phone)
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

      this.$emit('passPrinting')
    }
  }
}
</script>
