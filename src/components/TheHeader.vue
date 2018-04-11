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
    <v-toolbar-items v-if="preset.mainChannel">
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
            v-for="(item, index) in menu"
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
          <v-list-tile
            v-show="preset.fb_widget"
            @click="facebookWidget = true"
          >
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="tile-icon"
              size="lg"
              fixed-width
            />
            臉書專頁
          </v-list-tile>
          <v-list-tile
            v-show="preset.placeholder"
            @click="$store.commit('View/Update', { currentView: 'placeholder' })"
          >
            <v-icon class="tile-icon">help</v-icon>
            使用說明
          </v-list-tile>
          <v-list-tile @click="$store.dispatch('View/FetchInfo')">
            <v-icon class="tile-icon">refresh</v-icon>
            重新擷取頻道資訊
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <v-btn
      icon
      @click="$store.commit('View/ToggleSidebar')"
    >
      <v-icon>{{ sidebarToggleIcon }}</v-icon>
    </v-btn>
    <!-- facebook page plugin -->
    <v-dialog
      v-model="facebookWidget"
      max-width="500px"
    >
      <iframe
        id="facebook-widget"
        :src="preset.fb_widget"
        class="elevation-8"
        height="100%"
        width="100%"
        frameborder="0"
        framespacing="0"
      />
    </v-dialog>
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
#facebook-widget {
  height: 720px;
  overflow: hidden;
}
</style>

<script>
import { mapState } from 'vuex'
import getProp from 'lodash.get'
import { eventBus, info, warn, preset } from '@/utils'

export default {
  name: 'TheHeader',
  data () {
    return {
      menu: [],
      facebookWidget: false
    }
  },
  computed: {
    ...mapState([
      'DisplayName', // fetch $Store.State.DisplayName into this.DisplayName
      'View' // fetch $Store.State.View into this.View
    ]),
    sidebarToggleIcon () {
      return this.View.sidebar
        ? 'chevron_right'
        : 'chevron_left'
    }
  },
  created () {
    this.preset = preset
    eventBus.on('parse-menu', this.parseMenu)
  },
  methods: {
    changeView (index) {
      const item = this.menu[index]
      if (item.channel) {
        this.$store.dispatch('View/Update', {
          currentChannel: item.channel,
          currentPlatform: item.platform,
          currentView: 'player'
        })
      }
      if (item.href) {
        window.open(item.href, '_blank')
      }
    },
    parseMenu () {
      info('[MENU] start parse! %o', preset.menu)
      this.menu = []
      preset.menu.forEach((item, index) => {
        let promiseArray = []
        // clone self to prevent modify original preset
        item = Object.assign({}, item)
        // parse each prop of the menu item
        Object.keys(item).forEach(key => {
          const property = item[key]
          if (typeof property === 'object' && property.source) {
            promiseArray.push(
              fetch(property.source)
                .then(Response => Response.json())
                .then(Result => {
                  if (property.template) {
                    item[key] = property.template.replace('%s', getProp(Result, property.path))
                  } else {
                    item[key] = Result
                  }
                })
            )
          }
        })
        // show toast or log if there's async fetch jobs
        if (promiseArray.length) {
          Promise.all(promiseArray)
            .then(() => {
              if (item.toast && item.toast.success) {
                eventBus.emit('toast-success', item.toast.success)
              }
              info(`[MENU] Job ${index}: ${item.type} job done`)
            })
            .catch(Reason => {
              if (item.toast && item.toast.error) {
                eventBus.emit('toast-error', `${item.toast.error} (${Reason})`)
              }
              warn(`[MENU] Job ${index}: '${item.type}' error (${Reason})`)

              // remove current item from menu
              this.menu = this.menu.filter(menuItem => menuItem !== item)
            })
        }
        // set default platform
        if (item.type !== 'link' && !item.platform) {
          item.platform = 'twitch'
        }
        // set default label/channel
        if (item.type === 'mainChannel') {
          item.label = item.label || this.DisplayName[preset.mainChannel] || preset.mainChannel
          item.channel = item.channel || preset.mainChannel
        }
        if (item.type === 'host') {
          // do not set host if not hosting
          if (!this.View.host) return
          item.label = item.label || `轉播：${this.DisplayName[this.View.host] || this.View.host}`
          item.channel = item.channel || this.View.host
        }
        this.menu.push(item)
      })
    }
  }
}
</script>
