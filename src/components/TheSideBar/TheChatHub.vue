<template>
  <v-tabs-items v-model="currentChat">
    <v-tab-item
      v-for="channelName in activeChat(channel)"
      :key="channelName"
      :id="`chat-${channelName}`"
    >
      <Chat :channel="channelName"/>
    </v-tab-item>
  </v-tabs-items>
</template>

<script>
import Chat from './Chat'

export default {
  name: 'ChatHub',
  components: {
    Chat
  },
  props: {
    channel: {
      default: '',
      type: String,
      required: true
    }
  },
  data () {
    return {
      currentChat: null,
      enabledChat: []
    }
  },
  methods: {
    activeChat (channel) {
      if (channel && !this.enabledChat.includes(channel)) {
        this.enabledChat.push(channel)
      }
      this.currentChat = `chat-${channel}`
      return this.enabledChat
    }
  }
}
</script>
