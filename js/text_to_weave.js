(function (window, document, undefined) {

  'use strict';

  //variables
  var text_input = document.getElementById('input_text');
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext('2d');
  // const gl = canvas.getContext("webgl");


  function encode_text() {
    var text = this.value;
    var weaving_draft = new TextBasedWeavingDraft(15,3,5,15,15,2,0,76,text);
    var draft = weaving_draft.encoded_text();
    var row = 0;

    context.clearRect( 0, 0, context.canvas.width, context.canvas.height);
    resize(draft.length);

    for (let draft_line of draft) {
      draw_to_canvas(draft_line, row);
      row++;
    }

    var dataURL = canvas.toDataURL("image/png");
    var link = document.getElementById("download_link");

    link.href = dataURL;
    link.title = "weave_draft";
  }

  function draw_to_canvas(draft_line, row) {
    var col = 0;

    for (let stitch of draft_line) {
      if (+stitch) {
        context.fillStyle = 'black';
      } else {
        context.fillStyle = 'white';
      }
      context.fillRect(col, row, 1, 1);
      col++;
    }
  }

  function resize(draft_height) {
    // Lookup the width size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth;

    // Check if the canvas is not the same size.
    if (canvas.width  != displayWidth) {

      // Make the canvas the same size
      canvas.width  = displayWidth;
    }
    canvas.height = draft_height;
  }

  //events
  text_input.addEventListener('keyup', encode_text, false);


})(window, document);
