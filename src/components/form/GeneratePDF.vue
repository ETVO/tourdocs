<script setup>
import { ref, reactive, onMounted, defineEmits } from "vue";
import Page1 from "./Page1.vue";
import Page2 from "./Page2.vue";
import Page3 from "./Page3.vue";
import Page4 from "./Page4.vue";
import Loader from "../Loader.vue";
import { openDatabase, getCompanyData } from '../../db';
import { getAspectRatio } from "../../pdf-gen";
import jsPDF from "jspdf";

const emit = defineEmits(["no-basic-data"]);

const showLoader = ref(false);

const companyData = reactive({});

const tripInformation = reactive({
  sheetNumber: 50,
  transportMode: "Ônibus",
  licensePlate: "ABC-1234",
  licenseCountry: "Brasil",
  leftFromCountry: "Argentina",
  enteredViaCountry: "Brasil",
  date: "2024-03-01",
  border: "Fronteira Sul",
  crewAmount: 2,
  passengersAmount: 4,
  driver: "João Silva",
  coordinator: "Maria Oliveira",
});

const passengers = ref([]);

const page = ref(3);

const pdfContent = ref(null);

const logoW = ref(null);
const logoH = ref(null);

const fetchCompanyData = async () => {
  const db = await openDatabase();
  const data = await getCompanyData(db);
  if (data) {
    Object.assign(companyData, data);

    // Get logo aspect ratio to display correctly
    await getAspectRatio(companyData.logo).then((aspectRatio) => {
      logoW.value = 125;
      logoH.value = logoW.value / aspectRatio;
      if (logoH.value > 150) {
        logoH.value = 150;
        logoW.value = logoH.value * aspectRatio;
      }
    });
  }
  else {
    emit("no-basic-data");
  }
}

// Check IndexedDB for saved data
onMounted(fetchCompanyData);

const updateTripInformation = (newTripInformation) => {
  if (tripInformation.passengersAmount !== newTripInformation.passengersAmount) {
    passengers.value = [];
  }
  Object.assign(tripInformation, newTripInformation);
  page.value++;
}

const updatePassengers = (newPassengers, movePage = 1) => {
  passengers.value = newPassengers;
  tripInformation.passengersAmount = newPassengers.length;
  page.value += movePage;
}

