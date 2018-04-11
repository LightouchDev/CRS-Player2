import Vue from 'vue'
import { eventBus, gql, info, warn } from '@/utils'

const state = {
  fetching: false,
  list: [],
  ready: false
}

/**
 * Sort by last broadcast time and make object flat.
 */
function SortAndReconstruct (list) {
  const result = []
  const displayName = {}

  list
    .sort((a, b) => {
      if (!!a.stream.broadcaster === !!b.stream.broadcaster) {
        return (
          (new Date(a.lastBroadcast.startedAt)) >
          (new Date(b.lastBroadcast.startedAt))
        )
          ? -1 // prepend
          : 1 // append
      }
      return a.stream.broadcaster
        ? -1 // prepend
        : 1 // append
    })
    .forEach(node => {
      result.push(Object.assign({
        login: node.login,
        startedAt: node.lastBroadcast.startedAt
      },
      node.stream.broadcaster
        ? {
          title: node.stream.broadcaster.broadcastSettings.title,
          previewImageURL: node.stream.previewImageURL
        }
        : {
          profileImageURL: node.profileImageURL
        }
      ))

      displayName[node.login] = node.displayName
    })

  this.commit('DisplayName/Update', displayName)

  return result
}

const mutations = {
  Empty (Follows) {
    Vue.set(Follows, 'ready', false)
    Vue.set(Follows, 'list', [])
    /*
    state.ready = false
    state.list = []
    */
  },
  Fetched (Follows) {
    Follows.fetching = false
  },
  Fetching (Follows) {
    Follows.fetching = true
  },
  Ready (Follows) {
    Vue.set(Follows, 'ready', true)
    // state.ready = true
  },
  SortAndReady (Follows) {
    Vue.set(Follows, 'list', SortAndReconstruct.call(this, state.list))
    Vue.set(Follows, 'ready', true)
    /*
    state.list = SortAndReconstruct.call(this, state.list)
    state.ready = true
    */
  },
  Update (Follows, edges) {
    Vue.set(Follows, 'list', state.list.concat(
      edges
        .map(({ node }) => node)
        .filter(node => node.login) // check user exist
    ))

    /*
    state.list = state.list.concat(
      edges
        .map(({ node }) => node)
        .filter(node => node.login) // check user exist
    )
    */
    edges.forEach(({ node }) =>
      warn('ID: %s', node.login))
  }
}

const actions = {
  Search ({ commit }, login) {
    if (state.fetching || !login) return
    commit('Fetching')

    // clear all previous items
    commit('Empty')

    let followsCount = 0
    const getAllFollows = (login, cursor) => {
      gql({
        // simulate twitch follow list behavior
        extensions: {},
        operationName: 'ChannelFollows',
        query,
        variables: {
          limit: cursor ? 7 : 15,
          login,
          cursor,
          order: 'DESC'
        }
      })
        .then(Response => Response.json())
        .then(({ data }) => {
          if (!data.user.follows) throw new Error('請檢查你的帳號名稱')

          const edges = data.user.follows.edges
          commit('Update', edges)

          followsCount += edges.length

          if (data.user.follows.pageInfo.hasNextPage) {
            getAllFollows(login, edges[edges.length - 1].cursor)
          } else {
            eventBus.emit('toast-success', `已擷取追蹤列表: ${followsCount}`)
            commit('SortAndReady')
            commit('Fetched')
          }
        })
        .then(() =>
          info(`[Store] fetch follow list ${followsCount}`))
        .catch((Reason) => {
          eventBus.emit('toast-error', `擷取追蹤列表時發生錯誤 (${Reason})`)
          warn(`[Store] fetch follow list error, ${followsCount} fetched. (${Reason})`)
          commit('Fetched')
        })
    }

    getAllFollows(login)
  }
}

const query = `
query ChannelFollows($login: String, $limit: Int, $cursor: Cursor, $order: SortOrder) {
  user(login: $login) {
    follows(first: $limit, after: $cursor, order: $order) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          displayName
          lastBroadcast {
            startedAt
          }
          login
          profileImageURL(width: 150)
          stream {
            broadcaster {
              broadcastSettings {
                title
              }
            }
            previewImageURL(width: 320, height: 180)
          }
        }
      }
    }
  }
}
`

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
