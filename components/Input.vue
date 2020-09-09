<template>
  <div>
    <div class="input_title">
      {{ title }}
    </div>
    <div
      :ref="name"
      :class="`input ${isFocused ? 'focus' : ''}`"
      @click="focus"
    >
      <span
        class="input_value"
        data-value=""
        data-mask="code"
        data-default="___ ___ ___ __"
      >{{ getValue }}</span>
    </div>

    <Keyboard
      :show="isFocused"
      :input-name="name"
      :position="keyboardPosition"
      @buttonPress="buttonPress"
    />
  </div>
</template>

<script>
import StringMask from 'string-mask'
import Keyboard from '~/components/Keyboard.vue'

const formatter = {
  phone: {
    mask: new StringMask('+7 (000) 000 00 00', {
      usedefaults: true,
    }),
    default: '+7 (___) ___ __ __'
  },

  code: {
    mask: new StringMask('000 000 000 00', {
      usedefaults: true,
    }),
    default: '___ ___ ___ __'
  },

  return_code: {
    mask: new StringMask('0000 0000', {
      usedefaults: false,
    }),
    default: '____',
  }
}

export default {
  components: {
    Keyboard
  },
  props: {
    title: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mask: {
      type: String,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isShow: false,
      isFocused: false,
      keyboardPosition: 0,
      value: ''
    }
  },
  computed: {
    getValue() {
      const mask = formatter[this.mask]

      if (this.value === "") {
        return mask.default
      }

      return mask.mask.apply(this.value)
    }
  },
  watch: {
    '$store.state.input': 'toggleInput',
    show: "toggle"
  },
  created() {
    this.toggleInput(this.$store.state.input)
  },
  methods: {
    toggleInput(value) {
      this.isFocused = value === this.name
    },
    toggle() {
      this.isShow = this.show
    },
    hide() {
      this.isShow = false
    },
    button(key) {
      this.$emit("buttonPress", key)
    },
    focus() {
      if (this.isFocused) {
        this.$store.commit("setInput", '')
        this.isFocused = false

        return
      }

      this.$store.commit("setInput", this.name)
      this.isFocused = true

      this.keyboardPosition = this.$refs[this.name].offsetTop
    },
    inputClean() {
      this.value = ''

      this.$emit("setValue", this.value)
    },
    buttonPress(key) {
      switch (key) {
        case 'clean':
          this.inputClean()
          break
        case 'back':
          this.value = this.value.slice(0, -1)
          break
        default:
          if (this.value.length === this.max) {
            return false
          }

          this.value = this.value + key
      }

      this.$emit("setValue", this.value, this.name)
    }
  }
}
</script>
