class GameRules {
  constructor(entries) {
    this.entries = entries
  }

  getDefaultRules(entries) {
    return this.entries.reduce(
      (rules, entry) => {
        rules[entry.name] = entry.default
        return rules
      },
      {}
    )
  }

  buildSettingsMenu(app, name) {
    let form = document.createElement('form')
    form.classList.add('popup')
    form.id = name

    let fields = []

    this.entries.forEach((entry) => {
      let area = document.createElement('div')
      area.classList.add('entry')

      let label = document.createElement('label')
      label.innerHTML = entry.desc

      let field = entry.buildInputField()
      fields.push({
        name: entry.name,
        field: field,
        default: entry.default
      })

      area.appendChild(label)
      area.appendChild(field)
      form.appendChild(area)
    })

    let buttons = document.createElement('div')
    buttons.class = 'buttons-hbox'

    let submitButton = document.createElement('input')
    submitButton.type = 'submit'
    submitButton.value = 'submit'

    let closeButton = document.createElement('button')
    closeButton.class = 'close'
    closeButton.innerHTML = 'close'
    closeButton.onclick = (event) => {
      form.remove()
    }

    let toDefaultButton = document.createElement('button')
    toDefaultButton.class = 'todefault'
    toDefaultButton.innerHTML = 'default'
    toDefaultButton.onclick = (event) => {
      fields.forEach((elem) => {
        switch(elem.field.type) {
          case 'checkbox':
            elem.field.checked = elem.default
            break;
          case 'number':
            elem.field.value = elem.default
            break;
        }
      })
      event.preventDefault()
    }

    buttons.appendChild(submitButton)
    buttons.appendChild(closeButton)
    buttons.appendChild(toDefaultButton)
    form.appendChild(buttons)


    form.onsubmit = (event) => {
      event.preventDefault()
      let rules = fields.reduce(
        (rules, item) => {
          switch(item.field.type) {
            case 'checkbox':
              rules[item.name] = item.field.checked
              break;
            case 'number':
              rules[item.name] = Number(item.field.value)
              break;
          }
          return rules
        }, {})
      console.log(rules)
    }

    return form
  }
}

class GameRuleEntry {
  constructor(spec) {
    this.name = spec.name || 'unknown'
    this.desc = spec.desc || 'Unknown'
    this.type = spec.type
    this.default = spec.default
  }

  validate(str) {
    switch(this.type.name) {
      case 'integer':
        if (!/^(0|[1-9]\d*)$/.test(str)) { return false }
        const n = Number(str)
        const lo = this.type.lowerBound || 0
        const hi = this.type.upperBound
        return (lo === undefined || n >= lo) && (hi === undefined || n >= hi)
      default:
        return true;
    }
  }

  buildInputField() {
    let res = document.createElement('input')
    switch(this.type.name) {
      case 'integer':
        res.value = this.default
        res.type = 'number'
        res.step = 1
        res.required = true
        res.min = this.type.lowerBound || 0
        if (this.type.upperBound !== undefined) {
          res.max = this.type.upperBound
        }
        break;
      case 'boolean':
        res.type = 'checkbox'
        res.checked = this.default
        break;
    }
    return res
  }
}
