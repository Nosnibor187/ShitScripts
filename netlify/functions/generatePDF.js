const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { script } = JSON.parse(event.body);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Load logo from public URL or hosted asset
    const logoUrl = 'https://shitscripts.com/shitscriptslogo.png'; // Must be hosted!
    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(logoBytes);
    const pngDims = pngImage.scale(0.25);

    // Add watermark image
    page.drawImage(pngImage, {
      x: width / 2 - pngDims.width / 2,
      y: height / 2 - pngDims.height / 2,
      width: pngDims.width,
      height: pngDims.height,
      opacity: 0.1,
    });

    // Add script text
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    const fontSize = 12;
    const margin = 40;
    const lines = script.split('\n');
    let y = height - margin;

    for (let line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 4;
    }

    const pdfBytes = await pdfDoc.save();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="shitscript.pdf"',
      },
      body: Buffer.from(pdfBytes).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error("PDF generation error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate PDF.' }),
    };
  }
};