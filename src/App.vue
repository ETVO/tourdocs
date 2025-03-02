<script setup>
import { ref, onMounted } from "vue";
import Login from "./components/Login.vue";
import EditSettings from "./components/EditSettings.vue";
import GeneratePDF from "./components/form/GeneratePDF.vue";
import { openDatabase, getCompanyData } from './db.js';

const isAuthenticated = ref(localStorage.getItem("isAuthenticated") === "true");
const editSettings = ref(false);
const generatePDF = ref(false);
const basicDataReady = ref(false);

const logout = () => {
  if (confirm("Deseja realmente sair?")) {
    localStorage.removeItem("isAuthenticated");
    isAuthenticated.value = false;
  }
};

const backHome = () => {
  if (isAuthenticated.value && generatePDF.value) {
    if (!confirm("Tem certeza de que deseja voltar ao início? Perderá as alterações realizadas.")) return;
  }

  editSettings.value = false;
  generatePDF.value = false;
};

// Check IndexedDB for saved data
onMounted(async () => {
  const db = await openDatabase();
  const companyData = await getCompanyData(db);
  basicDataReady.value = !!companyData;
});
</script>

<template>
  <div class="container py-3" id="mainContainer">

    <header class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 @click="backHome">tourdocs</h1>
        <p class="mb-0">Gerador de documentos.</p>
      </div>
      <div>
        <button v-if="isAuthenticated" @click="logout" title="Sair" class="btn btn-outline-danger" id="logoutBtn">
          <i class="bi-box-arrow-right me-2"></i>
          <span>Sair</span>
        </button>
      </div>
    </header>

    <div class="content">
      <div id="something" v-if="!generatePDF && !editSettings"></div>
      <div v-if="isAuthenticated">

        <div v-if="generatePDF">
          <GeneratePDF />
        </div>
        <div v-else-if="editSettings">
          <EditSettings @save-success="editSettings = false; basicDataReady = true" />
        </div>
        <div v-else class="d-flex flex-column gap-3">
          <button @click="editSettings = true" class="btn btn-primary">
            {{ basicDataReady ? "Alterar" : "Preencher" }} Dados
          </button>
          <button @click="generatePDF = true" :class="'btn btn-outline-primary ' + (basicDataReady ? '' : 'disabled')"
            id="generatePdfBtn" :title="basicDataReady ? '' : 'Preencha os dados da empresa para gerar o PDF'">
            Gerar PDF
          </button>
        </div>
      </div>
      <div v-else>
        <Login @login-success="isAuthenticated = true" />
      </div>

    </div>

    <footer>
      <a href="https://etvo-web.com" target="_blank">desenvolvido. por etvo.</a>
    </footer>
  </div>
</template>

<style scoped>
form {
  padding-bottom: 4rem;
}
</style>
