const { debug } = require('./utils.js')

const stopActions = ['clearSelection', 'keepSelection', 'activateSelection', 'close']
const ipcR = Symbol('ipcRenderer')
const opts = Symbol('options')
const requestId = Symbol('requestId')
const activeMatch = Symbol('activeMatch')
const matches = Symbol('matches')
const initd = Symbol('initd')
const preText = Symbol('preText')
const onResult = Symbol('onResult')

class Find {
  constructor (ipcRenderer, options = {}) {
    this[ipcR] = ipcRenderer
    this[opts] = options
    this[requestId] = null
    this[activeMatch] = 0
    this[matches] = 0
    this[initd] = false
    this[preText] = ''
  }
  initFind (onResultFun) {
    if (this[initd]) return false
    this[onResult] = onResultFun
    bindFound.call(this)
    return this[initd] = true
  }
  destroyFind () {
    this[ipcR]  = null
    this[opts]  = null
    this[requestId] = null
    this[activeMatch] = 0
    this[matches] = 0
    this[initd] = false
    this[preText] = ''
    this[onResult] = null
  }
  isFinding () {
    return !!this[requestId]
  }
  startFind (text = '', forward = true, matchCase = false) {
    if (!text) return
    this[activeMatch] = 0
    this[matches] = 0
    this[preText] = text

    this.findInPage(this[preText], {
      forward: forward,
      matchCase: matchCase
    }).then(res => {
      this.print(`this[requestId] = ${res}`)
      this[requestId] = res
    })
  }
  findNext (forward, matchCase = false) {
    if (!this.isFinding()) throw new Error('Finding did not start yet !')
    this.findInPage(this[preText], {
      forward: forward,
      matchCase: matchCase,
      findNext: true
    }).then(res => {
      this[requestId] = res
    })
  }
  stopFind (action) {
    stopActions.includes(action) ? '' : action = 'clearSelection'

    this.print(`<- stopFindInPage { action: ${action}, windowKey: ${this[opts].windowKey} }))`)

    this[ipcR].send('stopFindInPage', {
      action: action,
      windowKey: this[opts].windowKey
    })
  }

  print(any) {
    print.call(this, any)
  }

  findInPage(text, options) {
    this.print(`<- findInPage (text: ${text}, windowKey: ${this[opts].windowKey}, forward: ${options.forward}, matchCase: ${options.matchCase}, findNext: ${options.findNext})`)

    return this[ipcR].invoke('findInPage', {
      text: text,
      windowKey: this[opts].windowKey,
      options: options
    })
  }
}

function print(any) {
  if (debug) {
    console.log(any)
    try {
      (this[ipcR] && this[opts] && this[opts].debugIpcChannel) ? this[ipcR].send(this[opts].debugIpcChannel, any) : console.log('Option debugIpcChannel is not defined')
    } catch (e) {
      console.log('Failed to send to debugIpcChannel')
    }
  }
}

function bindFound () {
  this[ipcR].on('found-in-page', (e, r) => {
    print.call(this, '-> found-in-page')
    onFoundInPage.call(this, r)
  })
}

function onFoundInPage (result) {
  if (this[requestId] !== result.requestId) return

  if (result.finalUpdate ) {
    typeof result.activeMatchOrdinal === 'number' ? this[activeMatch] = result.activeMatchOrdinal : ''
    typeof result.matches === 'number' ? this[matches] = result.matches : ''
    reportResult.call(this)
  }
}

function reportResult () {
  typeof this[onResult] === 'function' ? this[onResult].call(this, this[activeMatch], this[matches]) : ''
}

module.exports = {
  Find,
  print
}
