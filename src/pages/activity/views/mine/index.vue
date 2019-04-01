<template>
  <div class="container">
    <div class="main">我是活动项目我的</div>
    <splitLine />
    <splitLine2 />
  </div>
</template>

<script>
import { getScrollHeight as aaa } from 'common/js/utils';
import { getScrollHeight as bbb } from 'activity/common/js/utils';

import splitLine from "components/splitLine";
import splitLine2 from "activity/components/splitLine";

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
      aaa();
      bbb();
    }
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
