import Vue from 'vue'

const state = {}

const mutations = {
  Delete (state,payload) {
    Vue.delete(state, payload)
  },
  Update (state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(state, key, payload[key])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
