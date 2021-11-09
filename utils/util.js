module.exports = {
  // 计算歌单播放数
  getPlayCount: (num) => {
    let n = Math.round(num).toString();
    if (n.length > 8) {
      return n.slice(0, -8) + '亿';
    } else if (n.length > 4) {
      return n.slice(0, -4) + '万';
    } else return '';
  },
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
   * 表示时间的两种格式：
   * 1. 音频管理器实例：以秒为单位，无格式，type为Number，精确位数不定（ex: 1.013573，表示第1.013573秒）
   * 2. 界面展示时间：格式为[00:00]，type为Number（ex：[02:53]，表示第2分钟第53秒）
   * 把第一种时间转换为第二种
   */
  formatSec: (time) => {
    let min = '00',
      sec = '00.000';
    if (typeof time == 'String') time = Number(time);
    if (time) {
      // 对分钟进行格式化
      min = ('0' + Math.floor(time / 60)).slice(-2);
      // 对秒钟进行格式化
      let secArr = (time % 60).toString().split('.');
      sec = secArr[0];
      sec = sec.length === 1 ? '0' + sec : sec;
    }
    return `${min}:${sec}`;
  },
  // 把歌词的秒数格式转化为可以比较的数字格式
  formatLyc: (time) => {
    let timeArr = time.split(':');
    return timeArr[0] * 60 + parseFloat(timeArr[1]);
  },
}