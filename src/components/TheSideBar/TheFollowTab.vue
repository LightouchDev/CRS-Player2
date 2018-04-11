<template>
  <v-layout
    id="the-follow-tab"
    row
  >
    <v-flex xs12>
      <v-toolbar>
        <div id="search-bar">
          <v-text-field
            v-model="loginName"
            :append-icon-cb="search"
            label="輸入帳號以載入追隨名單"
            append-icon="refresh"
            hide-details
            flat
            @keyup.enter="search"
          />
        </div>
      </v-toolbar>
      <v-list
        v-show="Follows.ready"
        two-line
      >
        <!-- FIXME: lazy lister -->
        <v-list-tile
          v-for="channel in Follows.list"
          :key="channel.login"
          :class="listItemColor(channel.login)"
          @click="openPlayer(channel.login)"
        >
          <template v-if="channel.previewImageURL">
            <v-list-tile-avatar
              class="preview-image"
              size="60"
              tile
            >
              <img :src="channel.previewImageURL">
              <div id="indicator"><span style="color: red">⬤</span> LIVE</div>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="channel.title"/>
              <v-list-tile-sub-title v-text="getDisplayName(channel.login)"/>
            </v-list-tile-content>
          </template>
          <template v-else>
            <v-list-tile-avatar size="50">
              <img :src="channel.profileImageURL">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="getDisplayName(channel.login)"/>
            </v-list-tile-content>
          </template>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<style lang="postcss">
#the-follow-tab {
  min-height: 0;
  & #search-bar {
    width: 100%;
    padding: 0 8px;
  }
  & #indicator {
    bottom: 0;
    line-height: normal;
    position: absolute;
    right: 2px;
    text-shadow:
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px  1px 0 #000,
       1px  1px 0 #000;
  }
  & .list__tile__avatar {
    margin-top: 0;
    margin-right: 16px;
    min-width: unset;
  }
  & .preview-image {
    & .avatar {
      width: auto !important;
    }
  }
}
</style>

<script>
import { mapState } from 'vuex'
import { eventBus, preset } from '@/utils'

export default {
  name: 'TheFollowTab',
  data () {
    return {
      loginName: ''
    }
  },
  computed: {
    ...mapState([
      'DisplayName',
      'Follows',
      'Player'
    ])
  },
  methods: {
    getDisplayName (channel) {
      return this.DisplayName[channel] !== channel
        ? `${this.DisplayName[channel]} (${channel})`
        : channel
    },
    listItemColor (channel) {
      if (channel === preset.mainChannel) return 'info'
      if (this.Player.booted.some(obj => obj.login === channel)) return 'success'
    },
    openPlayer (channel) {
      // FIXME: split order, and clinet info array
      if (this.Player.booted.some(obj => obj.login === channel)) {
        this.$store.commit('Player/Remove', channel)
      } else {
        this.$store.commit(
          'Player/Add',
          ...this.Follows.list.filter(obj => obj.login === channel)
        )
      }
    },
    search () {
      if (this.loginName) {
        eventBus.emit('toast-open', { text: '正在擷取追蹤列表……' })
        this.$store.dispatch('Follows/Search', this.loginName)
      } else {
        eventBus.emit('toast-error', '請輸入帳號。')
      }
    }
  }
}
</script>
