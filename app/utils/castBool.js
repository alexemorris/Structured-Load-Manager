module.exports = (val) => {
  switch (val) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'TRUE':
    case 'yes':
      return true;
    default:
      return false;
  }
};
