let originalImage = null;
let sizes = [];
let imageName = '';
let imageExtension = '';

// Handle image upload
document.getElementById('upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            originalImage = img;
            [imageName, imageExtension] = file.name.split(/\.(?=[^\.]+$)/);
            alert("Image uploaded successfully!");
        };
    };
    reader.readAsDataURL(file);
});

// Create and download resized images in a ZIP file
async function downloadResizedImagesAsZip() {
    sizes = extractSizesFromText(document.getElementById('textInput').value);

    if (!originalImage) return alert("Please upload an image first.");
    if (!sizes.length) return alert("No valid image sizes found.");

    const zip = new JSZip();
    const folder = zip.folder("images");
    document.getElementById("status").textContent = "Creating ZIP file...";

    for (let [width, height] of sizes) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(originalImage, 0, 0, width, height);

        const blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${imageExtension}`));
        folder.file(`${imageName}-${width}x${height}.${imageExtension}`, blob);
    }

    zip.generateAsync({ type: "blob" }).then(content => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "Resized_Images.zip";
        link.click();

        document.getElementById("status").textContent = "ZIP file created and downloaded.";
        generateHTML();
    }).catch(err => console.error("Error creating ZIP:", err));
}

// Extract image sizes from the input text
function extractSizesFromText(text) {
    return [...text.matchAll(/(\d+)×(\d+)/g)].map(match => [parseInt(match[1]), parseInt(match[2])]);
}

// Generate HTML output for image srcset
function generateHTML() {
    const container = document.getElementById('generatedHtml');
    if (!originalImage || !sizes.length) return;

    const basePath = document.getElementById('basePathInput').value;
    const imgSrc = `${basePath}${imageName}.${imageExtension}`;
    const srcset = sizes.map(([width, height]) => `${basePath}${imageName}-${width}x${height}.${imageExtension} ${width}w`).join(',\n        ');

    // Dynamically build the img tag with only selected attributes
    let imgTag = `<img src="${imgSrc}" srcset="${srcset}" sizes="${document.getElementById('sizesInput').value}"`;

    // Check for loading attribute
    const loading = document.getElementById('loadingSelect').value;
    if (loading) {
        imgTag += ` loading="${loading}"`;
    }

    // Check for fetchpriority attribute
    const fetchPriority = document.getElementById('fetchprioritySelect').value;
    if (fetchPriority) {
        imgTag += ` fetchpriority="${fetchPriority}"`;
    }

    // Check for decoding attribute
    const decoding = document.getElementById('decodingSelect').value;
    if (decoding) {
        imgTag += ` decoding="${decoding}"`;
    }

    imgTag += ' />'; // Close the img tag
    container.textContent = imgTag.trim();
}
