<template>
  <div
    v-if="channel"
    :id="channel"
    :style="style"
  >
    <iframe
      :src="src"
      height="100%"
      width="100%"
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
    },
    opacity: {
      default: 100,
      type: Number
    },
    'z_index': {
      default: 1,
      type: Number
    }
  },
  computed: {
    style () {
      return {
        opacity: this.opacity,
        'z-index': this.z_index
      }
    },
    src () {
      return this.platform === 'twitch'
        ? 'https://player.twitch.tv/?channel=' + this.channel
        : ''
    }
  }
}
</script>

