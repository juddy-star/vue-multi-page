<template>
  <div class="container" @click="goOther">
    <div class="main">我是话题项目</div>
    <splitLine />
    <splitLine2 />
  </div>
</template>

<script>
import { getClientHeight as abc } from 'common/js/utils';
import { getClientHeight as cdf } from 'topic/common/js/utils';

import splitLine from "components/splitLine";
import splitLine2 from "topic/components/splitLine";

export default {
  components: {
    splitLine,
    splitLine2
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      abc();
      cdf();
      fetch('abc/sdf/aaa');
      console.log(this.$router);
    },
    goOther() {
      this.$router.push({path: '/mine'});
    },
  }
};
</script>

<style lang="less" scoped>
  .container{
    width: 100px;
    height: 100px;
    background-color: #FF8833;
    .main {
      width: 100%;
      height: 30px;
      background-color: #228833;
    }
  }
</style>
