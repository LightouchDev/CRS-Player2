import Vue from 'vue'
import Toast from './Toast'

let queue = []
let showing = false

function spawn(propsData) {
  const ToastComponent = Vue.extend(Toast)
  return new ToastComponent({
    el: document.createElement('div'),
    propsData,
    onClose: function() {
      showing = false
      processQueue()
    }
  })
}

function processQueue() {
  if (queue.length < 1) return
  if (showing) return

  let nextInLine = queue[0]
  spawn(nextInLine)
  showing = true

  queue.shift()
}

export { Toast }
export default {
  open(params) {
    if (!params.text) throw new Error('[toast] no text supplied')

    // push into queue
    queue.push(params)
    processQueue()
  }
}
