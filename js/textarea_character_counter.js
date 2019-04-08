(function (window, document, undefined) {

  'use strict';

  var text_input = document.getElementById('input_text');

  function countCharacters(e) {
    var text_entered, counter, count_remaining;
    count_remaining = document.getElementById('characters_remaining');

    text_entered = this.value;
    counter = (304 - (text_entered.length));
    count_remaining.textContent = counter;
  }

  text_input.addEventListener('keyup', countCharacters, false);

})(window, document);
