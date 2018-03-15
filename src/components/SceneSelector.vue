<template>
  <transition
    v-on:enter="enter"
  >
    <div class="scene-selector" @mousemove="mousemove($event)">
      <!-- Blind Top -->
      <div class="blinds top" ref="blindTop"></div>

      <!-- Scene 1 -->
      <div v-if="scene === 'scene01'" class="scene-selector-panel">
        <!-- Question -->
        <div class="scene-selector-question" ref="question">
          <h3 class="headline -gamma -divider" ref="questionSubheadline">get ready to decide</h3>
          <h2 class="headline -beta" ref="questionHeadline"><em>WHAT SHOULD MARiE DO NEXT?</em></h2>
        </div>

        <!-- Curtain -->
        <div class="scene-selector-curtain" ref="curtain">
          <svg class="shape" width="100%" height="100vh" preserveAspectRatio="none" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
            <path ref="shape" d="M -44,-50 C -52.71,28.52 15.86,8.186 184,14.69 383.3,22.39 462.5,12.58 638,14 835.5,15.6 987,6.4 1194,13.86 1661,30.68 1652,-36.74 1582,-140.1 1512,-243.5 15.88,-589.5 -44,-50 Z"></path>
          </svg>
        </div>

        <!-- Options -->
        <div class="scene-selector-options" ref="options">

          <!-- Option 1 -->
          <div class="scene-selector-option" @click="changeScene('scene02a', $event)" @mouseover="showCursor = true" @mouseout="showCursor = false">
            <!-- The Option -->
            <div class="option" ref="option1">
              <h2 class="headline -alpha"><em>OPEN THE DOOR</em></h2>
            </div>

            <!-- Selected Text -->
            <div class="selected-option" ref="scene02aSelected">
              <h3 class="headline -gamma">Get ready for Marie to</h3>
              <h2 class="headline -alpha -color-salmon" ref="scene02aSelectedHeadline"><em>OPEN THE DOOR</em></h2>
            </div>
          </div>

          <!-- Divider / Timer -->
          <div class="scene-selector-divider">
            <div class="border-block"></div>
            <div class="text-block">
              The decision is yours.
            </div>
            <vue-circle
              v-if="counterReady"
              ref="vueCircle"
              :progress="100"
              :size="125"
              :reverse="false"
              line-cap="butt"
              :fill="fill"
              empty-fill="rgba(78, 86, 106, 1)"
              :animation-start-value="0.0"
              :start-angle="-Math.PI/2"
              insert-mode="append"
              :thickness="4"
              :animation="{duration: COUNTDOWN_LENGTH * 1000, easing: 'linear'}"
              :show-percent="false"
              @vue-circle-progress="progress"
              @vue-circle-end="progress_end">
                OR
            </vue-circle>
            <div class="text-block">
              What will Marie do?
            </div>
            <div class="border-block"></div>
          </div>

          <!-- Option 2 -->
          <div class="scene-selector-option" @click="changeScene('scene02b', $event)" @mouseover="showCursor = true" @mouseout="showCursor = false">
            <!-- The Option -->
            <div class="option" ref="option2">
              <h2 class="headline -alpha"><em>ANSWER THE INTERCOM</em></h2>
            </div>

            <!-- Selected Text -->
            <div class="selected-option" ref="scene02bSelected">
              <h3 class="headline -gamma">Get ready for Marie to</h3>
              <h2 class="headline -alpha -color-salmon" ref="scene02bSelectedHeadline"><em>ANSWER THE INTERCOM</em></h2>
            </div>
          </div>

          <!-- Click Circle Transition -->
          <div class="click-circle" ref="clickCircle"></div>

          <!-- Cursor -->
          <div class="scene-cursor" ref="cursor">
            <div :class="['cursor-icon active', {'visible' : showCursor}]" :style="cursorPosition">
              <div class="cursor-text">Play</div>
              <img src="../assets/icon-play.svg" alt="Play Scene">
              <div class="cursor-text">Scene</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Blind Bottom -->
      <div class="blinds bottom" ref="blindBottom"></div>
    </div>
  </transition>
