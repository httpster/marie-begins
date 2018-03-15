<template>
  <div class="stage">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Stage'
}
</script>

<style lang="scss">
.stage {
  flex: 1;
}
</style>
