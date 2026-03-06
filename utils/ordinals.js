// https://www.sitepoint.com/convert-numbers-to-ordinals-javascript/
function ordinal(n) {
  let ord = 'th';

  if (n % 10 == 1 && n % 100 != 11) {
    ord = 'st';
  } else if (n % 10 == 2 && n % 100 != 12) {
    ord = 'nd';
  } else if (n % 10 == 3 && n % 100 != 13) {
    ord = 'rd';
  }

  return ord;
}

module.exports = {
  ordinal
}