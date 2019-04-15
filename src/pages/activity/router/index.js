import Vue from 'vue';
import Router from  'vue-router';
import globalConfig from '@/config';
import config from 'activity/config';
import routes from './routes';

Vue.use(Router);

const { domain = '' } = globalConfig;
const { name: projectName = ''} = config;

export default new Router({
  mode: 'hash',
  // history模式可用，hash模式无用
  base: `/${domain}/${projectName}/`,
  routes
});