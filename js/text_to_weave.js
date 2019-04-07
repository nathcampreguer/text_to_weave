(function (window, document, undefined) {

  'use strict';

  //variables
  var text_input = document.getElementById('input_text');
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext('2d');


  function encode_text() {
    var text = this.value;
    var weaving_draft = new TextBasedWeavingDraft(10,3,5,10,15,2,3,76,text);
    var draft = weaving_draft.encoded_text();
    var row = 0;

    context.clearRect( 0, 0, context.canvas.width, context.canvas.height);

    for (let draft_line of draft) {
      draw_to_canvas(draft_line, row);
      row++;
    }
  }

  function draw_to_canvas(draft_line, row) {
    var col = 0;

    for (let stitch of draft_line) {
      if (+stitch) {
        context.fillStyle = 'black';
      } else {
        context.fillStyle = 'gray';
      }
      context.fillRect(col, row, 1, 1);
      col++;
    }
  }

  //events
  text_input.addEventListener('keyup', encode_text, false);


})(window, document);
