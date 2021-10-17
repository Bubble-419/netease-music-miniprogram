module.exports = {
  // 转换时间格式
  getPublishTime: (num) => {
    let d = new Date(num);
    return `${d.getFullYear().toString()}.${d.getMonth()+1}.${d.getDate()}`;
  },
  getReplyTime: (num) => {
    let d = new Date(num);
    // 判断年份
    let currYear = new Date().getFullYear();
    let year = d.getFullYear() == currYear ? '' : d.getFullYear().toString() + '年';
    return `${year}${d.getMonth()+1}月${d.getDate()}日`;
  },
  /**
   * 表示时间的三种格式：
   * 1. 音频管理器实例：以秒为单位，无格式，type为Number，精确位数不定（ex: 1.013573，表示第1.013573秒）
   * 2. 歌词所处时间：格式为[00:00.000]，其中秒数精确到小数点后三位，type为String（ex：[01:53.889]，表示第1分钟的第53.889秒）
   * 3. 界面展示时间：格式为[00:00]，type为Number（ex：[02:53]，表示第2分钟第53秒）
   */
  // 把上述的第一种格式转换为后面两种，默认转换为第二种（给歌词使用），需要展示时转换为第三种
  formatSec: (time, show = false) => {
    let min = '00',
      sec = '00.000';
    if (typeof time == 'String') time = Number(time);
    if (time) {
      // 对分钟进行格式化
      min = ('0' + Math.floor(time / 60)).slice(-2);
      // 对秒钟进行格式化
      let secArr = (time % 60).toString().split('.');
      if (show) {
        // 需要展示时，不要小数点之后的数字
        sec = secArr[0];
        sec = sec.length === 1 ? '0' + sec : sec;
      } else {
        secArr[1] = secArr[1].slice(0, 3);
        secArr[0] = ('0' + secArr[0]).slice(-2);
        sec = `${secArr[0]}.${secArr[1]}`;
      }
    }
    return `${min}:${sec}`;
  },
}