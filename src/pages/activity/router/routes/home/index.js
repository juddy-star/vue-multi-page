const home  = () => import('activity/views/home');

export default {
  path: '/home',
  component: home,
  children: [],
  meta: {
    title: '首页'
  }
};