exports.extractName = function(name) {
  const [ last, first ] = name.split(',');
  return { last, first };
}

exports.extractResidency = function(street, _city) {
  const [ city, rest ] = street && _city ? _city.split(/, /) : ['', ''],
        [ state, zip ] = rest.split(' ');
  return { street, city, state, zip };
}

