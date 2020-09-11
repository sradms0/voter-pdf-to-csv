exports.isLocation  = function(line) { return line.match(/\w+ · (([\w\s]+-\d\d)|(\[[\w\s]+\])) · [\w\s]+ · (Even|Odd)/); }
exports.isName      = function(line) { return line.match(/\w+, \w+$/); }
exports.isPhone     = function(line) { return line.match(/^\(\d\d\d\) \d\d\d-\d\d\d\d/); }
exports.isCity      = function(line) { return line.match(/^\w+(\s\w+)?, \w\w \d{5}/); }
exports.isStreet    = function(line) { return line.match(/^\d+ \w+/); }
exports.isSex       = function(line) { return line.match(/^[FM]$/); }
exports.isAge       = function(line) { return line.match(/^\d\d$/); }
exports.isParty     = function(line) { return line.match(/^[DRU]$/); }

exports.isEmail     = function(line) { 
  return line.match(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );
}
