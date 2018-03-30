<template>
  <v-navigation-drawer
    id="the-side-bar"
    app
    right
    width="340"
    disable-resize-watcher
  >
    <v-tabs
      id="side-bar-tabs"
      v-model="currentTab"
      color="teal"
    >
      <v-tab
        id="label-chat"
        href="#tab-chat"
      >
        <font-awesome-icon
          :icon="['fab', 'twitch']"
          fixed-width
          size="lg"
        />
        {{ getDisplayName(currentChat) }}
        <v-spacer/>
        <v-menu
          id="channel-drop-down"
          dark
          left
          offset-y
        >
          <a
            slot="activator"
            class="tabs__div"
          >
            <v-icon>arrow_drop_down</v-icon>
          </a>
          <v-list
            id="channel-list"
            dense
          >
            <v-list-tile
              v-for="channel in channelList"
              :key="channel"
              :href="`#chat-${channel}`"
            >
              {{ getDisplayName(channel) }}
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-tab>
      <v-tab href="#tab-setting">視窗設定</v-tab>
      <v-tab href="#tab-follow">已追隨</v-tab>
      <v-tabs-items v-model="currentTab">
        <v-tab-item id="tab-chat"><TheChatHub :channel="currentChat"/></v-tab-item>
        <v-tab-item id="tab-setting">Setting</v-tab-item>
        <v-tab-item id="tab-follow">Follow</v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-navigation-drawer>
</template>

<style lang="postcss">
#the-side-bar {
  padding: 0;
  overflow: hidden;
}
#side-bar-tabs {
  height: 100%;
  & .tabs__container {
    max-width: 340px; /* prevent tab bar overflow */
  }

  /* don't break all tab label*/
  & .tabs__div {
    word-break: keep-all;
  }

  /* hack for chat height */
  & .tabs__items {
    height: calc(100% - 48px);
  }
  & .tabs__items div {
    height: 100%
  }

  & #label-chat {
    width: 100%;
    /* break if channel name is too long */
    word-break: break-word;
    /* hacks for drop down menu style*/
    & > .tabs__item {
      padding-right: 0;
      padding-top: 2px;
      padding-bottom: 2px;
    }
    & div {
      height: 100%;
    }
    & #channel-drop-down {
      border-left-style: solid;
      border-left-width: 1px;
      margin-left: 12px;
    }
  }
}
#channel-list {
  margin-top: 2px;
}
</style>

<script>
import { mapState } from 'vuex'
import TheChatHub from './TheSideBar/TheChatHub'

export default {
  name: 'TheSideBar',
  components: {
    TheChatHub
  },
  data () {
    return {
      currentTab: null,
      currentChat: null
    }
  },
  computed: {
    ...mapState([
      'View',
      'Config',
      'DisplayName'
    ]),
    channelList () {
      return [this.Config.mainChannel, ...this.View.activeFloatPlayer]
    }
  },
  created () {
    this.currentChat = this.Config.mainChannel
  },
  methods: {
    getDisplayName (channel) {
      return this.DisplayName[channel] || channel
    }
  }
}
</script>
