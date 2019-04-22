export function TestRegExp(pattern, str) {
  var reg = new RegExp(pattern)
  return reg.test(str)
}
