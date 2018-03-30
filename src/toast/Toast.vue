<template>
  <v-snackbar
    v-model="open"
    v-bind="mergedOptions">
    <div class="ctn">
      <div
        v-if="title"
        class="title mb-2"
      >{{ title }}</div>
      <div class="txt">{{ text }}</div>
    </div>
    <v-btn
      v-if="mergedOptions.closeable"
      flat
      icon
      @click.native="open = false"
    >
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    title: {
      default: '',
      type: String
    },
    text: {
      default: '',
      type: String,
      required: true
    },
    type: {
      default: '',
      type: String
    },
    options: {
      default () { return {} },
      type: Object
    },
  },
  data() {
    return {
      mergedOptions: Object.assign({
        color: 'info',
        closeable: true,
        'auto-height': true,
        timeout: 1200,
        top: true,
        multiLine: !!this.title || this.text.length > 80
      }, this.options),
      open: false,
    }
  },
  watch: {
    open (val) {
      !val && this.close()
    },
  },
  beforeMount() {
    document.querySelector('#app').appendChild(this.$el)
  },
  mounted() {
    this.open = true
  },
  methods: {
    close() {
      if (this.open) this.open = false
      setTimeout(() => {
        this.$options.onClose()
        this.$destroy()
        removeElement(this.$el)
      }, 700) // wait for close animation
    },
  },
}

function removeElement(el) {
  typeof el.remove !== 'undefined'
    ? el.remove()
    : el.parentNode.removeChild(el)
}
</script>