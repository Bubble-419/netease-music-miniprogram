module.exports = {
  getPublishTime: (num) => {
    let d = new Date(num);
    return `${d.getFullYear().toString()}.${d.getMonth()+1}.${d.getDate()}`;
  }
}