function formatDate(date) {
  date = new Date(date);
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month (month starts at 0)
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const callGeneratePDF = async () => {
  showLoader.value = true;

  const doc = new jsPDF('portrait', 'px', 'a4', true, true, 10);
  var width = doc.internal.pageSize.getWidth();

  console.log(doc.getFontList());

  // Capture the HTML content from the template and generate a PDF
  doc.html(pdfContent.value, {
    callback: function (doc) {
      window.open(doc.output('bloburl'));
      showLoader.value = false;
    },
    x: 0,
    y: 0,
    width: width - 32,
    windowWidth: 1000,
    margin: [16, 16],
  });
}
</script>

<template>
  <Loader v-if="showLoader" />
  <h1 class="mb-3">Gerador de PDF</h1>
  <div v-if="page === 1">
    <Page1 :company-data="companyData" @continue="page++" @fetch-company-data="fetchCompanyData" />
  </div>
  <div v-if="page === 2">
    <Page2 :trip-information="tripInformation" @back="page--" @continue="updateTripInformation" />
  </div>
  <div v-if="page === 3">
    <Page3 :passengers-amount="tripInformation.passengersAmount" :passengers="passengers"
      @back="(newPassengers) => updatePassengers(newPassengers, -1)" @continue="updatePassengers" />
  </div>
  <div v-if="page === 4">
    <Page4 @back="page--" @continue="callGeneratePDF" />
    <div id="pdfcontentwrapper" class="pt-5">
      <div ref="pdfContent" id="pdfcontent">
        <div id="header" class="d-flex gap-2">
          <div id="logo">
            <img :src="companyData.logo">
          </div>
          <div id="companyInformation">
            <div id="companyName">{{ companyData.companyName }}</div>
            <div id="cnpj">{{ companyData.cnpj }}</div>
            <div id="telefone"><b>{{ companyData.telefone }}</b> <img v-if="companyData.isWhatsApp" src="/whatsapp.png"></div>
            <div id="address">{{ companyData.address }}</div>
          </div>
          <div class="d-flex flex-column align-items-center">
            <div class="d-flex gap-4">
              <img src="/T.png" alt="" width="50" height="50">
              <div style="text-align: center">
                <b style="display: block;">
                  MINISTERIO DEL INTERIOR<br>DIRECCIÓN NACIONAL DE MIGRACIONES
                </b>
                <span>ANEXO II Resolución 2997/85</span>
              </div>
            </div>
            <div id="sheetNumber">
              <small>HOJA Nº:</small> {{ tripInformation.sheetNumber }}
            </div>
          </div>
        </div>
        <div id="mainTitle">
          MANIFESTO DE TRANSPORTE DE PASAJEROS EXCLUSIVO CORREDOR TURISTICO
        </div>
        <div id="tripInformation">
          <table>
            <tr>
              <td rowspan="2">
                <small>Medio de Transporte:</small>
                <br>{{ tripInformation.transportMode }}
              </td>
              <td rowspan="2">
                <small>Matrícula:</small> {{ tripInformation.licensePlate }}
                <br>
                <small>País:</small> {{ tripInformation.licenseCountry }}
              </td>
              <td rowspan="2">
                <small>Sallio de (País):</small>
                <br>{{ tripInformation.leftFromCountry }}
              </td>
              <td rowspan="2">
                <small>Entro por (País):</small>
                <br>{{ tripInformation.enteredViaCountry }}
              </td>
              <td class="text-center usoOficial" style="height: 30px;">
                Nº MANIFESTO
              </td>
            </tr>

            <tr>
              <td>

              </td>
            </tr>
            <tr>
              <td>
                <small>CON FECHA:</small>
                <br>{{ formatDate(tripInformation.date) }}
              </td>
              <td colspan="2">
                <small>Paso Fronteirizo:</small>
                <br>{{ tripInformation.border }}
              </td>
              <td>
                <small class="text-uppercase">Tripulantes:</small> {{ tripInformation.crewAmount }}
                <br>
                <small class="text-uppercase">Pasajeros:</small> {{ tripInformation.passengersAmount }}
              </td>
              <td class="text-center usoOficial" rowspan="2">
                USO OFICIAL
                <br><img src="/arrow.png" class="mt-2" width="40px">
              </td>
            </tr>

            <tr>
              <td colspan="4" class="fw-bold text-center" style="font-size: 17.6px">
                RESPONSABLE
              </td>
            </tr>

            <tr>
              <td colspan="4"><small>CONDUCTOR:</small> {{ tripInformation.driver }}</td>
              <td class="text-center"><small class="smaller">Certificacion Migratoria</small></td>
            </tr>
            <tr>
              <td colspan="4"><small>COORDENADOR:</small> {{ tripInformation.coordinator }}</td>
              <td></td>
            </tr>
          </table>
          <table id="passengersTable">
            <tr class="headings">
              <td style="width: 20px">Nº</td>
              <td>APELLIDO Y NOMBRE &nbsp;&nbsp;&nbsp;PASAJEROS</td>
              <td>Fecha Nacimiento</td>
              <td>Nacionalidad</td>
              <td>Tipo Y Nº de Doc.</td>
              <td class="usoOficial"></td>
            </tr>

            <tr v-for="(passenger, i) of passengers">
              <td>{{ i + 1 }}</td>
              <td>{{ passenger.fullName }}</td>
              <td>{{ formatDate(passenger.birthDate) }}</td>
              <td>{{ passenger.nationality }}</td>
              <td>{{ passenger.idType + (passenger.idType ? ' - ' : '') + passenger.idNumber }}</td>
              <td></td>
            </tr>
          </table>
          <table id="footerTable">
            <tr>
              <td style="width: 400px">Firma y sello Responsable del transporte</td>
              <td>Operador</td>
              <td>Firma y aclaración<br>INSPECTOR</td>
              <td>SELLO DE<br>CONTROL</td>
              <td rowspan="2" class="vertical-text" style="border-top: solid 3px black;">
                E<br>
                N<br>
                T<br>
                R<br>
                A<br>
                D<br>
                A<br>
              </td>
            </tr>
            <tr class="empty">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Firma y sello Responsable del transporte</td>
              <td>Operador</td>
              <td>Firma y aclaración<br>INSPECTOR</td>
              <td>SELLO DE<br>CONTROL</td>
              <td rowspan="2" class="vertical-text">
                S<br>
                A<br>
                L<br>
                I<br>
                D<br>
                A<br>
              </td>
            </tr>
            <tr class="empty">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
