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
    let form = elementBuild('form', {
      id: name,
      classes: ['popup'],
    })

    let fields = []

    this.entries.forEach((entry) => {
      let area = elementBuild('div', {
        classes: ['entry'],
        parent: form,
      })

      let label = elementBuild('label', { 
        parent: area,
        attributes: { innerHTML: entry.desc, },
      })

      let field = entry.buildInputField()
      fields.push({
        name: entry.name,
        field: field,
        default: entry.default
      })

      area.appendChild(field)
    })

    let buttons = elementBuild('div', {
      classes: ['buttons-hbox'],
      parent: form,
    })

    let submitButton = elementBuild('input', {
      parent: buttons,
      attributes: {
        type: 'submit',
        value: 'submit',
      }
    })

    let closeButton = elementBuild('button', {
      parent: buttons,
      classes: ['close'],
      attributes: {
        innerHTML: 'close',
        onclick: (event) => {
          form.remove()
        },
      }
    })

    let toDefaultButton = elementBuild('button', {
      parent: buttons,
      classes: ['todefault'],
      attributes: {
        innerHTML: 'default',
        onclick: (event) => {
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
      }
    })

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
