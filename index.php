<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Responsive Image Generator</title>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script> -->
    <script src="jszip.min.js"></script>
    <script src="script.js" defer></script>
  </head>
  <body>
    <h1>Responsive Image Generator</h1>

    <input type="file" id="upload" accept="image/*" />

    <h2>Image Sizes</h2>
    <textarea
      id="textInput"
      rows="5"
      cols="100"
      placeholder="Gib hier deinen Text ein..."
    ></textarea>

    <button onclick="downloadResizedImagesAsZip()">
  Execute
    </button>

    <div id="status"></div>

    <h2>Generatet Html</h2>
    <pre id="generatedHtml"></pre>

    <script></script>
  </body>
</html>
