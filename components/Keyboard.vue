<template>
  <div
    v-show="isShow"
    :ref="`keyboard_${inputName}`"
    class="keyboard"
  >
    <div class="keyboard_buttons">
      <div
        class="keyboard_button"
        @click="button('1')"
      >
        <i>1</i>
      </div>
      <div
        class="keyboard_button"
        @click="button('2')"
      >
        <i>2</i>
      </div>
      <div
        class="keyboard_button"
        @click="button('3')"
      >
        <i>3</i>
      </div>

      <div
        class="keyboard_button"
        @click="button('4')"
      >
        <i>4</i>
      </div>
      <div
        class="keyboard_button"
        @click="button('5')"
      >
        <i>5</i>
      </div>
      <div
        class="keyboard_button"
        @click="button('6')"
      >
        <i>6</i>
      </div>

      <div
        class="keyboard_button"
        @click="button('7')"
      >
        <i>7</i>
      </div>
      <div
        class="keyboard_button"
        @click="button('8')"
      >
        <i>8</i>
      </div>
      <div
        class="keyboard_button"
        @click="button('9')"
      >
        <i>9</i>
      </div>

      <div
        class="keyboard_button clean"
        @click="button('clean')"
      >
        <i>X</i>
      </div>
      <div
        class="keyboard_button"
        @click="button('0')"
      >
        <i>0</i>
      </div>
      <div
        class="keyboard_button back"
        @click="button('back')"
      >
        <i>&lt;</i>
      </div>
    </div>

    <div
      class="keyboard_close"
      @click="hide"
    >
      Закрыть
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    inputName: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  watch: {
    show: "toggle",
    position: "changePosition"
  },
  created() {
    this.toggle()
  },
  methods: {
    toggle() {
      this.isShow = this.show
      this.changePosition(20)
    },
    hide() {
      this.$store.commit("setInput", '')
    },
    button(key) {
      this.$emit("buttonPress", key)
    },
    changePosition(value) {
      const keyboard = this.$refs[`keyboard_${this.inputName}`]

      if (!keyboard) return

      keyboard.style.transform = `translate(-50%, ${this.position}px)`
    }
  }
}
</script>
