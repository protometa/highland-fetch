/* eslint-env browser */
const _ = require('highland')

// get highland stream from Response
exports.highlandResponse = function (res) {
  // works as method or function
  if (res == null) res = this
  // fallback for isomorphic-fetch
  if (res.body.getReader == null) return _(res.body)

  const reader = this.body.getReader()
  return _((push, next) => {
    reader.read()
    .then(result => {
      push(null, result)
      if (result.done) {
        return push(null, _.nil)
      }
      next()
    })
    .catch(err => {
      push(err)
      next()
    })
  })
}

// through text decoder
exports.textDecoder = function (stream) {
  // fallback for isomorphic-fetch
  if (typeof TextDecoder === 'undefined') {
    return stream.invoke('toString')
  }

  const decoder = new TextDecoder()
  return stream
    .map(result => decoder.decode(result.value || new Uint8Array(), {stream: !result.done}))
}
