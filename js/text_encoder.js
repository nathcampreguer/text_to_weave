(function (window, document, undefined) {

  'use strict';

  //variables
  var text_input = document.getElementById('input_text');
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext('2d');
  const pattern_height_rows = 5;

  //functions
  function encode_text() {
    var text_entered = this.value
    var binary_characters = []
    for (var i = 0; i < text_entered.length; i++) {
        binary_characters.push(build_utf_block(text_entered.charAt(i)));
    }
    plot_row(binary_characters, 0);
  }

  function build_utf_block(character) {
    var utf_block = [];
    var char_utf_code = character.charCodeAt(0);
    var masked_char_utf_code = 0;
    var binary_circular_shift = 0;
    var normalized_char_utf_code = "";

    for (var i = 0; i < pattern_height_rows; i++) {
      //masking to get only final 5 bits 31=11111
      masked_char_utf_code = char_utf_code & 31;

      normalized_char_utf_code = normalize_binary_string(masked_char_utf_code.toString(2), 5);
      utf_block.push(normalized_char_utf_code);

      //circular shift
      binary_circular_shift = ((masked_char_utf_code >>> 1) | (masked_char_utf_code << 4));

      char_utf_code = binary_circular_shift;
    }

    return utf_block;
  }

  function normalize_binary_string(binary_string, nr_bits) {
    while (binary_string.length < nr_bits) {
      binary_string = "0" + binary_string;
    }
    return binary_string;
  }

  function plot_weave_draft(binary_characters) {

  }

  function plot_row(character_patterns, starting_row) {
    var col = 0;
    for (let pattern of character_patterns) {
      col = plot_pattern(pattern, starting_row, col, 10);
      //plot_line_break(3, starting_row + pattern_height_rows);
    }
  }

  function plot_pattern(pattern, starting_row, starting_col, stitch_size) {
    var row = starting_row;
    var col = starting_col;
    const spacing = 3;

    for (let pattern_line of pattern) {
      //go through each character of the string and plot the square
      for (let stitch of pattern_line) {
        if (+stitch) {
          context.fillStyle = 'black';
        } else {
          context.fillStyle = 'gray';
        }
        context.fillRect(col, row, stitch_size, stitch_size);
        col += stitch_size + spacing;
      }
      col = starting_col;
      row += stitch_size + spacing;
    }
    return starting_col + 72;
  }

  function plot_line_break(nr_rows, starting_row) {

  }

  //events
  text_input.addEventListener('keyup', encode_text, false);


})(window, document);
