/* eslint-env browser */
const _ = require('highland')

// get highland stream from Response
exports.toHighland = function (res) {
  // works as method or function
  if (res == null) res = this
  // if body null empty stream (can happen with cors restricted responses)
  if (res.body == null) return _([])
  // fallback for isomorphic-fetch
  if (res.body.getReader == null) return _(res.body)

  const reader = res.body.getReader()
  return _(function (push, next) {
    reader.read()
    .then(function (result) {
      push(null, result)
      if (result.done) {
        return push(null, _.nil)
      }
      next()
    })
    .catch(function (err) {
      push(err)
      next()
    })
  })
}

// text decoder transform
exports.textDecoder = function (stream) {
  // fallback for isomorphic-fetch
  if (typeof TextDecoder === 'undefined') {
    return stream.invoke('toString')
  }

  const decoder = new TextDecoder()
  return stream
    .map(function (result) {
      return decoder.decode(result.value || new Uint8Array(), {stream: !result.done})
    })
}
