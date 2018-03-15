<template>
  <div :class="['video-player', {'-paused' : !isPlaying, '-playing' : isPlaying}]" @mousemove="mousemove($event)">
    <video-player
      class="video-player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @ready="playerReadied"
      @click.native="handlePause">
    </video-player>
    <!-- Cursor -->
    <div class="video-cursor" ref="cursor" v-if="ready">
      <div class="cursor-icon active visible" :style="cursorPosition">
        <div class="cursor-icon-status">
          <img src="../assets/icon-pause.svg" alt="Pause" v-if="isPlaying">
          <img src="../assets/icon-play.svg" alt="Play" v-if="!isPlaying">
        </div>
        <div class="cursor-icon-wrapper">
          <div class="cursor-icon-circle background">
            <svg class="circle" viewBox="0 0 58 58"><circle class="st0" cx="29" cy="29" r="28"></circle></svg>
          </div>
          <div class="cursor-icon-circle progress">
            <svg class="logo-circle" viewBox="0 0 58 58" :style="{strokeDashoffset: (177 / duration) * remaining }"><circle class="st0" cx="29" cy="29" r="28"></circle></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'

export default {
  name: 'Video',
  props: ['scene'],
  data () {
    return {
      // Video player
      ready: false,
      duration: 177,
      remaining: 177,
      isPlaying: false,
      // Intervals
      mouseInterval: null,
      // Mouse tracking
      mouseX: 0,
      mouseY: 0,
      cursorX: 0,
      cursorY: 0,
      followSpeed: 5,
      cursorPosition: {
        transform: 'translate(0px, 0px)'
      }
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    playerOptions () {
      return {
        controls: false,
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: this.videoSrc
        }]
      }
    },
    videoSrc () {
      return `/static/video/${this.scene}.mp4`
    }
  },
  components: {
    videoPlayer
  },
  methods: {
    fastForward () {
      if (this.isPlaying) {
        let duration = this.player.duration()
        this.player.currentTime(duration - 2)
      }
    },
    onPlayerPlay (player) {
      // console.log('player play!', player)
      this.isPlaying = true
    },
    onPlayerPause (player) {
      // console.log('player pause!', player)
      this.isPlaying = false
    },
    onPlayerEnded (player) {
      // console.log('player ended!', player)
      this.$emit('player-ended')
      this.isPlaying = false
    },
    onPlayerWaiting (player) {
      // console.log('player Waiting!', player)
      this.isPlaying = false
    },
    onPlayerPlaying (player) {
      // console.log('player Playing!', player)
      this.isPlaying = true
      this.duration = player.duration()
    },
    onPlayerTimeupdate (player) {
      // console.log('player Timeupdate!', player.currentTime())
      this.remaining = player.remainingTime()
    },
    playerReadied (player) {
      // console.log('player readied', player)
      this.ready = true
      player.play()
    },
    handlePause () {
      // console.log('player pausing')
      if (this.player.paused()) {
        this.player.play()
      } else {
        this.player.pause()
      }
    },
    // Intervals
    setMouseInterval () {
      this.mouseInterval = setInterval(this.mouseTracker, 30)
    },
    clearMouseInterval () {
      clearInterval(this.mouseInterval)
    },
    // Mouse tracking
    mousemove (e) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    },
    mouseTracker () {
      this.cursorX += ((this.mouseX - this.cursorX) / this.followSpeed)
      this.cursorY += ((this.mouseY - this.cursorY) / this.followSpeed)
      this.cursorPosition = {
        transform: 'translate(' + this.cursorX + 'px, ' + this.cursorY + 'px)'
      }
    }
  },
  mounted () {
    // console.log('Current player instance object', this.player)
    // Mouse Tracker
    this.setMouseInterval()
  }
}
</script>

<style lang="scss">
@import '../../node_modules/video.js/dist/video-js.css';

.video-player {
  height: 100%;
  position: relative;
}

.vjs-fluid {
  padding-top: 0 !important;
}

.video-js {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
}

.video-cursor {
  pointer-events: none;

  .cursor-icon {
    backface-visibility: hidden;
    height: 40px;
    left: -20px;
    position: fixed;
    text-align: center;
    top: -20px;
    width: 40px;
    z-index: 999;

    .cursor-icon-status {
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .cursor-icon-circle {
      height: 100%;
      left: 0;
      overflow: visible;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 2;

      &.background {
        opacity: 1;

        svg {
          stroke: #2c3e50;
          transition: stroke-dashoffset .8s ease-in-out;
        }
      }

      &.progress {
        z-index: 3;

        svg {
          stroke-width: 4px;
          stroke: #FFF;
          transform: rotate(-90deg);
          transition: stroke-dashoffset .3s ease-out 0s;
        }
      }
    }

    svg {
      fill: transparent;
      left: 0;
      overflow: visible;
      position: absolute;
      stroke-dasharray: 177;
      stroke-dashoffset: 177;
      stroke-width: 3px;
      top: 0;
    }

    .cursor-icon-wrapper {
      display: block;
      opacity: 0;
    }

    &.active {
      .cursor-icon-circle {
        svg {
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 1s linear;
        }
      }
    }

    &.visible {
      .cursor-icon-wrapper {
        opacity: 1;
      }
    }
  }
}
</style>
