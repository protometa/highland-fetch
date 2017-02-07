/* eslint-env browser */
/* global describe, it, expect */

import _ from 'highland'
import {toHighland, textDecoder} from './index.js'

describe('highlandRequest', function () {
  it('extends Response to give Highland stream that works with textDecoder', function (done) {
    // setup
    Response.prototype.highland = toHighland
    // usage
    _(fetch('https://cors-anywhere.herokuapp.com/http://stuff.mit.edu/afs/sipb/contrib/pi/pi-billion.txt'))
    .errors(err => console.error(err))
    .flatMap((res) => res.highland())
    .through(textDecoder)
    .splitBy('')
    .scan({count: 0, slice: ''}, (scan, digit) => {
      scan.slice = (scan.slice + digit).slice(-5)
      scan.count++
      scan.position = scan.count - scan.slice.length
      return scan
    })
    .find(scan => scan.slice.startsWith('12345'))
    .each(match => {
      console.log(match)
      expect(match.position).toBe(49703)
      done()
    })
  })
})
