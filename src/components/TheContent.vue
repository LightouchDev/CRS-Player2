<template>
  <v-content>
    <v-container
      id="container"
      fluid
    >
      <Player
        v-show="isShow('player')"
        id="main-player"
        :channel="View.currentChannel"
        :platform="View.currentPlatform"
      />
      <div v-show="isShow('placeholder')">
        <img
          id="placeholder"
          :src="preset.placeholder"
        >
      </div>
    </v-container>
  </v-content>
</template>

<style lang="postcss">
#container, #container div {
  width: 100%;
  height: 100%;
}
#container {
  padding: 0;
}
#placeholder {
  display: block;
  width: 100%;
  height: auto;
}
</style>

<script>
import { mapState } from 'vuex'
import Player from './Player'
import { preset } from '@/utils'

export default {
  name: 'TheContent',
  components: {
    Player
  },
  computed: {
    ...mapState([
      'View' // fetch $Store.State.View into this.View
    ])
  },
  created () {
    this.preset = preset
  },
  methods: {
    isShow (type) {
      return this.View.currentView === type
    }
  }
}
</script>
