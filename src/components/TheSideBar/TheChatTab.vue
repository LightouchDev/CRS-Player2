<template>
  <v-tabs id="the-chat-page">
    <v-tabs-items v-model="View.currentChat">
      <v-tab-item
        v-for="channelName in View.enabledChat"
        :key="channelName"
        :id="channelName"
      >
        <Chat :channel="channelName"/>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<style lang="postcss">
#the-chat-page {
  & .tabs__bar {
    display: none;
  }
}
</style>

<script>
import { mapState } from 'vuex'
import Chat from './Chat'

export default {
  name: 'TheChatTab',
  components: {
    Chat
  },
  computed: {
    ...mapState([
      'View'
    ])
  }
}
</script>
