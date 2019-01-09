const Find = require('./find.js')
const { print, on, off, move } = require('./utils.js')

const findBox = Symbol('findBox')
const findInput = Symbol('findInput')
const findMatches = Symbol('findMatches')
const findCase = Symbol('findCase')
const findBack = Symbol('findBack')
const findForward = Symbol('findForward')
const findClose = Symbol('findClose')
const hasOpened = Symbol('hasOpened')
const matchCase = Symbol('matchCase')

const inputFocus = Symbol('inputFocus')
const inputBlur = Symbol('inputBlur')
const inputEvent = Symbol('inputEvent')
const inputKeydown = Symbol('inputKeydown')
const compositionstart = Symbol('compositionstart')
const compositionend = Symbol('compositionend')
const caseMouseenter = Symbol('caseMouseenter')
const caseMouseleave = Symbol('caseMouseleave')
const caseClick = Symbol('caseClick')
const backMouseenter = Symbol('backMouseenter')
const backMouseleave = Symbol('backMouseleave')
const backClick = Symbol('backClick')
const forwardMouseenter = Symbol('forwardMouseenter')
const forwardMouseleave = Symbol('forwardMouseleave')
const forwardClick = Symbol('forwardClick')
const closeMouseenter = Symbol('closeMouseenter')
const closeMouseleave = Symbol('closeMouseleave')
const closeClick = Symbol('closeClick')
const events = Symbol('events')

const inComposition = Symbol('inComposition')
const action = Symbol('action')
const lastText = Symbol('lastText')
const initialized = Symbol('initialized')
const config = Symbol('config')

class FindInPage extends Find{
  constructor (webContents, options = {}) {
    super(webContents)
    this[findBox] = null
    this[findInput] = null
    this[findMatches] = null
    this[findCase] = null
    this[findBack] = null
    this[findForward] = null
    this[findClose] = null
    this[hasOpened] = false
    this[matchCase] = false
    this[inComposition] = false
    this[action] = ''
    this[lastText] = ''
    this[initialized] = false
    this[config] = {}
    this[events] = []
    this.parentElement = options.parentElement ? options.parentElement : document.body
    this.duration = (typeof options.duration === 'number' && options.duration > 0) ? options.duration : 300
    this.options = options
    this.options.preload ? this.initialize() : ''
  }
  initialize () {
    if (this[initialized]) {
      print('[FindInPage] Has initialize.')
      return true
    }
    if (!this.initFind()) {
      print('[FindInPage] Failed to initialize.')
      return false
    }
    this[findBox] = creatElement('find-box')
    this[findInput] = creatElement('find-input', 'input')
    this[findMatches] = creatElement('find-matches')
    this[findCase] = creatElement('find-case')
    this[findBack] = creatElement('find-back')
    this[findForward] = creatElement('find-forward')
    this[findClose] = creatElement('find-close')
    getUserConfig.call(this, this.options)
    setBoxStyle.call(this)
    setInputStyle.call(this)
    setMatchesStyle.call(this)
    setCaseStyle.call(this)
    setBackStyle.call(this)
    setForwardStyle.call(this)
    setCloseStyle.call(this)
    lockNext.call(this)
    creatEventHandler.call(this)
    bindEvents.call(this)
    appendElement.call(this)
    onResult.call(this)
    move(this[findBox], (0 - this[findBox].offsetHeight - 10), this.duration)
    return this[initialized] = true
  }
  openFindWindow () {
    if (this[hasOpened]) {
      focusInput.call(this)
      return false
    }
    if (!this.initialize()) return false
    setTimeout(() => {  
      this[findBox].style['visibility'] = 'visible'
      lockNext.call(this)
      focusInput.call(this)
    }, 10)
    move(this[findBox], parseInt(this[config].offsetTop), this.duration)
      .then(() => {})
      .catch(err => { throw err })
    return this[hasOpened] = true
  }
  destroy () {
    this.destroyFind()
    unbindEvents.call(this)
    closeFindWindow.call(this)
    removeElement.call(this)
  }
}

