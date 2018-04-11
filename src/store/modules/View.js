import { eventBus, gql, info, warn, preset } from '@/utils'
const { mainChannel, titlePostfix } = preset

/**
 * currentChannel: the twitch channel name of the main player.
 * currentView: the current view of main window. value: 'placeholder' or 'player'
 * currentPlatform: the platform of current channel, it would affect the icon of the header bar.
 * host: current hosting channel.
 * live: is stream online.
 * sidebar: show sidebar or not.
 * title: current page title, change this to modify header and browser title, default: package name
 */

const state = {
  currentChannel: '',
  currentChat: mainChannel,
  currentPlatform: 'twitch',
  currentView: 'placeholder',
  enabledChat: [mainChannel],
  host: '',
  live: false,
  sidebar: true,
  title: require('@/../package.json').productName
}

const mutations = {
  ActiveChat (View, channel) {
    if (!View.enabledChat.includes(channel)) {
      View.enabledChat.push(channel)
    }
  },
  ChangeChat (state, channel) {
    state.currentChat = channel
  },
  UpdateChat (View, enabledChat) {
    View.enabledChat = enabledChat
  },
  Update (state, payload) {
    Object.assign(state, payload)
    // change title here
    if (payload.title) {
      document.title = `${payload.title} - ${titlePostfix}`
    }
  },
  ToggleSidebar (View) {
    View.sidebar = !View.sidebar
  }
}

const actions = {
  Update ({ commit }, payload) {
    commit('Update', payload)
  },
  ChangeChat ({ commit, state }, channel) {
    if (!state.enabledChat.includes(channel)) {
      commit('ActiveChat', channel)
    }
    commit('ChangeChat', channel)
  },
  RemoveChat ({ commit, state }, channel) {
    const newArray = state.enabledChat.filter(item => item !== channel)
    if (state.currentChat === channel) {
      commit('ChangeChat', newArray[0])
    }
    commit('UpdateChat', newArray)
  },
  FetchInfo ({ commit, state }) {
    /**
     * fetch main channel info
     */
    gql({
      query: `query {
        user(login: "${mainChannel}") {
          broadcastSettings {
            title
          }
          displayName
          hosting {
            login
            displayName
          }
          stream {
            id
          }
        }
      }`
    })
      .then(Response => Response.json())
      .then(({ data }) => {
        commit('Update', {
          host: data.user.hosting.login || null,
          live: !!data.user.stream.id,
          title: data.user.broadcastSettings.title
        })
        this.commit('DisplayName/Update', {
          [mainChannel]: data.user.displayName
        })
        if (data.user.hosting.login) {
          this.commit('DisplayName/Update', {
            [data.user.hosting.login]: data.user.hosting.displayName
          })
        }
      })
      .then(() => {
        eventBus.emit('toast-success', '擷取頻道資訊成功')
        eventBus.emit('parse-menu')
        info('[Store] fetch from GraphQL success!')
      })
      .catch((Reason) => {
        eventBus.emit('toast-error', `擷取頻道資訊時發生錯誤 (${Reason})`)
        eventBus.emit('fallback-menu')
        warn(`[Store] fetch from GraphQL error (${Reason})`)
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
