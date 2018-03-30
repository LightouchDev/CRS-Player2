<template>
  <v-toolbar
    id="the-header"
    app
  >
    <font-awesome-icon
      :icon="['fab', View.currentPlatform]"
      fixed-width
      size="2x"
    />
    <v-toolbar-title>{{ View.title }}</v-toolbar-title>
    <v-spacer/>
    <v-toolbar-items>
      <v-menu
        bottom
        left
        offset-y
      >
        <v-btn
          slot="activator"
          color="teal"
        >主選單</v-btn>

        <v-list dense>
          <v-list-tile
            v-for="(item, index) in Config.channelMenu"
            :key="index"
            @click="changeView(index)"
          >
            <font-awesome-icon
              v-if="item.platform"
              :icon="['fab', item.platform]"
              class="tile-icon"
              size="lg"
              fixed-width
            />
            <v-icon
              v-else-if="item.type"
              class="tile-icon"
            >{{ item.type }}</v-icon>
            <v-list-tile-title>{{ item.label }}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-show="Config.fb_widget">
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="tile-icon"
              size="lg"
              fixed-width
            />
            臉書專頁
          </v-list-tile>
          <v-list-tile @click="$store.dispatch('View/FetchInfo')">
            <v-icon class="tile-icon">refresh</v-icon>
            重新擷取頻道資訊
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<style lang="postcss">
#the-header {
  & .icon-button {
    min-width: 0;
    width: 56px;
  }
}
.tile-icon {
  margin-right: 8px;
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TheHeader',
  computed: {
    ...mapState([
      'View', // fetch $Store.State.View into this.View
      'Config' // fetch $Store.State.Config into this.Config
    ])
  },
  methods: {
    changeView (index) {
      const item = this.Config.channelMenu[index]
      if (item.type === 'channel') {
        this.$store.dispatch('View/Update', {
          currentChannel: item.channel,
          currntPlatform: item.platform,
          currentView: 'player'
        })
      }
      if (item.type === 'link') {
        window.open(item.url, '_blank')
      }
    },
    getMenuIcon (item) {
      return item.platform || item.type
    }
  }
}
</script>
