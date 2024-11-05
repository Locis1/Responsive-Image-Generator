let originalImage = null;
let sizes = []; // Array für Bildgrößen
let imageName = ''; // Variable für den Bildnamen ohne Endung
let imageExtension = ''; // Variable für die Bilddateiendung

// Bild hochladen und speichern
document.getElementById('upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Bilddaten lesen
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            originalImage = img;
            imageName = file.name.split('.').slice(0, -1).join('.'); // Bildnamen ohne Endung extrahieren
            imageExtension = file.name.split('.').pop(); // Dateiendung extrahieren
            alert("Bild erfolgreich hochgeladen!");
        };
    };
    reader.readAsDataURL(file);
});

// Funktion zum Erstellen und Herunterladen der ZIP-Datei
async function downloadResizedImagesAsZip() {
    const textInput = document.getElementById('textInput').value;
    sizes = extractSizesFromText(textInput); // Bildgrößen aus dem Text extrahieren
    
    if (!originalImage) {
        alert("Bitte zuerst ein Bild hochladen.");
        return;
    }

    if (sizes.length === 0) {
        alert("Keine gültigen Bildgrößen gefunden. Bitte gib einen Text mit Bildgrößen an.");
        return;
    }

    const zip = new JSZip(); // JSZip-Instanz erstellen
    const folder = zip.folder("images"); // Ordner innerhalb der ZIP-Datei

    const statusDiv = document.getElementById("status");
    statusDiv.textContent = "Erstelle ZIP-Datei...";

    // Bilder in verschiedenen Größen erstellen und zur ZIP-Datei hinzufügen
    for (let size of sizes) {
        const [width, height] = size;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(originalImage, 0, 0, width, height);

        // Blob mit dem korrekten MIME-Typ erzeugen
        const blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${imageExtension}`));
        const filename = `${imageName}-${width}x${height}.${imageExtension}`; // Bildnamen mit dynamischem Format

        // Blob zur ZIP-Datei hinzufügen
        folder.file(filename, blob);
    }

    // ZIP-Datei generieren und als Download anbieten
    zip.generateAsync({ type: "blob" }).then(content => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "Resized_Images.zip";
        link.click();

        statusDiv.textContent = "ZIP-Datei erfolgreich erstellt und heruntergeladen.";
        generateHTML(); // Bildname hier übergeben
    }).catch(err => {
        statusDiv.textContent = "Fehler beim Erstellen der ZIP-Datei.";
        console.error("ZIP-Erstellungsfehler:", err);
    });
}

// Funktion zum Extrahieren der Bildgrößen aus dem eingegebenen Text
function extractSizesFromText(text) {
    const sizeRegex = /(\d+)×(\d+)/g; // RegEx für die Erkennung von "Breite×Höhe"
    const extractedSizes = [];
    let match;

    while ((match = sizeRegex.exec(text)) !== null) {
        const width = parseInt(match[1]);
        const height = parseInt(match[2]);
        extractedSizes.push([width, height]);
    }

    return extractedSizes; // Array von Bildgrößen zurückgeben
}

// Funktion zur Generierung der HTML-Ausgabe
function generateHTML() {
    const generatedHtmlContainer = document.getElementById('generatedHtml');
    console.log(originalImage);
    if (!originalImage || sizes.length === 0) return;

    const imgSrc = `../images/${imageName}.${imageExtension}`; // Der Bildpfad variabel gestalten
    const imgSetParts = sizes.map(size => {
        const [width, height] = size;
        return `../images/${imageName}-${width}x${height}.${imageExtension} ${width}w`; // Hier auch den Pfad variabel gestalten
    });

    const srcset = imgSetParts.join(',\n        '); // srcset zusammenfügen
    const htmlOutput = `
<img
src="${imgSrc}"
srcset="
${srcset}"
sizes="100vw"
/>`;

    generatedHtmlContainer.textContent = htmlOutput.trim(); 
}
