/**
 * @description 移动端适配方案（终极）
 * @email 401541212@qq.com
 * @author cuichuanteng
 */
; (function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = global || self;
    global.NickMobileAdaptation = factory();
  }
})(this, function () {
  function NickMobileAdaptation(option) {
    /**
     * @description 设置视口缩放
     * @param {Number} scale 默认值为1
     */
    function setViewport(scale) {
      var hasViewport = false;
      var viewport = document.querySelector('meta[name="viewport"]');
      hasViewport = !!viewport;
      viewport = hasViewport ? viewport : document.createElement('meta');
      viewport.name = 'viewport';
      viewport.setAttribute('content', 'target-densitydpi=device-dpi,width=device-width,initial-scale=' + (scale || 1) + ',maximum-scale=1,user-scalable=no');
      if (!hasViewport) {
        document.head.appendChild(viewport);
      }
    }

    function updateBodyWidth(width) {
      document.body.style.cssText += 'margin:0 auto;width:' + width + 'px;box-sizing:border-box;';
    }

    function run() {
      // 初始化视口宽为1:1 以便获取真实的设备尺寸
      setViewport();
      // 初始化配置参数
      option = option || {};
      option.width = option.width || 750;
      option.scale = option.scale || 0.5;

      // 获取设计稿宽度
      var designWidth = option.width;

      // 获取html根节点标签
      var html = document.documentElement;

      // 获取可视区域宽度
      var clientWidth = html.clientWidth;

      // 获取独立像素比值
      var drp = window.devicePixelRatio;

      // 将视口宽度按比例进行缩放，最终缩放的宽度等于设计稿的宽度
      // 因此通过  设计稿宽/可视区域宽 = 缩放比例  假设设备宽375 设计稿宽750 则 750/375=2 viewport中的scale值为1/2=0.5
      var scale = 1 / (designWidth / clientWidth);

      // 根据可视区域宽度 * 缩放比例得到缩放后的可视区域大小 ，提前计算缩放后的宽度以便控制实际的显示比例。
      // iphone6的分辨率是375*2=750 ipad分辨率是768*2=1536  因此750的设计稿在1536的分辨率下缩放百分百显示效果并不好
      // 默认会的scale 0.6表示在ipad或更大的设备上，只使用60%的宽度来显示内容，这样看起来就有竖屏手机的感觉
      // 当然如果你不希望这么显示，想满屏展示也可以设置option.scale为1
      var width = clientWidth * (1 / scale);

      // 根据可视区域宽度*独立像素比得到真实的分辨率
      var realWidth = clientWidth * drp;

      // 获取宽屏下显示区域所占可视区域的比例，默认值为0.6
      var mobileScale = option.scale;

      // 计算视口的缩放比例， 如果分辨率/缩放后的宽度 >1.5 即表示设备是较宽的屏，则将显示的比例再进行缩小以达到竖屏手机的显示效果。
      var viewportScale = realWidth / width > 1.5 ? scale * mobileScale : scale;

      // 设置最终的视口缩放比例
      setViewport(viewportScale);

      // 如果是大屏则需要对body的宽度设置为设计稿的宽度并且居中显示
      if (realWidth / width > 1.5) {
        if (document.body) {
          updateBodyWidth(designWidth)
        } else {
          document.addEventListener('DOMContentLoaded', function () {
            updateBodyWidth(designWidth)
          })
        }
      }
    }

    // 执行适配
    run();

    // resize时重新执行适配
    window.addEventListener('resize', run);
  }
  return NickMobileAdaptation;
});
