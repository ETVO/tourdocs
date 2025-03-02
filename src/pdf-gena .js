import { jsPDF } from "jspdf";


function getAspectRatio(dataURL) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Handle image load event
    img.onload = function () {
      const aspectRatio = img.width / img.height;
      resolve(aspectRatio);
    };

    // Handle error event
    img.onerror = function () {
      console.error('Failed to load image');
    };

    // Set the src to the dataURL
    img.src = dataURL;
  });
}

export default async function generatePDF(companyData, tripInformation, passengers) {
  // Destructure company data
  const {
    companyName,
    cnpj,
    telefone,
    isWhatsApp,
    address,
    logo,
  } = companyData;

  // Destructure trip information
  const {
    sheetNumber,
    transportMode,
    licensePlate,
    licenseCountry,
    leftFromCountry,
    enteredViaCountry,
    date,
    border,
    crewAmount,
    passengersAmount,
    driver,
    coordinator
  } = tripInformation;

  // Create an array for passengers (you can adjust as needed)
  const passengerList = passengers.map(passenger => {
    return {
      name: passenger.name,
      passport: passenger.passport
    };
  });

  // Fetch the HTML template
  const templateResponse = await fetch('./template.html');  // Replace with your actual path
  const templateText = await templateResponse.text();

  let logoW, logoH;

  // Get logo aspect ratio to display correctly
  await getAspectRatio(logo).then((aspectRatio) => {
    logoW = 100;
    logoH = logoW / aspectRatio;
    if (logoH > 150) {
      logoH = 150;
      logoW = logoH * aspectRatio;
    }
  });

  // Replace placeholders with the dynamic values
  let htmlContent = templateText
    .replace('{{logo}}', logo)  // Assuming logoPreview is a valid image URL
    .replace('{{logoW}}', logoW)  // Assuming logoPreview is a valid image URL
    .replace('{{logoH}}', logoH)  // Assuming logoPreview is a valid image URL
    .replace('{{companyName}}', companyName)
    .replace('{{cnpj}}', cnpj)
    .replace('{{telefone}}', telefone)
    .replace('{{whatsApp}}', isWhatsApp ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
</svg>` : '')
    .replace('{{address}}', address)
    .replace('{{sheetNumber}}', sheetNumber)
    .replace('{{transportMode}}', transportMode)
    .replace('{{licensePlate}}', licensePlate)
    .replace('{{licenseCountry}}', licenseCountry)
    .replace('{{leftFromCountry}}', leftFromCountry)
    .replace('{{enteredViaCountry}}', enteredViaCountry)
    .replace('{{date}}', date)
    .replace('{{border}}', border)
    .replace('{{crewAmount}}', crewAmount)
    .replace('{{passengersAmount}}', passengersAmount)
    .replace('{{driver}}', driver)
    .replace('{{coordinator}}', coordinator);

  // Passengers dynamic replacement
  let passengersHTML = '';
  passengerList.forEach(passenger => {
    passengersHTML += `<li>${passenger.name} - ${passenger.passport}</li>`;
  });
  htmlContent = htmlContent.replace('{{#each passengers}}', passengersHTML);

  // Now create the PDF from the updated HTML content
  const doc = new jsPDF('p', 'mm', 'a4', true);

  doc.line(10, 10, 10, 200)


  window.open(doc.output('bloburl')); // to debug
}