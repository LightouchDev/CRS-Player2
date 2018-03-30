const state = process.env.preset

const mutations = {
  Update (state, payload) {
    Object.assign(state, payload)
  }
}

const actions = {
  Update ({ commit }, payload) {
    commit('Update', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}