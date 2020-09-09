<template>
  <div
    v-show="isShow"
    class="preloader"
  >
    <div class="preloader_print">
      <div
        class="preloader_text preloader_text_print"
      >
        Идет<br>печать чека
      </div>
    </div>
  </div>
</template>

<script>
import { getPrintErrorText } from '~/libs/error'
import { salePrint } from '~/api'

export default {
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    async show(text) {
      this.isShow = true

      let req = {}
      try {
        req = await salePrint()
      } catch(e) {
        this.$store.commit('setDisconnect', true)

        // eslint-disable-next-line no-console
        console.error(e)
        return false
      }

      this.isShow = false

      if (req.data.result !== 'OK') {
        let text = getPrintErrorText('default')

        if (typeof req.data.error !== 'undefined') {
          text = getPrintErrorText(req.data.error.code)
        }

        this.$emit("error", text, 15000)
      }
    },
    hide() {
      this.isShow = false
      this.text = null
    }
  }
}
</script>