function creatElement (className = '', tag = 'div') {
  const ele = document.createElement(tag)
  ele.classList.add(className)
  return ele
}
function getUserConfig (options) {
  this[config].offsetTop = typeof options.offsetTop === 'number' ? `${options.offsetTop}px` : '0px'
  this[config].offsetRight = typeof options.offsetRight === 'number' ? `${options.offsetRight}px` : '0px'
  this[config].boxBgColor = typeof options.boxBgColor === 'string' ? options.boxBgColor : '#fff'
  this[config].boxShadowColor = typeof options.boxShadowColor === 'string' ? options.boxShadowColor : '#909399'
  this[config].inputBgColor = typeof options.inputBgColor === 'string' ? options.inputBgColor : '#f0f0f0'
  this[config].inputFocusColor = typeof options.inputFocusColor === 'string' ? options.inputFocusColor : '#c5ade0'
  this[config].textColor = typeof options.textColor === 'string' ? options.textColor : '#606266'
  this[config].textHoverBgColor = typeof options.textHoverBgColor === 'string' ? options.textHoverBgColor : '#eaeaea'
  this[config].caseSelectedColor = typeof options.caseSelectedColor === 'string' ? options.caseSelectedColor : '#c5ade0'
}
function setBoxStyle () {
  this[findBox].style.cssText = `position:fixed; top:-110%; 
    right:${this[config].offsetRight}; display:flex; align-items: center; 
    padding:6px; visibility: hidden; background:${this[config].boxBgColor}; 
    box-shadow: 1px 1px 2px 0.5px ${this[config].boxShadowColor};`
}
function setInputStyle () {
  this[findInput].style.cssText = `width:168px; height: 20px; outline:0; border:1px solid ${this[config].inputBgColor}; 
    background:${this[config].inputBgColor}; margin-right:6px; border-radius:2px;`
}
function setMatchesStyle () {
  this[findMatches].innerText = '0/0'
  this[findMatches].style.cssText = `color:${this[config].textColor}; font-size:14px; display:flex; align-items:center; 
    justify-content:center; min-width:40px; max-width:64px; overflow:hidden; margin-right:4px;`
}
function setCaseStyle () {
  this[findCase].innerText = 'Aa'
  this[findCase].style.cssText = `font-size:14px; font-weight:700; cursor:pointer; -webkit-user-select:none; color:${this[config].textColor}; 
    padding:3.5px 1px; border-radius:2px; border:1px solid transparent; margin-right:4px;`
}
function setBackStyle () {
  this[findBack].innerHTML = '➔'
  this[findBack].style.cssText = `font-size:14px; cursor:pointer; -webkit-user-select:none; color:${this[config].textColor}; padding:1px 2px 3px; 
    border-radius:2px; border:1px solid transparent; display:flex; align-items:center; transform: rotate(180deg);`
}
function setForwardStyle () {
  this[findForward].innerHTML = '➔'
  this[findForward].style.cssText = `font-size:14px; cursor:pointer; -webkit-user-select:none; color:${this[config].textColor};
    padding:2px; border-radius:2px; border:1px solid transparent; margin-right:2px; display:flex; align-items:center;`
}
function setCloseStyle () {
  this[findClose].innerHTML = '✖'
  this[findClose].style.cssText = `font-size:14px; cursor:pointer; -webkit-user-select:none; color:${this[config].textColor};
    padding:2px 3.5px; border-radius:2px; border:1px solid transparent; margin-right:2px; display:flex; align-items:center;`
}
function appendElement () {
  [this[findInput], this[findMatches], this[findCase], this[findBack], this[findForward], this[findClose]].forEach((item) => { 
    this[findBox].appendChild(item) 
  })
  this.parentElement.appendChild(this[findBox])
}
function removeElement () {
  this.parentElement.removeChild(this[findBox])
}
function creatEventHandler () {
  this[inputFocus] = (function () {
    this[findInput].style.border = `1px solid ${this[config].inputFocusColor}`
  }).bind(this)
  this[events].push({ ele: this[findInput], name: 'focus', fn: this[inputFocus] })

  this[inputBlur] = (function () {
    this[findInput].style.border = `1px solid ${this[config].inputBgColor}`
  }).bind(this)
  this[events].push({ ele: this[findInput], name: 'blur', fn: this[inputBlur] })

  this[inputEvent] = (function () {
    onInput.call(this)
  }).bind(this)
  this[events].push({ ele: this[findInput], name: 'input', fn: this[inputEvent] })

  this[inputKeydown] = (function (e) {
    onKeydown.call(this, e)
  }).bind(this)
  this[events].push({ ele: this[findInput], name: 'keydown', fn: this[inputKeydown] })

  this[compositionstart] = (function () {
    print('compositionstart')
    this[inComposition] = true
  }).bind(this)
  this[events].push({ ele: this[findInput], name: 'compositionstart', fn: this[compositionstart] })

  this[compositionend] = (function () {
    print('compositionend')
    this[inComposition] = false
  }).bind(this)
  this[events].push({ ele: this[findInput], name: 'compositionend', fn: this[compositionend] })

  this[caseMouseenter] = (function () {
    this[findCase].style['background'] = this[config].textHoverBgColor
  }).bind(this)
  this[events].push({ ele: this[findCase], name: 'mouseenter', fn: this[caseMouseenter] })

  this[caseMouseleave] = (function () {
    this[findCase].style['background'] = this[config].boxBgColor
  }).bind(this)
  this[events].push({ ele: this[findCase], name: 'mouseleave', fn: this[caseMouseleave] })

  this[caseClick] = (function () {
    onCaseClick.call(this)
  }).bind(this)
  this[events].push({ ele: this[findCase], name: 'click', fn: this[caseClick] })

  this[backMouseenter] = (function () {
    this[findBack].style['background'] = this[config].textHoverBgColor
  }).bind(this)
  this[events].push({ ele: this[findBack], name: 'mouseenter', fn: this[backMouseenter] })

  this[backMouseleave] = (function () {
    this[findBack].style['background'] = this[config].boxBgColor
  }).bind(this)
  this[events].push({ ele: this[findBack], name: 'mouseleave', fn: this[backMouseleave] })

  this[backClick] = (function () {
    onBackClick.call(this)
  }).bind(this)
  this[events].push({ ele: this[findBack], name: 'click', fn: this[backClick] })

  this[forwardMouseenter] = (function () {
    this[findForward].style['background'] = this[config].textHoverBgColor
  }).bind(this)
  this[events].push({ ele: this[findForward], name: 'mouseenter', fn: this[forwardMouseenter] })

  this[forwardMouseleave] = (function () {
    this[findForward].style['background'] = this[config].boxBgColor
  }).bind(this)
  this[events].push({ ele: this[findForward], name: 'mouseleave', fn: this[forwardMouseleave] })

  this[forwardClick] = (function () {
    onForwardClick.call(this)
  }).bind(this)
  this[events].push({ ele: this[findForward], name: 'click', fn: this[forwardClick] })

  this[closeMouseenter] = (function () {
    this[findClose].style['background'] = this[config].textHoverBgColor
  }).bind(this)
  this[events].push({ ele: this[findClose], name: 'mouseenter', fn: this[closeMouseenter] })

  this[closeMouseleave] = (function () {
    this[findClose].style['background'] = this[config].boxBgColor
  }).bind(this)
  this[events].push({ ele: this[findClose], name: 'mouseleave', fn: this[closeMouseleave] })

  this[closeClick] = (function () {
    onCloseClick.call(this)
  }).bind(this)
  this[events].push({ ele: this[findClose], name: 'click', fn: this[closeClick] })
}

