<template>
  <div
    class="halls"
  >
    <div
      class="hall"
    >
      <div class="hall_title">
        {{ getHallTitle }}
      </div>

      <div class="canvas-holder">
        <canvas
          ref="hall"
          width="1080"
          height="547"
        />
      </div>

      <div class="hall_info">
        <template v-for="(price, index) in seance.price">
          <span :key="index">
            <div
              class="hall_place"
              :style="`border-color: ${placeColor(price.id)}`"
            />
            <span>
              {{ price.sum }} руб.
            </span>
          </span>
        </template>
      </div>

      <div class="lock_text">
        <span>Покупка билетов</span>
        <br>
        <span>на сеанс</span>
        <br>
        <span>будет доступна завтра</span>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import SchemeDesignerLayer from 'schemeDesigner/Layer'
import SchemeDesignerSchemeObject from 'schemeDesigner/SchemeObject'
import SchemeDesignerScheme from 'schemeDesigner/Scheme'
import { hallPlan, hallPlanList } from '~/api'
import { renderPlace, renderRow, renderScreen, setRenderVariables } from '~/libs/render'

export default {
  props: {
    seance: {
      type: Object,
      required: true
    },
    forRemove: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      places: new Map(),
      placesArray: [],
      schemeDesigner: null,
      hallLayerId: null,
      halls: new Map(),
      placesLimit: 6
    }
  },
  computed: {
    getHallTitle() {
      return this.$store.state.config.hallTitles[this.seance.hallId] || ''
    }
  },
  watch: {
    seance: "initHall",
    forRemove: "removePlace"
  },
  mounted() {
    setRenderVariables(this.$store.state.config.variables)
  },
  methods: {
    beforeRenderAll() {
      // console.time('renderAll')
    },
    afterRenderAll() {
      // console.timeEnd('renderAll')
    },
    clickOnObject(e) {
      // console.log('clickOnObject')
    },
    mouseOverObject() {
      // console.log('mouseOverObject')
    },
    mouseLeaveObject() {
      // console.log('mouseLeaveObject')
    },
    onScroll() {
      // console.log('onScroll')
    },
    clearFunction(schemeObject, schemeDesigner, view) {
      const ctx = view.getContext()

      const borderWidth = 5
      ctx.clearRect(
        schemeObject.x - borderWidth,
        schemeObject.y - borderWidth,
        this.width + borderWidth * 2,
        this.height + borderWidth * 2
      )
    },
    clickOnPlace(schemeObject, schemeDesigner, view, e) {
      if (!schemeObject.params.isSelected && this.places.size === this.placesLimit) {
        return false
      }

      schemeObject.params.isSelected = !schemeObject.params.isSelected

      const place = {... schemeObject.params }

      place.price = this.getPrice(place.type).price

      if (schemeObject.params.isSelected) {
        this.places.set(schemeObject.params.id, place)
      } else {
        this.places.delete(schemeObject.params.id)
      }

      this.$emit("selectPlaces", this.getPlacesArray())
    },

    async initHall() {
      let req = {}
      try {
        req = await hallPlan(this.seance.hallId)
      } catch(e) {
        this.$store.commit('setDisconnect', true)

        // eslint-disable-next-line no-console
        console.error(e)
        return false
      }

      const canvas = this.$refs.hall

      const hallLayer = new SchemeDesignerLayer('layer' + window.globalSession, {
        zIndex: 1
      })

      req.data.places.forEach((place) => {
        const id = `p${place.row}_${place.place}`
        const schemeObject = new SchemeDesignerSchemeObject({
          id,
          x: place.x,
          y: place.y,
          width: place.width,
          height: place.height,
          active: 1,
          renderFunction: (schemeObject, schemeDesigner, view) => {
            const type = schemeObject.params.type

            switch (type) {
              case 'screen':
                return renderScreen(schemeObject, schemeDesigner, view)

              case 'row':
                return renderRow(schemeObject, schemeDesigner, view)

              default:
                return renderPlace(schemeObject, schemeDesigner, view)
            }
          },
          cursorStyle: 'pointer',
          rotation: 0,
          place: place.place,
          row: place.row,
          type: place.type,
          text: place.text,

          isSelected: false,
          clickFunction: (schemeObject, schemeDesigner, view, e) => {
            return this.clickOnPlace(schemeObject, schemeDesigner, view, e)
          },
          clearFunction: (schemeObject, schemeDesigner, view) => {
            return this.clearFunction(schemeObject, schemeDesigner, view)
          }
        })

        hallLayer.addObject(schemeObject)
      })

      if (this.schemeDesigner === null) {
        this.schemeDesigner = new SchemeDesignerScheme(canvas, {
          options: {
            cacheSchemeRatio: 2
          },
          scroll: {
            maxHiddenPart: 0.5
          },
          zoom: {
            scale: 1,
            maxScale: 1
          },
          storage: {
            treeDepth: 6
          },
          event: {
            zoomDisabled: true
          }
        })

        canvas.addEventListener('beforeRenderAll', this.renderAll, false)
        canvas.addEventListener('afterRenderAll', this.renderAll, false)
        canvas.addEventListener('clickOnObject', this.clickOnObject, false)
        canvas.addEventListener('mouseOverObject', this.mouseOverObject, false)
        canvas.addEventListener('mouseLeaveObject', this.mouseLeaveObject, false)
        canvas.addEventListener('scroll', this.onScroll, false)
      }

      this.schemeDesigner.addLayer(hallLayer)
      this.schemeDesigner.removeLayer(this.hallLayerId)
      this.hallLayerId = 'layer' + window.globalSession
      this.schemeDesigner.render()
      this.schemeDesigner.getZoomManager().zoomToCenter(-100) // -100 чтобы наверняка
      this.schemeDesigner.requestRenderAll()

      this.getHallPlanList()
    },

    async getHallPlanList() {
      let req = {}
      try {
        req = await hallPlanList()
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
        typeof req.data.content.hallplan === 'undefined' ||
        req.data.content.hallplan.length === 0) {
          // eslint-disable-next-line no-console
          console.log('Update schedule no')

          this.$store.commit('setDisconnect', true)
          setTimeout(this.getHallPlanList, 1000) // 1 sec

          return false
      }

      this.$store.commit('setDisconnect', false)
      this.$store.commit('setHallPlanList', req.data.content.hallplan)

      this.updateHall()

      setTimeout(this.getHallPlanList, 10000) // 1 sec
    },

    updateHall() {
      const seanceHallPlan = this.$store.state.hallPlanList[window.globalSession]
      const layer = this.schemeDesigner.storageManager.layers[this.hallLayerId]

      if (!seanceHallPlan) {
        return false
      }

      seanceHallPlan.forEach((item) => {
        const id = `p${item.row}_${item.place}`
        const place = layer.getObjectById(id)

        if (!place) {
          return true
        }

        place.params.type = item.placeType
        place.params.fragment = item.fragment
        place.params.level = item.level
        place.params.status = item.status
      })

      this.schemeDesigner.storageManager.getTree()
      this.schemeDesigner.updateCache(false)
      this.schemeDesigner.requestDrawFromCache()
    },

    getPlacesArray() {
      const placesArray = []
      this.places.forEach((value, key) => {
        placesArray.push({
          value,
          key
        })
      })

      return placesArray
    },

    cleaningPlaces() {
      if (this.schemeDesigner === null) {
        return false
      }

      const objects = this.schemeDesigner.storageManager.layers[this.hallLayerId].objects

      objects.forEach((obj) => {
        if (obj.params.isSelected) {
          this.places.delete(obj.params.id)
          obj.params.isSelected = false
        }
      })

      this.schemeDesigner.storageManager.getTree()
      this.schemeDesigner.updateCache(false)
      this.schemeDesigner.requestDrawFromCache()

      this.$emit("selectPlaces", this.getPlacesArray())
    },

    removePlace(id) {
      const layer = this.schemeDesigner.storageManager.layers[this.hallLayerId]
      const place = layer.getObjectById(id)

      if (!place) {
        return true
      }

      place.params.isSelected = false

      this.places.delete(id)

      this.schemeDesigner.storageManager.getTree()
      this.schemeDesigner.updateCache(false)
      this.schemeDesigner.requestDrawFromCache()

      this.$emit("selectPlaces", this.getPlacesArray())
    },

    placeColor(type) {
      const colors = this.$store.state.config.variables

      if (colors[`type${type}`]) {
        return colors[`type${type}`].stroke
      }

      return colors.default.stroke
    },
    getPrice(type) {
      return this.seance.price.find((item) => {
        return item.id === type
      })
    }
  }
}
</script>
