import Vue from 'vue'
import { eventBus, gql, info, warn, preset } from '@/utils'

const state = {
  active: {},
  booted: [],
  fetching: false,
  opacity: {}
}

const mutations = {
  Add (Player, channelInfo) {
    // do not launch main channel to float player.
    if (preset.mainChannel === channelInfo.login) return

    Player.booted.some(obj => obj.login === channelInfo.login) || Player.booted.push(channelInfo)
    Vue.set(Player.active, channelInfo.login, true)
    Vue.set(Player.opacity, channelInfo.login, 100)
  },
  Disable (Player, channel) {
    Vue.set(Player.active, channel, false)
  },
  EditOpacity (Player, { channel, opacity }) {
    Vue.set(Player.opacity, channel, opacity)
  },
  Enable (Player, channel) {
    Vue.set(Player.active, channel, true)
  },
  Fetched (Player) {
    Player.fetching = false
  },
  Fetching (Player) {
    Player.fetching = true
  },
  Remove (Player, channel) {
    if (Player.booted.some(obj => obj.login === channel)) {
      Vue.delete(Player.active, channel)
      Vue.delete(Player.opacity, channel)
    }
    Vue.set(Player, 'booted', Player.booted.filter(obj => obj.login !== channel))

    this.dispatch('View/RemoveChat', channel)
  },
  ToggleVisibility (Player, channel) {
    Vue.set(Player.active, channel, !Player.active[channel])
  },
  UpdateOrder (Player, booted) {
    Vue.set(Player, 'booted', booted)
  }
}

const actions = {
  FetchAndAdd ({ commit, state }, channel) {
    if (state.fetching || !channel) return
    commit('Fetching')

    gql({
      query: `query {
        user(login: "${channel}") {
          displayName
          login
          profileImageURL(width: 150)
          stream {
            previewImageURL(width: 320, height: 180)
          }
        }
      }
      `
    })
      .then(Response => Response.json())
      .then(({ data }) => {
        if (!data.user.login) throw new Error('請檢查你的帳號名稱')
        const { user } = data

        user.dedicated = true
        user.previewImageURL = user.stream.previewImageURL
        this.commit('DisplayName/Update', {
          [channel]: user.displayName
        })
        delete user.stream

        commit('Add', user)
        commit('Fetched')
      })
      .then(() =>
        info(`[Store] new channel "${channel}" fetched.`))
      .catch((Reason) => {
        eventBus.emit('toast-error', `擷取追蹤列表時發生錯誤 (${Reason})`)
        warn(`[Store] can't fetch channel "${channel}" (${Reason})`)
        commit('Fetched')
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
