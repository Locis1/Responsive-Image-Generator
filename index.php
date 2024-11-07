<!DOCTYPE html>
<html lang="de">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Responsive Image Generator</title>
  <script src="jszip.min.js"></script>
  <script src="script.js" defer></script>
</head>

<body>
  <h1>Responsive Image Generator</h1>

  <input type="file" id="upload" accept="image/*" />

  <h2>Image Attributes</h2>

  <label for="basePathInput">Base Path:</label>
  <input type="text" id="basePathInput" value="./images/" placeholder="Gib hier den Basis-Pfad ein..." />

  <label for="loadingSelect">Loading:</label>
  <select id="loadingSelect">
    <option value="" disabled selected>Select</option>
    <option value="lazy">lazy</option>
    <option value="eager">eager</option>
    <option value="auto">auto</option>
  </select>

  <label for="fetchprioritySelect">Fetch Priority:</label>
  <select id="fetchprioritySelect">
    <option value="" disabled selected>Select</option>
    <option value="high">high</option>
    <option value="low">low</option>
    <option value="auto">auto</option>
  </select>

  <label for="decodingSelect">Decoding:</label>
  <select id="decodingSelect">
    <option value="" disabled selected>Select</option>
    <option value="sync">sync</option>
    <option value="async">async</option>
    <option value="auto">auto</option>
  </select>

  <label for="sizesInput">Sizes:</label>
  <input type="text" id="sizesInput" value="100vw" placeholder="Gib hier die Sizes ein..." />

  <h2>Image Sizes</h2>
  <textarea id="textInput" rows="5" cols="100" placeholder="Gib hier deinen Text ein..."></textarea>

  <button onclick="downloadResizedImagesAsZip()">Execute</button>

  <div id="status"></div>

  <h2>Generated HTML</h2>
  <pre id="generatedHtml"></pre>
</body>

</html>