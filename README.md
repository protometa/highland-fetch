
# Usage

Can be used to extend fetch `Response` to give highland stream. Also comes with `textDecoder` transform.

```javascript
import _ from 'highland'
import {toHighland, textDecoder} from 'highland-fetch'

// extend Response
Response.prototype.highland = toHighland

// highland stream of response body text
_(fetch('http://www.example.com'))
.flatMap(res => res.highland())
.through(textDecoder)
```
