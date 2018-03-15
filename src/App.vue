<template>
  <div id="app">
    <header class="site-header">
      <a href="/" title="BEGiN AGAIN"><img src="./assets/logo-small.svg" class="logo" alt="Marie Begins - An Operactive"></a>
    </header>
    <stage>
      <!-- Video Player -->
      <video-player
        v-if="video"
        ref="player"
        :scene="scene"
        @player-ended="playerEnded"
        @player-almost-ended="playerAlmostEnded"
      />
      <!-- Scene Selection -->
      <scene-selector
        v-if="selector"
        :scene="scene"
        @changeScene="changeScene" />
      <!-- Credits -->
      <thank-you
        v-if="thanks" />
    </stage>
    <footer class="site-footer">
      <nav>
        <ul>
          <li class="share"><em class="title">SHARE</em> <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A//www.facebook.com/mariebegins" title="Share on Facebook">FACEBOOK</a> | <a href="https://twitter.com/home?status=Experience%20Opera%20Like%20Never%20Before.%20Become%20the%20director%20in%20%40mariebegins" title="Share on Twitter">TWITTER</a></li>
          <li><a href="https://www.mariebegins.com/feedback" title="Feedback">FEEDBACK</a></li>
          <li><a href="#" title="Credits" @click="changeScene('credits')">CREDITS</a></li>
          <li><a href="#" title="Begin Again" @click="changeScene('scene01')">BEGiN AGAIN</a></li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<script>
import Stage from '@/components/Stage'
import VideoPlayer from './components/VideoPlayer'
import SceneSelector from './components/SceneSelector'
import ThankYou from './components/ThankYou'

const SCENES = {
  scene01: {
    // Set stage
    video: true,
    selector: false,
    thanks: false,
    // Post Scene
    postScene: 'selector'
  },
  scene02a: {
    // Set stage
    video: true,
    selector: false,
    thanks: false,
    // Post Scene
    postScene: 'thanks'
  },
  scene02b: {
    // Set stage
    video: true,
    selector: false,
    thanks: false,
    // Post Scene
    postScene: 'thanks'
  },
  credits: {
    // Set stage
    video: true,
    selector: false,
    thanks: false,
    // Post Scene
    postScene: null
  }
}

export default {
  name: 'App',
  components: {
    Stage,
    VideoPlayer,
    SceneSelector,
    ThankYou
  },
  data () {
    return {
      // Initial scene
      scene: 'scene01',
      // Set stage
      video: true,
      selector: false,
      thanks: false,
      // Post scene
      postScene: 'selector'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.changeScene('scene01')
    })

    // fast-forward to near end of video when typing ff
    let nums = [70, 70] // ff
    let n = nums.slice()
    window.addEventListener('keyup', e => {
      if (e.which === n[0]) {
        n.shift()
      } else {
        n = nums.slice()
      }
      if (n.length === 0) {
        this.$refs['player'].fastForward()
        n = nums.slice()
      }
    })
  },
  methods: {
    changeScene (scene) {
      // console.log('Changing scene to: ' + scene)
      let sceneData = SCENES[`${scene}`]
      for (let key in sceneData) {
        this[key] = sceneData[key]
      }
      this['scene'] = scene
    },
    playerEnded () {
      // Do we show the selector?
      if (this.postScene === 'selector') {
        this.video = false
        this.selector = true
        this.thanks = false
      }
      // Do we show thanks?
      if (this.postScene === 'thanks') {
        this.video = false
        this.selector = false
        this.thanks = true
      }
    },
    playerAlmostEnded () {
      // console.log('Video is almost over...')
    }
  }
}
</script>

<style lang="scss">
@import './scss/app.scss';

html, body {
  background-color: #000;
  font-size: $base-font-size;
  margin: 0;
  height: 100%;
}

#app {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: $white;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.site-header,
.site-footer {
  background-color: #000;
  flex: none;
  height: rem(90px);
  position: relative;
  z-index: 1000;
}

.site-header {
  // background: #0E1218 url('./assets/logo-small.svg') no-repeat 2em -18px;
  animation: 1s ease-in-out 0s 1 slideDown;
  overflow: hidden;

  .logo {
    margin: -18px 2em 2em;
  }
}

.site-footer {
  color: $white;
  animation: 1s ease-in-out 0s 1 slideUp;

  nav {
    ul {
      align-items: center;
      display: flex;
      list-style: none;
      justify-content: center;
      margin: 0;
      padding: 1em;

      li {
        font-family: $base-font-family;
        font-size: rem(13px);
        font-weight: 700;
        letter-spacing: 2px;
        margin: 0;
        padding: 0.5em 1em;

        a {
          color: $white;
          text-decoration: none;
          transition: all 0.2s ease-in-out;

          &:hover {
            color: $salmon;
          }
        }

        &.share {
          .title {
            color: #6F6F6F;
          }

          a, .title {
            // padding: 0 1em;
          }
        }
      }
    }
  }
}

@keyframes slideDown {
  from { transform: translateY(-100%)}
  to   { transform: translateY(0%)}
}

@keyframes slideUp {
  from { transform: translateY(100%)}
  to   { transform: translateY(0%)}
}
</style>
