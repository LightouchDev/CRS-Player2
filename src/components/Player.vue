<template>
  <div
    v-if="channel"
    :id="channel"
  >
    <iframe
      :src="src"
      height="100%"
      width="100%"
      class="player-frame"
      frameborder="0"
      framespacing="0"
    />
  </div>
</template>

<style lang="postcss">
</style>

<script>
export default {
  name: 'Player',
  props: {
    channel: {
      default: '',
      type: String
    },
    platform: {
      default: 'twitch',
      type: String
    }
  },
  computed: {
    src () {
      return this.platform === 'twitch'
        ? `//player.twitch.tv/?channel=${this.channel}`
        : this.channel
    }
  }
}
</script>
