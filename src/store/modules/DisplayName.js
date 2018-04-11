import Vue from 'vue'
import { info, warn, gql } from '@/utils'

const state = {}

const mutations = {
  Delete (state, payload) {
    Vue.delete(state, payload)
  },
  Update (state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(state, key, payload[key])
    })
  }
}

const actions = {
  Fetch ({ commit }, login) {
    gql({
      query: `query {
        user(login: "${login}") {
          displayName
        }
      }`
    })
      .then(Response => Response.json())
      .then(({ data }) =>
        commit('Update', {
          [login]: data.user.displayName
        }))
      .then(() =>
        info(`[GQL] ${login} display name get.`))
      .catch(Reason =>
        warn(`[GQL] ${login} display name failed. (${Reason})`))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
