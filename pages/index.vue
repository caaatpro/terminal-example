<template>
  <div class="main">
    <Header
      @popupAdminCheck="popupAdminCheck"
    />

    <Seances
      @changeSeance="changeSeance"
    />

    <Hall
      ref="hall"
      :seance="currentSeance"
      :for-remove="placeForRemove"
      @selectPlaces="selectPlaces"
    />

    <Footer
      :places="placesArray"
      :seance="currentSeance"
      :return-ticket="returnTicket"
      @removePlace="removePlace"
      @cleaningPlaces="cleaningPlaces"
      @passTicket="passTicket"
      @pay="pay"
    />
    <Intro :timeout="introTimeout" @showIntro="showIntro" />
    <Disconnect />

    <PreloaderClock
      ref="preloaderClock"
    />

    <PopupError
      ref="popupError"
    />

    <PopupAdminCheck
      ref="popupAdminCheck"
      :admin-code="adminCode"
      @error="showPopupError"
      @allow="openAdminPanel"
    />

    <PopupAdmin
      ref="popupAdmin"
      @error="showPopupError"
      @preloader="preloaderClock"
    />

    <PassPrinting
      ref="popupPassPrinting"
    />

    <PassMenu
      ref="popupPassMenu"
      @selectStep="passSelectStep"
    />

    <PassMoney
      ref="popupPassMoney"
    />

    <PassStep1
      ref="popupPassStep1"
      @preloader="preloaderClock"
      @error="showPopupError"
      @passPrinting="passPrinting"
    />

    <PassStep2
      ref="popupPassStep2"
      @preloader="preloaderClock"
      @error="showPopupError"
      @passMoney="passMoney"
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
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Intro from '~/components/Intro.vue'
import Disconnect from '~/components/Disconnect.vue'
import Seances from '~/components/Seances.vue'
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
import { saleCreateArray, getGlobalConfig, getCinemaConfig, setApiUrl, setGlobalConfig } from '~/api'
import { cleanBadSelected } from '~/libs/places'
import { getPayErrorText } from '~/libs/error'

const previewBuy = false

export default {
  components: {
    Header,
    Footer,
    Intro,
    Disconnect,
    Seances,
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

    setGlobalConfig(global.data)

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
    setApiUrl(store.state.config.apiUrl)

    return {
      introTimeout: store.state.config.introTimeout,
      adminCode: store.state.config.adminCode,
      returnTicket: store.state.config.returnTicket
    }
  },
  data() {
    return {
      currentSeance: {},
      placesArray: [],
      placeForRemove: ''
    }
  },
  methods: {
    changeSeance(value) {
      this.cleaningPlaces()
      this.currentSeance = value
    },
    selectPlaces(value) {
      this.placesArray = value
    },
    removePlace(id) {
      this.$refs.hall.removePlace(id)
    },
    cleaningPlaces() {
      this.$refs.hall.cleaningPlaces()
    },
    async pay() {
      this.$refs.preloaderClock.show(null)

      let req = {}
      try {
        req = await saleCreateArray(this.placesArray)
      } catch(e) {
        this.$store.commit('setDisconnect', true)

        // eslint-disable-next-line no-console
        console.error(e)
        return false
      }

      this.$refs.preloaderClock.hide()
      if (req.data.result !== 'OK') {
        let text = getPayErrorText('default')
        if (typeof req.data.error !== 'undefined' && req.data.error.code === 'ST-119') {
          text = getPayErrorText('ST-119')

          if ({}.propertyIsEnumerable.call(req.data.error, 'str')) {
            const placesForRemove = cleanBadSelected(req.data.error.str)

            placesForRemove.forEach((id) => {
              this.removePlace(id)
            })
          }
        }

        this.$refs.popupError.show(text, 15000)
        return false
      }

      if (previewBuy) {
        this.$refs.popupPreviewTicket.show(req.data.content, this.currentSeance, this.placesArray)
        return false
      }

      this.payWindow()
    },

    print() {
      this.cleaningPlaces()
      this.$refs.preloaderPrint.show()
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

    preloaderClock(status, text) {
      if (status) {
        this.$refs.preloaderClock.show(text)

        return true
      }

      this.$refs.preloaderClock.hide()
      return true
    },
    showIntro() {
      this.$refs.popupPreviewTicket.hide()

      this.$refs.preloaderClock.hide()

      this.$refs.preloaderPrint.hide()
      this.$refs.popupPopupPay.hide()

      this.$refs.popupAdmin.hide()
      this.$refs.popupAdminCheck.hide()

      this.$refs.popupPassMenu.hide()
      this.$refs.popupPassMoney.hide()
      this.$refs.popupPassStep1.hide()
      this.$refs.popupPassStep2.hide()
      this.$refs.popupPassPrinting.hide()

      this.cleaningPlaces()
    },
    passTicket() {
      this.$refs.popupPassMenu.show()
    },
    passSelectStep(step) {
      if (step === 1) {
        this.$refs.popupPassStep1.show()
      } else {
        this.$refs.popupPassStep2.show()
      }
    },
    passMoney(show, sum) {
      if (show) {
        this.$refs.popupPassMoney.show(sum)
      } else {
        this.$refs.popupPassMoney.hide()
      }
    },
    passPrinting() {
      this.$refs.popupPassPrinting.show()
    }
  }
}

// TODO: Обновление залов - проблема когда сеанс исчез
// TODO: Обновление сеансов - проблема, исчезновение сеанса во время работы с пользователем
</script>
