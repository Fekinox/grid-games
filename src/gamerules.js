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
}
