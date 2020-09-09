<template>
  <footer :class="`footer ${places.length == 0 ? 'footer_no_tickets' : ''}`">
    <div class="footer_title_info">
      Время – Сеанс
    </div>
    <div
      class="footer_title_time"
    >
      {{ seance.sessionTime }} – {{ seance.movieName }} {{ seance.brackets }}
    </div>

    <div class="footer_tickets">
      <div class="footer_tickets_title">
        Выбранные места
      </div>

      <div class="footer_tickets_items">
        <div class="footer_tickets_items_bg">
          <template v-for="n in 6">
            <div
              :key="n"
              class="footer_tickets_item default"
            >
              <svg
                enable-background="new 0 0 150 84"
                viewBox="0 0 150 84"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="path"
                  d="m147 84c1.7 0 3-1.3 3-3v-78c0-1.7-1.3-3-3-3h-144c-1.7 0-3 1.3-3 3v78c0 1.7 1.3 3 3 3"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="77"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="70"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="56"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="63"
                  r="2"
                />
                <path
                  class="circle"
                  d="m126 82c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z"
                />
                <path
                  class="circle"
                  d="m126 2c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="14"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="7"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="21"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="49"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="28"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="42"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="35"
                  r="2"
                />
              </svg>
              <div class="footer_tickets_item_num">
                {{ n }}
              </div>
            </div>
          </template>
        </div>

        <div class="footer_tickets_items_area">
          <template v-for="(place, index) in places">
            <div
              :key="index"
              class="footer_tickets_item preloader_circle"
              @click="removePlace(place.key)"
            >
              <svg
                enable-background="new 0 0 150 84"
                viewBox="0 0 150 84"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="path"
                  d="m147 84c1.7 0 3-1.3 3-3v-78c0-1.7-1.3-3-3-3h-144c-1.7 0-3 1.3-3 3v78c0 1.7 1.3 3 3 3"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="77"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="70"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="56"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="63"
                  r="2"
                />
                <path
                  class="circle"
                  d="m126 82c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z"
                />
                <path
                  class="circle"
                  d="m126 2c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="14"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="7"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="21"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="49"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="28"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="42"
                  r="2"
                />
                <circle
                  class="circle"
                  cx="126"
                  cy="35"
                  r="2"
                />
              </svg>
              <div class="footer_tickets_item_info">
                <span class="row">
                  Р:
                  <i class="ticket_row">{{ place.value.row }}</i>
                </span>
                <span class="place">
                  М:
                  <i class="ticket_place">{{ place.value.place }}</i>
                </span>
              </div>
              <div class="footer_tickets_item_sum">
                <i class="ticket_sum">{{ place.value.price }}</i> руб.
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="footer_controls">
      <div class="footer_controls_price">
        <div
          class="footer_controls_price_clean"
          @click="cleaningPlaces"
        >
          Очистить
        </div>
        <div class="footer_controls_price_title">
          Итого к оплате
        </div>
        <div class="footer_controls_price_sum">
          {{ getTotalPrice }} руб.
        </div>
      </div>
      <div
        class="footer_controls_button"
        @click="pay"
      >
        Оплатить
      </div>
      <div
        v-if="returnTicket"
        class="footer_controls_button pass_ticket_button"
        @click="passTicket"
      >
        Возврат
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    places: {
      type: Array,
      required: true
    },
    seance: {
      type: Object,
      required: true
    },
    returnTicket: {
      type: Boolean,
      required: true
    }
  },
  data: () => {
    return {
      currentSeanceId: null
    }
  },
  computed: {
    getTotalPrice () {
      let price = 0

      this.places.forEach((place) => {
        price += place.value.price
      })

      window.globalSum = price

      return price
    }
  },
  methods: {
    removePlace(key) {
      this.$emit("removePlace", key)
    },
    cleaningPlaces() {
      this.$emit("cleaningPlaces")
    },
    pay() {
      if (this.places.length === 0) {
        return false
      }

      this.$emit("pay")
    },
    passTicket() {
      this.$emit("passTicket")
    }
  },
}
</script>
