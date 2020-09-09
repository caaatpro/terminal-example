<template>
  <header class="header">
    <div
      class="header_title"
    >
      Ближайшие сеансы на сегодня
    </div>
    <div
      class="header_time"
    >
      {{ time }}
    </div>
  </header>
</template>

<script>
export default {
  data: () => {
    return {
      time: "00:00"
    }
  },
  mounted() {
    setInterval(() => {
      const date = new Date()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      if (hours < 10) hours = `0${hours}`
      if (minutes < 10) minutes = `0${minutes}`
      this.time = `${hours}:${minutes}`
    }, 1000)
  },
  methods: {
    popupAdminCheck() {
      this.$emit("popupAdminCheck")
    }
  }
}
</script>>
