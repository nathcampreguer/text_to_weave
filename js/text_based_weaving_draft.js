function TextBasedWeavingDraft(char_pattern_weft_count, warp_count_per_char_stitch,
                              char_nr_cols, char_nr_rows, selvage_warp_count,
                              letter_spacing_warp_count, new_line_weft_count,
                              chars_per_line,text_input) {


  this.char_pattern_weft_count = char_pattern_weft_count;
  this.warp_count_per_char_stitch = warp_count_per_char_stitch;
  this.char_nr_cols = char_nr_cols;
  this.char_nr_rows = char_nr_rows;
  this.selvage_warp_count = selvage_warp_count;
  this.letter_spacing_warp_count = letter_spacing_warp_count;
  this.new_line_weft_count = new_line_weft_count;
  this.chars_per_line = chars_per_line;
  this.text_input = text_input;

  //functions

  this._char_pattern_warp_count = (this.warp_count_per_char_stitch * this.char_nr_cols) + this.letter_spacing_warp_count;
  this._total_selvage_warp_count = this.selvage_warp_count * 2;
  this._warp_count_per_line = (this._char_pattern_warp_count * this.chars_per_line) - this.letter_spacing_warp_count;

  this.new_line = function () {
    var new_line_block = [];
    var aux_line = [];
    var other_aux_line = [];
    var toggle_last_value = 0;

    for (var i = 0; i < this._warp_count_per_line; i++) {
      if (i % 2) {
        aux_line.push(0);
      } else {
        aux_line.push(1);
      }
    }

    for (var i = 0; i < this.new_line_weft_count; i++) {
      other_aux_line = Array.from(aux_line);
      other_aux_line.shift();
      toggle_last_value = !other_aux_line[this._warp_count_per_line - 2];
      other_aux_line.push(+toggle_last_value);

      if (i % 2) {
        new_line_block.push(aux_line);
      } else {
        new_line_block.push(other_aux_line);
      }
    }

    return new_line_block;
  }

  this.encoded_text = function () {
    var text_lines = this.split_text_into_lines();
    var utf_code_line = [];
    var row_nr = 0;
    var weaving_draft = [];
    var draft_line = [];
    var shifted_line = [];

    for (let line of text_lines) {
      utf_code_line = chars_to_utf_code(line);
      draft_line = this.build_draft_line(utf_code_line, row_nr);
      weaving_draft.push(draft_line);
      row_nr++;

      for (var i = 0; i < this.char_pattern_weft_count - 1; i++) {
        shifted_line = line_binary_shift(utf_code_line);
        draft_line = this.build_draft_line(shifted_line, row_nr);
        weaving_draft.push(draft_line);
        row_nr++;
        utf_code_line = shifted_line;
      }
      weaving_draft = weaving_draft.concat(this.new_line());
    }

    add_selvage(weaving_draft, this.selvage_warp_count);

    return weaving_draft;
  }

  function add_selvage(weaving_draft, warp_count) {
    var line_count = 0;

    for (let line of weaving_draft) {
      if (line_count % 2) {
        //add even_row_pattern
        for (var i = 0; i < warp_count; i++) {
          if (i % 2) {
            line.unshift(0);
            line.push(0);
          } else {
            line.unshift(1);
            line.push(1);
          }
        }
      } else {
        //add even_row_pattern
        for (var i = 0; i < warp_count; i++) {
          if (i % 2) {
            line.unshift(1);
            line.push(1);
          } else {
            line.unshift(0);
            line.push(0);
          }
        }
      }
      line_count++;
    }
  }

  function line_binary_shift(utf_codes) {
    var shifted_line = [];
    var shifted_char_code = 0;
    var masked_char_utf_code = 0;

    for (let char_utf_code of utf_codes) {
      //circular shift
      shifted_char_code = ((char_utf_code >>> 1) | (char_utf_code << 4));
      //masking to get only final 5 bits 31=11111
      //change to adapt to "char_nr_cols"
      masked_char_utf_code = shifted_char_code & 31;
      shifted_line.push(masked_char_utf_code);
    }

    return shifted_line;
  }

  function chars_to_utf_code(line) {
    var char_utf_code = 0;
    var normalized_char_utf_code = "";
    var masked_char_utf_code = 0;
    var utf_codes = [];

    for (let character of line) {
      char_utf_code = character.charCodeAt(0);
      //masking to get only final 5 bits 31=11111
      //change to adapt to "char_nr_cols"
      masked_char_utf_code = char_utf_code & 31;
      utf_codes.push(masked_char_utf_code);
    }

    return utf_codes;
  }

  this.split_text_into_lines = function () {
    var text_lines = [];
    var line = "";
    var text = this.text_input;
    var chars_per_line = this.chars_per_line;

    for (var char_count = 0; char_count < text.length; char_count += chars_per_line) {
      line = text.slice(char_count, char_count + chars_per_line);
      if (line.length < chars_per_line) {
        line = fill_remaining_with_space(line, chars_per_line);
      }
      text_lines.push(line);
    }
    return text_lines;
  }

  //
  function fill_remaining_with_space(text_line, chars_per_line) {
    while (text_line.length < chars_per_line) {
      text_line = text_line + " ";
    }
    return text_line;
  }

  this.build_draft_line = function (utf_code_chars, row_nr) {
    var draft_line = [];
    var char_count = 0;
    normalized_char_utf_stitches = [];

    for (let char_utf_code of utf_code_chars) {
      char_count++;

      normalized_char_utf_stitches = normalize_char_utf_stitches(char_utf_code, this.char_nr_cols, this.warp_count_per_char_stitch);
      draft_line = draft_line.concat(normalized_char_utf_stitches);

      if (char_count < utf_code_chars.length){
        draft_line = draft_line.concat(letter_spacing(row_nr));
      }
    }

    return draft_line;
  }

  function normalize_char_utf_stitches(char_utf_code, nr_cols, warp_count_per_char_stitch) {
    var binary_char_utf_code = Array.from(char_utf_code.toString(2));
    var binary_char_stitch = [];

    while (binary_char_utf_code.length < nr_cols) {
      binary_char_utf_code.unshift("0");
    }

    for (let char_code of binary_char_utf_code) {
      for (var i = 0; i < warp_count_per_char_stitch; i++) {
        binary_char_stitch.push(char_code);
      }
    }

    return binary_char_stitch;
  }

  //change to use "letter_spacing_warp_count"
  function letter_spacing(row_nr) {
    if (row_nr % 2) {
      return ["0","1"];
    } else {
      return ["1","0"];
    }
  }


}
