/**
 * 获得页面卷去的高度
 *
 * @export
 * @returns
 */
export function getScrollTop() {
  let bodyScrollTop = 0;
  let documentScrollTop = 0;

  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  return (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
}

/**
 * 获得滚动条的高度
 *
 * @export
 * @returns
 */
export function getScrollHeight() {
  let bodyScrollHeight = 0;
  let documentScrollHeight = 0;

  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  return (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
}

/**
 * 获得视窗的高度
 *
 * @export
 * @returns
 */
export function getClientHeight() {
  let clientHeight = 0;
  if (document.compatMode === 'CSS1Compat') {
    clientHeight = document.documentElement.clientHeight;
  } else {
    clientHeight = document.body.clientHeight;
  }
  return clientHeight;
}