import debug from 'debug'
import EventEmitter from 'eventemitter3'

/**
 * DEBUG INFO
 */
const info = debug('CP2:info')
const warn = debug('CP2:warn')

/**
 * PRESET IMPORT
 */
let preset = {}

try {
  preset = require('../preset.json')
  info('[APP] preset import successful!')
} catch (error) {
  warn('[APP] no preset imported.')
}

/**
 * EVENT EMITTER
 */
const eventBus = new EventEmitter()

/**
 * FETCH WRAPPER
 */
function gql (body, endpoint) {
  if (!body.query) throw new Error('[GQL] property "query" is required.')
  return fetch(endpoint || 'https://gql.twitch.tv/gql', {
    body: JSON.stringify(body),
    headers: {
      'Client-Id': endpoint ? null : preset.client_id,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    referrerPolicy: 'no-referrer'
  })
}

export {
  eventBus,
  gql,
  info,
  preset,
  warn
}