</template>

<script>
import { TimelineMax, TweenMax } from 'gsap'
import { Circ, Back } from 'gsap/EasePack'
import SplitText from '../vendor/SplitText'
import VueCircle from 'vue2-circle-progress'
import buzz from 'buzz'

export default {
  name: 'SceneSelector',
  components: {
    VueCircle
  },
  props: ['scene'],
  data () {
    return {
      selection: null,
      COUNTDOWN_LENGTH: 30,
      countdown: 30,
      counterReady: false,
      fill: { color: '#DA7D79' },
      muzak: null,
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
      },
      showCursor: false
    }
  },
  mounted () {
    // Mouse Tracker
    this.setMouseInterval()

    this.muzak = new buzz.sound('/static/audio/muzak', { // eslint-disable-line new-cap
      formats: ['m4a']
    })

    this.muzak.play().loop()
  },
  methods: {
    progress (event, progress, stepValue) {
      // console.log(stepValue)
      let { COUNTDOWN_LENGTH } = this
      this.countdown = COUNTDOWN_LENGTH - Math.round(COUNTDOWN_LENGTH * stepValue / 100)
    },
    progress_end (event) {
      // console.log('Circle progress end')
    },
    changeScene (option, event) {
      // Capture the user's scene selection
      this.selection = option

      // Fade out music
      this.muzak.fadeOut(500)

      // Click circle animation/transition
      let vm = this
      let selectedOption = vm.$refs[option + 'Selected']
      let selectedOptionHeadline = vm.$refs[option + 'SelectedHeadline']
      let tl = new TimelineMax({
        onComplete: vm.closeBlinds,
        ease: Circ.easeInOut
      })
      let circle = this.$refs.clickCircle
      let diameter = Math.max(window.innerWidth, window.innerHeight)
      let xPos = event.pageX - diameter / 2
      let yPos = event.pageY - diameter / 2
      tl.set(circle, {
        height: diameter + 'px',
        width: diameter + 'px',
        top: yPos + 'px',
        left: xPos + 'px'
      })
      tl.to(circle, 0.65, {
        transform: 'scale(2)'
      })
      tl.to(selectedOption, 1, {display: 'block', marginTop: '-20px', opacity: 1})
      let splitHeadline = new SplitText(selectedOptionHeadline, {type: 'words'})
      tl.add(
        TweenMax.staggerFrom(splitHeadline.words, 0.4, {
          y: 20,
          autoAlpha: 0,
          ease: Back.easeOut.config(2)
        }, 0.35), 1.75
      )
      tl.set({}, {}, '+=2')
    },

    closeBlinds () {
      let vm = this
      let {blindTop, blindBottom} = this.$refs
      let tl = new TimelineMax({
        onComplete: function () {
          vm.$emit('changeScene', vm.selection)
        },
        ease: Circ.easeInOut
      })
      tl.addLabel('closeBlinds', 0)
      tl.to(blindTop, 2, {height: '50%'}, 'closeBlinds')
      tl.to(blindBottom, 2, {height: '50%'}, 'closeBlinds')
    },

    enter (el, done) {
      let {curtain, shape, question, questionHeadline, option1, option2} = this.$refs
      let tl = new TimelineMax({
        onComplete: done
      })
      tl.to(question, 0.75, {marginTop: '-20px', opacity: 1})
      let splitQuestion = new SplitText(questionHeadline, {type: 'words'})
      tl.add(
        TweenMax.staggerFrom(splitQuestion.words, 0.4, {
          y: 20,
          autoAlpha: 0,
          ease: Back.easeOut.config(2)
        }, 0.35), 0.75
      )
      tl.to(question, 1, {opacity: 0, delay: 1.26})
      tl.addLabel('raiseCurtain', 5)
      tl.to(curtain, 2, {yPercent: -200}, 'raiseCurtain')
      tl.add(() => { this.counterReady = true }, 'raiseCurtain')
      tl.to(shape, 2, {attr: {d: 'M -44,-50 C -137.1,117.4 67.86,445.5 236,452 435.3,459.7 500.5,242.6 676,244 873.5,245.6 957,522.4 1154,594 1593,753.7 1793,226.3 1582,-126 1371,-478.3 219.8,-524.2 -44,-50 Z'}}, 'raiseCurtain')
      tl.from(option1, 1.25, {xPercent: -100, autoAlpha: 0, ease: Back.easeInOut.config(1), clearProps: 'all'}, 'raiseCurtain')
      tl.from(option2, 1.25, {xPercent: 100, autoAlpha: 0, ease: Back.easeInOut.config(1), clearProps: 'all'}, 'raiseCurtain+=0.5')
      tl.set(question, {display: 'none'}, 5)
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
  beforeDestroy: function () {
    // Fade out music
    this.muzak.fadeOut(500)
  }
}
</script>

<style lang="scss">
@import '../scss/base.scss';

.scene-selector {
  background: $black url('../assets/bg.png') no-repeat 50% 50%;
  background-size: cover;
  // background-color: $black;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.scene-selector-curtain {
  background-color: #000;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9;

  .shape {
    display: block;
    fill: #000;
    left: 0;
    position: absolute;
    top: 100%;
    width: 100%;
  }
}

.scene-selector-question {
  left: 50%;
  opacity: 0;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  text-align: center;
  max-width: rem(280px);
  z-index: 10;
}

.scene-selector-options {
  align-items: center;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  width: 100%;
  z-index: 8;

  .scene-selector-option {
    cursor: pointer;
    max-width: rem(640px);

    .option {
      text-shadow: 0 0 0 transparent;
      transition: text-shadow 0.3s ease-in-out, color 0.3s ease-in-out;
    }

    .selected-option {
      left: 50%;
      max-width: rem(640px);
      opacity: 0;
      pointer-events: none;
      position: absolute;
      transform: translate(-50%, -50%);
      top: 50%;
      z-index: 900;
    }

    &:hover {
      .option {
        text-shadow: 0px 5px 5px darken($black, 3%);
        color: $salmon;
      }
    }
  }
}

.scene-selector-divider {
  align-items: center;
  display: flex;
  font-family: $base-font-family;
  justify-content: center;
  margin: 2em 0;
  width: 100%;

  .border-block {
    border-top: 1px dashed #DA7D79;
    flex-grow: 1;
    height: 1px;
  }

  .text-block {
    padding: 0 2em;
  }

  .circle-percent-text-body {
    color: $white;
    font-family: $base-font-family;
    font-size: rem(14px);
    font-weight: 900;
    letter-spacing: 2px;
  }
}

.click-circle {
  display: block;
  position: absolute;
  background: #cb4d61;
  border-radius: 50%;
  overflow: hidden;
  transform: scale(0);
}

.blinds {
  background-color: #000;
  display: block;
  left: 0;
  height: 0%;
  right: 0;
  position: fixed;
  z-index: 998;

  &.top {
    top: 0;
  }

  &.bottom {
    bottom: 0;
  }
}

.scene-cursor {
  pointer-events: none;

  .cursor-icon {
    align-items: center;
    background-color: rgba(darken($black, 5%), 0.8);
    backface-visibility: hidden;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    height: 120px;
    justify-content: center;
    opacity: 0;
    left: -60px;
    position: fixed;
    text-align: center;
    top: -60px;
    transition: opacity 0.2s ease-in-out;
    width: 120px;
    z-index: 999;

    &.visible {
      opacity: 1;
    }

    .cursor-text {
      font-family: $base-font-family;
      font-size: rem(12px);
      font-weight: 700;
      margin: 0.5em 0;
      text-transform: uppercase;
    }
  }
}
</style>
