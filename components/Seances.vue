<template>
  <div
    class="seances"
  >
    <div
      class="seances__container"
    >
      <section
        v-for="(seance, index) in seances"
        :key="index"
        :class="`seances_item ${ (selectedSeance === seance.sessionId) ? 'select' : '' }`"
        @click="selectSeance(seance)"
      >
        <div class="seances_item_time">
          {{ seance.sessionTime }}
        </div>
        <div class="seances_item_title">
          {{ seance.movieName }}
        </div>
        <span class="seances_item_title_info">{{ seance.brackets }}</span>
        <div class="seances_item_hall">
          {{ getHallTitle(seance.hallId) }}
        </div>
        <div class="seances_item_poster">
          <img :src="seance.poster || ''">

          <div class="seances_item_poster_tag">
            <template v-for="(tag, tagIndex) in seanceFormat(seance.format)">
              <p
                :key="tagIndex"
              >
                {{ tag.n }}
              </p>
            </template>
          </div>
        </div>
        <div class="seances_item_genres">
          {{ seance.genre }}
        </div>
        <div class="seances_item_countries">
          {{ seance.country }}
        </div>

        <div class="lock_text">
          <span>Покупка</span>
          <br>
          <span>билетов</span>
          <br>
          <span>на сеанс</span>
          <br>
          <span>будет</span>
          <br>
          <span>доступна</span>
          <br>
          <span>завтра</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import { getScheduleList } from '~/api'

const scheduleListUpdateTime = 180000 // 3 min

export default {
  data: () => {
    return {
      seances: [],
      selectedSeance: null
    }
  },
  mounted() {
    this.scheduleListUpdate()
    // this.selectSeance(this.seances[0]);
  },
  methods: {
    getHallTitle(hallId) {
      return this.$store.state.config.hallTitles[hallId] || ''
    },
    seanceFormat: (format) => {
      if (format == null) {
        return []
      }

      const formatArray = []
      if (format.includes('2D')) {
        formatArray.push({
          n: '2D',
          c: 'color_2d',
        })
      }
      if (format.includes('HFR')) {
        formatArray.push({
          n: 'HFR',
          c: 'color_hfr',
        })
      }
      if (format.includes('3D')) {
        formatArray.push({
          n: '3D',
          c: 'color_3d',
        })
      }
      if (format.includes('IMAX')) {
        formatArray.push({
          n: 'IMAX',
          c: 'color_imax',
        })
      }
      if (format.includes('D-box')) {
        formatArray.push({
          n: 'D-box',
          c: 'color_dbox',
        })
      }
      if (format.includes('Dolby Atmos')) {
        formatArray.push({
          n: 'Dolby Atmos',
          c: 'color_dolbyAtmos',
        })
      }

      return formatArray
    },
    selectSeance (seance) {
      window.globalSession = seance.sessionId
      this.selectedSeance = seance.sessionId

      this.$emit("changeSeance", seance)
    },

    async scheduleListUpdate() {
      let req = {}
      try {
        req = await getScheduleList()
      } catch(e) {
        this.$store.commit('setDisconnect', true)

        // eslint-disable-next-line no-console
        console.log('Update schedule no')
        // eslint-disable-next-line no-console
        console.error(e)
        setTimeout(this.scheduleListUpdate, 1000)

        return false
      }

      if (req.data.result !== 'OK' ||
        typeof req.data.content.session === 'undefined' ||
        req.data.content.session.length === 0) {
          this.$store.commit('setDisconnect', true)

          // eslint-disable-next-line no-console
          console.log('Update schedule no')
          setTimeout(this.scheduleListUpdate, 1000)

          return false
      }

      this.$store.commit('setDisconnect', false)

      setTimeout(this.scheduleListUpdate, scheduleListUpdateTime)

      let currentExist = false

      req.data.content.session.forEach((seance) => {
        if (seance.sessionTime == null) return
        if (seance.hallName == null) return
        if (seance.sessionId == null) return
        if (seance.movieName == null) return

        if (this.$store.state.config.testData) {
          seance.format = '2D'
          seance.age = '20+'
          seance.genre = 'Sci Fi, Sci Fi, Sci Fi, Sci Fi'
          seance.country = 'Россия, Россия, Россия, Россия'
          seance.poster = 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/555359d8-7866-4113-b0c5-b5e13e3bf1c8/600x900'
        }

        if (window.globalSession === seance.sessionId) {
          currentExist = true
        }

        let age = ''
        let brackets = ''
        const format = seance.format || ''

        if (seance.age) {
          age = `, ${seance.age}`
        }

        if (format !== '') {
          brackets = ` (${format})`
        }

        if (age !== '') {
          brackets = ` (${age})`
        }

        if (format !== '' && age !== '') {
          brackets = ` (${format}${age})`
        }

        seance.format = format
        seance.brackets = brackets
      })

      this.seances = req.data.content.session

      if (window.globalSession == null || !currentExist) {
        this.selectSeance(this.seances[0])
      }
    }
  },
}
</script>
