import toast from '@/toast'

/**
 * activeFloatPlayer: the list of active twitch channel name.
 * currentChannel: the twitch channel name of the main player.
 * currentView: the current view of main window. value: 'placeholder' or 'player'
 * currentPlatform: the platform of current channel, it would affect the icon of the header bar.
 * title: current page title, change this to modify header and browser title, default: package name
 */

const state = {
  activeFloatPlayer: [],
  currentChannel: '',
  currentPlatform: 'twitch',
  currentView: 'placeholder',
  okChannelID: '',
  title: require('@/../package.json').productName
}

const mutations = {
  Update (state, payload) {
    Object.assign(state, payload)
    // change title here
    if (payload.title) {
      document.title = `${payload.title} - ${this.state.Config.titlePostfix}`
    }
  }
}

const actions = {
  Update ({ commit }, payload) {
    commit('Update', payload)
  },
  FetchInfo ({ commit, state }) {
    // FIXME: kraken api will expire in the end of 2018.
    /**
     * fetch main channel info
     */
    const { mainChannel, client_id } = this.state.Config
    fetch(`https://api.twitch.tv/kraken/channels/${mainChannel}?client_id=${client_id}`)
      .then(Response => Response.json())
      .then(json => { 
        commit('Update', {
          title: json.status,
          info: json
        })
        this.commit('DisplayName/Update', {
          [json.name]: json.display_name
        })
      })
      .then(() => toast.open({
        text: '擷取頻道資訊成功',
        options: { color: 'success' }
      }))
      .catch((Reason) => toast.open({
        text: `擷取頻道資訊發生錯誤 (${Reason})`,
        options: { color: 'error' }
      }))
    /**
     * Fetch hosting, external info
     */
    fetch('https://crs-dlbot.herokuapp.com/cors')
    .then(Response => Response.json())
    .then(({ hosts }) => {
      // let obj = {}
      /*
      if (hosts[0].target_login) {
        console.log(state)
      }
      */
      commit('Update', {
        CRS: hosts
      })
    })
    .then(() => toast.open({
      text: '擷取 Host, 外部站台 成功',
      options: { color: 'success' }
    }))
    .catch((Reason) => toast.open({
      text: `擷取 Host, 外部站台 發生錯誤 (${Reason})`,
      options: { color: 'error' }
    }))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}