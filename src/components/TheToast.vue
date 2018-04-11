<template>
  <v-snackbar
    v-model="open"
    v-bind="options">
    <div class="ctn">
      <div
        v-if="title"
        class="title mb-2"
      >{{ title }}</div>
      <div class="txt">{{ text }}</div>
    </div>
    <v-btn
      v-if="closeable"
      flat
      icon
      @click.native="close"
    >
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { eventBus } from '@/utils'

const queue = []

/**
 * Open a new toast
 * @param {Object}  params
 * @param {Boolean} params.closeable - show a close button
 * @param {Object}  params.options   - the props of v-snackbar
 * @param {String}  params.text      - the content of the toast
 * @param {String}  params.title     - the title of the toast
 */
function open (params) {
  if (!params.text) throw new Error('[toast] no text supplied')

  params.closeable = params.closeable === undefined && true
  params.options = Object.assign({
    color: 'info',
    'auto-height': true,
    timeout: 1200,
    top: true,
    'multi-line': !!params.title || params.text.length > 80
  }, params.options)

  // push into queue
  queue.push(params)
  eventBus.emit('toast-process-queue')
}

eventBus.on('toast-open', open)
eventBus.on('toast-success', text =>
  open({
    text,
    options: { color: 'success' }
  }))
eventBus.on('toast-error', text =>
  open({
    text,
    options: { color: 'error' }
  }))

export default {
  name: 'TheToast',
  data () {
    return {
      closeable: false,
      open: false,
      options: {},
      text: '',
      title: ''
    }
  },
  watch: {
    open (boolean) {
      !boolean && this.close()
    }
  },
  mounted () {
    const processQueue = () => {
      if (this.open) return

      if (queue.length) {
        const toast = queue.shift()

        this.closeable = toast.closeable
        this.options = toast.options
        this.text = toast.text
        this.title = toast.title

        // wait for close animation
        setTimeout(() => {
          this.open = true
        }, 700)
      }
    }
    eventBus.on('toast-process-queue', processQueue)

    processQueue()
  },
  methods: {
    close () {
      this.open = false
      queue.length && eventBus.emit('toast-process-queue')
    }
  }
}
</script>
