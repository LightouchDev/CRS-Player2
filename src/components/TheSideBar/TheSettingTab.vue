<template>
  <v-layout
    id="the-setting-tab"
    row
  >
    <v-flex xs12>
      <v-toolbar>
        <div id="open-bar">
          <v-text-field
            v-model="loginName"
            :append-icon-cb="openPlayer"
            label="輸入頻道以新開浮動實況"
            append-icon="send"
            hide-details
            flat
            @keyup.enter="openPlayer"
          />
        </div>
      </v-toolbar>
      <draggable
        v-model="orderList"
        :options="{ handle: '.drag-handle' }"
        element="v-list"
        two-line
      >
        <div
          v-for="channel in orderList"
          :key="channel"
        >
          <v-list-tile>
            <v-list-tile-action class="drag-handle">
              <v-icon>drag_handle</v-icon>
            </v-list-tile-action>
            <template v-if="Player.bootedChannel[channel].previewImageURL">
              <v-list-tile-avatar
                class="preview-image"
                size="60"
                tile
              >
                <img :src="Player.bootedChannel[channel].previewImageURL">
              </v-list-tile-avatar>
            </template>
            <template v-else>
              <v-list-tile-avatar size="50">
                <img :src="Player.bootedChannel[channel].profileImageURL">
              </v-list-tile-avatar>
            </template>
            <v-list-tile-content>
              <v-list-tile-title v-text="getDisplayName(channel)"/>
              <v-layout class="setting-controll">
                <v-btn
                  :class="getButtonColor(channel)"
                  flat
                  icon
                  small
                  @click="toggleVisibility(Player.bootedChannel[channel])"
                >
                  <v-icon>{{ getButtonIcon(Player.bootedChannel[channel]) }}</v-icon>
                </v-btn>
                <v-slider
                  :value="Player.opacity[channel]"
                  class="slider-controll"
                  hide-details
                  max="1"
                  min="0"
                  step="0.01"
                  @input="updateOpacity(channel, $event)"
                />
              </v-layout>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider/>
        </div>
      </draggable>
    </v-flex>
  </v-layout>
</template>

<style lang="postcss">
#the-setting-tab {
  min-height: 0;
  & #open-bar {
    width: 100%;
    padding: 0 8px;
  }
  & .list__tile__title {
    overflow: hidden;
  }
  & .list__tile__action {
    padding-right: 16px;
    min-width: unset;
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
  & .setting-controll {
    align-items: center;
    width:100%;
  }
  & .slider-controll {
    padding: 0;
    margin: auto 10px;
  }
}
</style>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  name: 'TheSettingTab',
  components: {
    draggable
  },
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
    ]),
    orderList: {
      get () {
        return this.Player.order
      },
      set (value) {
        this.$store.commit('Player/UpdateOrder', value.filter(value => value))
      }
    }
  },
  methods: {
    getButtonColor (channel) {
      return this.Player.active[channel]
        ? 'error'
        : 'success'
    },
    getButtonIcon ({ dedicated, login }) {
      return this.Player.active[login]
        ? dedicated
          ? 'close'
          : 'videocam_off'
        : 'videocam'
    },
    getDisplayName (channel) {
      return this.DisplayName[channel] !== channel
        ? `${this.DisplayName[channel]} (${channel})`
        : channel
    },
    openPlayer () {
      if (this.Player.bootedChannel[this.loginName]) {
        this.loginName = ''
        return
      }

      this.$store.dispatch('Player/FetchAndAdd', this.loginName)
      this.loginName = ''
    },
    toggleVisibility ({ dedicated, login }) {
      dedicated
        ? this.$store.commit('Player/Remove', login)
        : this.$store.commit('Player/ToggleVisibility', login)
    },
    updateOpacity (channel, opacity) {
      this.$store.commit('Player/EditOpacity', { channel, opacity })
    }
  }
}
</script>
