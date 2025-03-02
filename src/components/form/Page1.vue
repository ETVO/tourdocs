<script setup>
import { ref, defineEmits } from "vue";
import EditSettings from '../EditSettings.vue';

const emit = defineEmits(["continue", "fetch-company-data"]);

const props = defineProps(["companyData"]);

const editSettings = ref(!props.companyData);

</script>

<template>
  <p class="lead"><b>1.</b> Por favor, {{ editSettings ? 'atualize' : 'verifique' }} os dados:</p>

  <div v-if="editSettings">
    <EditSettings @save-success="editSettings = false; emit('fetch-company-data')" />
  </div>
  <div v-else>
    <p><b>Razão Social:</b> {{ companyData.companyName }}</p>
    <p><b>CNPJ:</b> {{ companyData.cnpj }}</p>
    <p><b>Telefone:</b> {{ companyData.telefone }} <span v-if="companyData.isWhatsApp" class="ms-1 bi-whatsapp"></span></p>
    <p><b>Endereço:</b> {{ companyData.address }}</p>
    <p class="mb-5"><b class="me-3">Logo:</b><img width="100" :src="companyData.logo" alt="Logo" /></p>

    <div class="d-flex align-items-center gap-3">
      <button @click="emit('continue')" type="button" class="btn btn-primary">Continuar</button>
      <button @click="editSettings = true" type="button" class="btn">Atualizar dados</button>
    </div>
  </div>

</template>
