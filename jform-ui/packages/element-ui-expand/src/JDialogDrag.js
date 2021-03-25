// v-jDialogDrag: 弹窗拖拽

function JDialogDragImpl(el, {fullscreen}) {
  const dialogHeaderEl = el.querySelector('.el-dialog__header');
  const dragDom = el.querySelector('.el-dialog');

  if (fullscreen === true) {
    dialogHeaderEl.style.cursor = 'default';
    dialogHeaderEl.onmousedown = null;
  } else {
    dialogHeaderEl.style.cursor = 'move';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    dialogHeaderEl.onmousedown = (e) => {
      e.preventDefault();
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      // 获取到的值带px 正则匹配替换
      let styL, styT;

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/px/g, '');
        styT = +sty.top.replace(/px/g, '');
      }

      document.onmousemove = function (e) {
        const l = e.clientX - disX;
        const t = e.clientY - disY;

        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }
}

const JDialogDrag = {
  bind(el, {value: {fullscreen}}) {
    JDialogDragImpl(el, {fullscreen});
  },
  update(el, {value: {fullscreen}}) {
    JDialogDragImpl(el, {fullscreen});
  }
};

export default JDialogDrag;
