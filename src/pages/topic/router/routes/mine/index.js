const mine  = () => import('topic/views/mine');

export default {
  path: '/mine',
  component: mine,
  children: [],
  meta: {
    title: '我的'
  }
};