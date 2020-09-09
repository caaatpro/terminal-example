<template>
  <div />
</template>

<script>
export default {

  props: {
    error: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.error(this.error)
    return this.$router.replace({ path: `/?${new Date().getTime()}` })
  }
}
</script>