function bindEvents () {
  this[events].forEach((item) => {
    on(item.ele, item.name, item.fn)
  })
}
function unbindEvents () {
  this[events].forEach((item) => {
    off(item.ele, item.name, item.fn)
  })
}

function focusInput (doBlur = false) {
  setTimeout(() => { 
    doBlur ? this[findInput].blur() : ''
    this[findInput].focus() 
  }, 50)
}

function wrapInput (inputEle, timeout = 50) {
  inputEle.type = 'password'
  setTimeout(() => {
    if (inputEle.type !== 'text') {
      print('[FindInPage] wrapInput timeout..')
      unwrapInput(inputEle)
    }
  }, timeout)
}
function unwrapInput (inputEle) {
  inputEle.type = 'text'
}

function onInput () {
  setTimeout(() => {
    if (this[inComposition]) return
    this[action] = 'input'
    let text = this[findInput].value
    if (text && text !== this[lastText]) {
      this[lastText] = text
      wrapInput(this[findInput], 100)
      this.startFind(text, true, this[matchCase])
    } else if (this[lastText] && text === '') {
      this.stopFind()
      this[findMatches].innerText = '0/0'
      lockNext.call(this)
      focusInput.call(this, true)
    }
  }, 50)
}

function onKeydown (e) {
  if (this[inComposition] || !e) return
  switch (e.code) {
    case 'Enter':
    case 'NumpadEnter':
      let text = this[findInput].value
      if (!text) return
      e.shiftKey ? findKeep.call(this, text, false) : findKeep.call(this, text, true)
      break
    case 'Escape':
      onCloseClick.call(this)
      break
    default: 
      break
  }
}

