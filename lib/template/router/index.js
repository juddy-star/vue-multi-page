import Vue from 'vue';
import Router from  'vue-router';
import globalConfig from '@/config';
import config from '$projectName$/config';

Vue.use(Router);

const { domain = '' } = globalConfig;
const { name: projectName = '', vueRouter: { mode = 'hash' } = {} } = config;

export default new Router({
  mode,
  // history模式可用，hash模式无用
  base: `/${domain}/${projectName}/`,
  routes
});