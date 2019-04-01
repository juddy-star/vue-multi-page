<template>
  <div class="splitLine" :style="splitLineStyle">
    <div class="triangle" :style="triangleStyle"></div>
    <img src="./monkeyImg.jpeg" alt="" />
  </div>
</template>
<script>

export default {
  props: {
    styles: {
      type: Object,
      default() {
        return {
          color: 'rgb(21, 0, 0)',
          borderColor: '#554037',
        };
      },
    },
  },
  data() {
    return {
      monkeyImg: ''
    };
  },
  mounted() {
    fetch('bbb/ssss');
  },
  computed: {
    splitLineStyle() {
      return { backgroundColor: this.styles.borderColor };
    },
    triangleStyle() {
      return { backgroundColor: this.styles.color, borderColor: this.styles.borderColor };
    },
  },
};
</script>

<style lang="less" scoped>
.splitLine {
  position: relative;
  align-self: stretch;
  height: 1px;
  background-color: #554037;
  .triangle {
    position: absolute;
    left: 50%;
    margin: -7px 0 0 -7px;
    height: 14px;
    width: 14px;
    border: 1px solid #554037;
    background-color: rgb(21, 0, 0);
    transform: rotate(45deg);
    border-top: none;
    border-left: none;
  }
}
</style>
