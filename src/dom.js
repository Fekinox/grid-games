function elementBuild(tag, spec) {
  let elem = document.createElement(tag)

  // Set ID
  if (Object.hasOwn(spec, 'id')) {
    elem.id = spec.id
  }

  // Set parent
  if (Object.hasOwn(spec, 'parent') && spec.parent !== undefined) {
    spec.parent.appendChild(elem)
  }

  // Set classes
  if (Object.hasOwn(spec, 'classList')) {
    spec.classList.split(' ').forEach((c) => {
      elem.classList.add(c)
    })
  }

  // Set dataset properties
  if (Object.hasOwn(spec, 'data')) {
    for (const label in spec.data) {
      elem.dataset[label] = spec.data[label]
    }
  }

  // Set other attributes
  if (Object.hasOwn(spec, 'attributes')) {
    for (const label in spec.attributes) {
      elem[label] = spec.attributes[label]
    }
  }

  return elem
}