function findKeep (text, forward) {
  this[action] = 'input'
  this.stopFind('keepSelection')
  this[lastText] = text
  wrapInput(this[findInput], 100)
  this.startFind(text, forward, this[matchCase])
}

function onCaseClick () {
  if (!this[matchCase]) {
    this[matchCase] = true
    this[findCase].style['border-color'] = this[config].caseSelectedColor
    wrapInput(this[findInput], 100)
    this.startFind(this[findInput].value, true, this[matchCase])
  } else {
    this[matchCase] = false
    this[findCase].style['border-color'] = 'transparent'
    wrapInput(this[findInput], 100)
    this.startFind(this[findInput].value, true, this[matchCase])
  }
}

function onBackClick () {
  this[action] = 'back'
  wrapInput(this[findInput], 100)
  this.findNext(false, this[matchCase])
}

function onForwardClick () {
  this[action] = 'forward'
  wrapInput(this[findInput], 100)
  this.findNext(true, this[matchCase])
}

function onCloseClick () {
  closeFindWindow.call(this) ? this.stopFind() : ''
}

function onResult () {
  this.on('result', (activeMatch, matches) => {
    unwrapInput(this[findInput])
    this[findMatches].innerText = `${activeMatch}/${matches}`
    matches > 0 ? unlockNext.call(this) : lockNext.call(this)
    this[action] === 'input' ? focusInput.call(this) : ''
  })
}

function lockNext () {
  this[findBack].style['opacity'] = 0.6
  this[findBack].style['pointer-events'] = 'none'
  this[findForward].style['opacity'] = 0.6
  this[findForward].style['pointer-events'] = 'none'
}

function unlockNext () {
  this[findBack].style['opacity'] = 1
  this[findBack].style['pointer-events'] = 'auto'
  this[findForward].style['opacity'] = 1
  this[findForward].style['pointer-events'] = 'auto'
}

function closeFindWindow () {
  if (!this[hasOpened]) return false
  this[findInput].value = ''
  this[action] = ''
  this[lastText] = ''
  this[findMatches].innerText = '0/0'
  this[hasOpened] = false
  lockNext.call(this)
  move(this[findBox], (0 - this[findBox].offsetHeight - 10), this.duration)
    .then(() => { this[findBox].style['visibility'] = 'hidden' })
    .catch(err => { throw err })
  return true
}

module.exports = FindInPage
