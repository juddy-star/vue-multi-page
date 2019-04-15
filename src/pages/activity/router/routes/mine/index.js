const mine  = () => import('activity/views/mine');

export default {
  path: '/mine',
  component: mine,
  children: [],
  meta: {
    title: '我的'
  }
};