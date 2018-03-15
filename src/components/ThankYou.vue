<template>
  <transition
    v-on:enter="enter"
  >
    <div class="thank-you">
      <div class="logo" ref="logo">
        <img src="../assets/logo.svg" alt="Marie Begins">
      </div>
      <div class="content">
        <h1 class="headline -beta" ref="headline">Thanks for testing the<br>MARiE BEGiNS operactive pilot!</h1>
        <div class="body" ref="body">
          <div class="column">
            <p>We're just getting started on our journey to bring the operactive concept into the world and would love your feedback and continued support.</p>
          </div>
          <div class="column">
            <p>Please use the links below to let us know what you thought, what you'd like to see in a future iteration, how you'd like to be involved with our development, and to share the operactive experiences with your artistic communities!</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { TimelineMax, TweenMax } from 'gsap'
import { Back } from 'gsap/EasePack'
import SplitText from '../vendor/SplitText'

export default {
  name: 'ThankYou',
  methods: {
    enter (el, done) {
      let {logo, headline, body} = this.$refs
      let tl = new TimelineMax({
        onComplete: done
      })
      tl.from(logo, 0.75, {y: 10, autoAlpha: 0})
      let splitHeadline = new SplitText(headline, {type: 'words'})
      tl.add(
        TweenMax.staggerFrom(splitHeadline.words, 0.4, {
          y: 20,
          autoAlpha: 0,
          ease: Back.easeOut.config(2)
        }, 0.25), 0.75
      )
      tl.from(body, 0.75, {y: 10, autoAlpha: 0})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/base.scss';

.thank-you {
  background: $black url('../assets/bg.png') no-repeat 50% 50%;
  background-size: cover;
  display: flex;
  flex-direction: column;
  min-height: 100%;

  .logo {
    padding: 2em 2em 0.5em 2em;
  }

  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 0 auto;
    max-width: rem(860px);
    justify-content: center;
    text-align: center;

    .headline {
      margin-bottom: 0.5em;
    }

    .body {
      display: flex;
      font-size: rem(20px);
      text-align: left;

      .column {
        padding: 1em;
        width: 50%;
      }
    }
  }
}
</style>
