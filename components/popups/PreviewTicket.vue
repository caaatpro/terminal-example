<template>
  <div
    v-show="isShow"
    class="popup_bg"
  >
    <div class="popup">
      <div class="popup_title">
        Ваш выбор
      </div>
      <div class="popup_content">
        <ul class="desc-props">
          <li>
            <div class="label">
              Время сеанса
            </div>
            <div
              class="value"
            >
              {{ sessionDate }}, {{ sessionTime }}
            </div>
          </li>
          <li>
            <div class="label">
              Фильм
            </div>
            <div class="value">
              <span>{{ movieTitle }}</span>
              <div class="type">
                {{ movieFormat }}
              </div>
            </div>
          </li>
          <li>
            <div class="label">
              Зал
            </div>
            <div
              class="value"
            >
              {{ hallName }}
            </div>
          </li>
          <li>
            <div class="label">
              Выбранные места
            </div>
            <div
              class="value"
            >
              <template v-for="(row, index) in rows">
                <div :key="index">
                  <span>Ряд:</span> {{ row.num }}, <span>Место:</span> {{ row.places }}
                </div>
              </template>
            </div>
          </li>
          <li>
            <div class="label">
              Сумма к оплате
            </div>
            <div
              class="value"
            >
              {{ globalSum }}
            </div>
          </li>

          <li
            v-if="sale > 0"
            class="discount"
          >
            <div class="label">
              Скидка 8%
            </div>
            <div
              class="value"
            >
              {{ sale }}
            </div>
          </li>
          <li
            v-if="sale > 0"
            class="total"
          >
            <div class="label">
              Итого со скидкой
            </div>
            <div
              class="value"
            >
              {{ totalPrice }}
            </div>
          </li>
        </ul>
        <div
          class="button_ok popup_button"
          @click="pay"
        >
          Оплатить
        </div>
        <br>
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
import moment from "moment"
import { saleCancel } from '~/api'

export default {
  data() {
    return {
      isShow: false,
      sessionDate: null,
      sessionTime: null,
      movieTitle: null,
      movieFormat: null,
      hallName: null,
      rows: {},
      sale: 0,
      totalPrice: 0,
      globalSum: 0,
    }
  },
  methods: {
    show(data, seance, places) {
      this.isShow = true

      this.sessionDate = moment(data.sessionDate, 'DD.MM.YYYY').format('dddd, DD MMMM')
      this.sessionTime = data.sessionTime

      this.totalPrice = data.sum
      this.globalSum = data.sum
      this.sale = window.globalSum - this.totalPrice

      this.movieTitle = seance.movieName.replace(seance.movieFormat, '').trim()
      this.movieFormat = seance.movieFormat
      this.hallName = seance.hallName


      this.rows = {}

      places.forEach((place) => {
        if (!this.rows[place.row]) {
          this.rows[place.row] = []
        }

        this.rows[place.row].push(place.place)
      })

      for (const key in this.rows) {
        this.rows[key].sort((a, b) => a - b)
      }
    },

    pay() {
      this.isShow = false
      this.$emit("pay")
    },

    async hide() {
      this.isShow = false

      try {
        await saleCancel()
      } catch(e) {
        // eslint-disable-next-line no-console
        console.error(e)
        return false
      }
    }
  }
}
</script>
