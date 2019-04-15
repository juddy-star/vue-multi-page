const home  = () => import('topic/views/home');

export default {
  path: '/home',
  component: home,
  children: [],
  meta: {
    title: '首页'
  }
};