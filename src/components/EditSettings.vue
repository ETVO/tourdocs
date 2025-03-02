<script setup>
import { ref, onMounted, defineEmits, defineOptions } from 'vue';
import Loader from './Loader.vue';
import { openDatabase, saveCompanyData, getCompanyData } from '../db';

defineOptions({
  inheritAttrs: false
})

const emit = defineEmits(["login-success"])

const showLoader = ref(false);
const companyName = ref('');
const cnpj = ref('');
const telefone = ref('');
const isWhatsApp = ref(false);
const address = ref('');
const logoFile = ref(null);
const logoPreview = ref('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    logoFile.value = file;

    const reader = new FileReader();

    reader.onload = () => {
      logoPreview.value = reader.result;
    };

    reader.readAsDataURL(file);
  }
};

const saveData = async () => {
  showLoader.value = true;
  const db = await openDatabase();

  const companyData = {
    companyName: companyName.value,
    cnpj: cnpj.value,
    telefone: telefone.value,
    isWhatsApp: isWhatsApp.value,
    address: address.value,
    logo: logoPreview.value,
  };

  await saveCompanyData(db, companyData);
  setTimeout(() => {
    emit("save-success");
  }, 500);
};

const clearForm = (e) => {
  if (confirm('Tem certeza de que deseja limpar todos os dados do formulário?')) {
    companyName.value = '';
    cnpj.value = '';
    telefone.value = '';
    isWhatsApp.value = false;
    address.value = '';
    logoFile.value = null;
    logoPreview.value = '';
  }
};

// Load existing data
onMounted(async () => {
  const db = await openDatabase();
  const companyData = await getCompanyData(db);
  if (companyData) {
    companyName.value = companyData.companyName;
    cnpj.value = companyData.cnpj;
    telefone.value = companyData.telefone;
    isWhatsApp.value = companyData.isWhatsApp;
    address.value = companyData.address;
    logoPreview.value = companyData.logo;
  }
});
</script>

<template>
  <Loader v-if="showLoader" />
  <h1>Preencher Dados </h1>

  <form id="settingsForm" @submit.prevent="saveData" @reset.prevent="clearForm">
    <div class="form-floating mb-3">
      <input v-model="companyName" type="text" class="form-control" id="companyName" placeholder="Razão Social"
        required />
      <label for="companyName">Razão Social</label>
    </div>

    <div class="form-floating mb-3">
      <input v-model="cnpj" type="text" class="form-control" id="cnpj" placeholder="CNPJ" required />
      <label for="cnpj">CNPJ</label>
    </div>

    <div class="form-floating mb-3">
      <input v-model="telefone" type="text" class="form-control" id="telefone" placeholder="Telefone" required />
      <label for="telefone">Telefone</label>
    </div>

    <div class="form-check mb-3">
      <input type="checkbox" class="form-check-input" id="isWhatsApp" v-model="isWhatsApp" />
      <label class="form-check-label" for="isWhatsApp">Exibir ícone do WhatsApp?</label>
    </div>

    <div class="form-floating mb-3">
      <textarea v-model="address" type="text" class="form-control" id="address" placeholder="Endereço"
        required></textarea>
      <label for="address">Endereço</label>
    </div>

    <label for="logoFile" class="form-label mb-2">Logo</label>
    <div class="d-flex align-items-center gap-3">
      <div class="mb-3" v-if="logoPreview">
        <img :src="logoPreview" alt="Logo Preview" width="100" class="img-thumbnail" />
      </div>
      <div class="mb-3">
        <input type="file" class="form-control" id="logoFile" @change="handleFileUpload" accept="image/*" />
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-between gap-3">
      <div>
        <button type="submit" class="btn btn-primary me-2">Salvar</button>
        <button type="reset" class="btn btn-outline-secondary">Limpar</button>
      </div>
    </div>

  </form>
</template>