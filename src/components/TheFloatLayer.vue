<template>
  <div id="the-float-layer">
    <VueDraggableResizable
      v-for="({ login }, index) in Player.booted"
      v-if="Player.active[login]"
      :key="login"
      :active="active[login]"
      :minh="180"
      :minw="320"
      :draggable="draggable[login]"
      :resizable="true"
      :w="320"
      :h="180"
      :z="index * 10"
      :style="[opacity(login)]"
      drag-handle=".drag-handler"
      @deactivated="drag(login, false)"
    >
      <div
        class="drag-wrapper"
        @click="drag(login, true)"
      />
      <Player
        :channel="login"
        class="float-player"
      />
      <div
        v-show="draggable[login]"
        class="drag-handler"
      />
    </VueDraggableResizable>
  </div>
</template>

<style lang="postcss">
#the-float-layer {
  z-index: 999;
  & .float-player, & .drag-handler, & .drag-wrapper {
    height: 100%;
    width: 100%;
    position: absolute;
  }
  & .drag-wrapper {
    left: -5px;
    top: -5px;
    border: 5px solid rgba(180,180,180,0.55);
    border-radius: 5px;
    box-sizing: content-box;
  }
}
</style>

<script>
import { mapState } from 'vuex'
import VueDraggableResizable from 'vue-draggable-resizable'
import Player from './Player'

export default {
  name: 'TheFloatLayer',
  components: {
    Player,
    VueDraggableResizable
  },
  data () {
    return {
      active: {},
      draggable: {}
    }
  },
  computed: {
    ...mapState([
      'Player'
    ])
  },
  methods: {
    drag (login, bool) {
      this.$set(this.active, login, bool)
      this.$set(this.draggable, login, bool)
    },
    opacity (login) {
      return { opacity: this.Player.opacity[login] }
    }
  }
}
</script>
