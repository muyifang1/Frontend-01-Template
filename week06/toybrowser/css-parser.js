const css = require('css');

let cssRules = [];

function parseCssRules(text) {
  let ast = css.parse(text);
  cssRules.push(...ast.stylesheet.rules);
}

function computeCss(element, allElements = []) {
  var elements = allElements.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (const rule of cssRules) {
    let selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matchCssRule = selectorParts.length == 1;

    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matchCssRule = true;
    }

    if (matchCssRule) {
      let sp = calculateSpecificity(rule.selectors[0]);
      let computedStyle = element.computedStyle;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].specificity = sp;
          computedStyle[declaration.property].value = declaration.value;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) <= 0
        ) {
          computedStyle[declaration.property].specificity = sp;
          computedStyle[declaration.property].value = declaration.value;
        }
      }
    }
  }
}

function match(element, selector) {
  if (!element || !selector) {
    return false;
  }

  if (selector.charAt(0) === '#') {
    let idAttr = element.attribute.filter(item => item.name === 'id')[0];
    return idAttr && idAttr.value === selector.replace('#', '');
  } else if (selector.charAt(0) == '.') {
    let classAttr = element.attribute.filter(item => item.name === 'class')[0];

    return (
      classAttr && classAttr.value.indexOf(selector.replace('.', '')) != -1
    );
  } else {
    return element.tagName === selector;
  }
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }

  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }

  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }

  return sp1[3] - sp2[3];
}

function calculateSpecificity(selector) {
  let specificity = [0, 0, 0, 0];
  let selectorParts = selector.split(' ');

  for (const part of selectorParts) {
    if (part.charAt(0) === '#') {
      specificity[1] += 1;
    } else if (part.charAt(0) === '.') {
      specificity[2] += 1;
    } else {
      specificity[3] += 1;
    }
  }

  return specificity;
}

module.exports = {
  parseCssRules,
  computeCss
};