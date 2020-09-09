<template>
  <div class="main">
    <button @click="popupAdminCheck">
      popupAdminCheck
    </button>
    <button @click="showPopupError('Тестовое сообщение с ошибкой', 60000)">
      showPopupError
    </button>
    <button @click="openAdminPanel">
      openAdminPanel
    </button>
    <button @click="payWindow">
      payWindow
    </button>
    <button @click="print(null)">
      print
    </button>
    <button @click="print('Что-то печатем')">
      print + text
    </button>
    <button @click="preloaderClockTrigger(null)">
      preloaderClock
    </button>
    <button @click="preloaderClockTrigger('Что-то загружаем')">
      preloaderClock + text
    </button>

    <Hall
      ref="hall"
      :seance="currentSeance"
      :for-remove="placeForRemove"
    />

    <Intro />
    <Disconnect />

    <PreloaderClock
      ref="preloaderClock"
    />

    <PopupError
      ref="popupError"
    />

    <PopupAdminCheck
      ref="popupAdminCheck"
      @error="showPopupError"
      @allow="openAdminPanel"
    />

    <PopupAdmin
      ref="popupAdmin"
      @error="showPopupError"
      @preloader="preloaderClockTrigger"
    />

    <PassPrinting
      :show="false"
    />

    <PassMenu
      :show="false"
    />

    <PassMoney
      :show="false"
    />

    <PassStep1
      :show="false"
    />

    <PassStep2
      :show="false"
    />

    <PopupPay
      ref="popupPopupPay"
      @error="showPopupError"
      @print="print"
    />

    <PreviewTicket
      ref="popupPreviewTicket"
      @pay="payWindow"
    />

    <PreloaderPrint
      ref="preloaderPrint"
    />
  </div>
</template>

<script>
import Intro from '~/components/Intro.vue'
import Disconnect from '~/components/Disconnect.vue'
import Hall from '~/components/Hall.vue'
import PreloaderClock from '~/components/PreloaderClock.vue'
import PopupError from '~/components/popups/Error.vue'
import PopupAdmin from '~/components/popups/Admin.vue'
import PopupAdminCheck from '~/components/popups/AdminCheck.vue'
import PassPrinting from '~/components/popups/pass/Printing.vue'
import PassMenu from '~/components/popups/pass/Menu.vue'
import PassMoney from '~/components/popups/pass/Money.vue'
import PassStep1 from '~/components/popups/pass/Step1.vue'
import PassStep2 from '~/components/popups/pass/Step2.vue'
import PopupPay from '~/components/popups/Pay.vue'
import PreviewTicket from '~/components/popups/PreviewTicket.vue'
import PreloaderPrint from '~/components/PreloaderPrint.vue'
import { getGlobalConfig, getCinemaConfig } from '~/api'

export default {
  components: {
    Intro,
    Disconnect,
    Hall,
    PreloaderClock,
    PopupError,
    PopupAdmin,
    PopupAdminCheck,
    PassPrinting,
    PassMenu,
    PassMoney,
    PassStep1,
    PassStep2,
    PopupPay,
    PreviewTicket,
    PreloaderPrint,
  },
  async asyncData({ params, store, route, redirect }) {
    let global = {}
    let cinema = {}
    try {
      global = await getGlobalConfig()
    } catch(e) {
      store.commit('setDisconnect', true)

      // eslint-disable-next-line no-console
      console.log('No global config')
      // eslint-disable-next-line no-console
      console.error(e)

      return {}
    }

    try {
      cinema = await getCinemaConfig()
    } catch(e) {
      store.commit('setDisconnect', true)

      // eslint-disable-next-line no-console
      console.log('No cinema config')
      // eslint-disable-next-line no-console
      console.error(e)

      return {}
    }

    store.commit('setConfig', Object.assign(global.data, cinema.data))

    return {}
  },
  data() {
    return {
      currentSeance: {},
      placesArray: [],
      placeForRemove: ''
    }
  },
  methods: {
    print(text) {
      this.$refs.preloaderPrint.show(text)
    },

    payWindow() {
      this.$refs.popupPopupPay.show()
    },

    showPopupError(text, timeout) {
      this.$refs.popupError.show(text, timeout)
    },

    popupAdminCheck() {
      this.$refs.popupAdminCheck.show()
    },

    openAdminPanel() {
      this.$refs.popupAdmin.show()
    },

    preloaderClockTrigger(text) {
      this.$refs.preloaderClock.show(text)
    }

  }
}
</script>
