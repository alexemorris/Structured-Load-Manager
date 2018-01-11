module.exports = function(data, fields) {
  for (var i=0; i < fields.length; i++) {
    if (fields[i] && data[fields[i]]) {
      return data[fields[i]]
    }
  }
}
