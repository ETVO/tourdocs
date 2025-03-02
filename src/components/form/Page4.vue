<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["continue", "back"]);

</script>

<template>
  <!-- <p class="lead"><b>4.</b> Por favor, revise os termos de privacidade</p>
  <div>
    <p>Nosso sistema foi desenvolvido para gerar documentos PDF a partir dos dados fornecidos pelo usuário. Garantimos que nenhuma informação inserida é armazenada em servidores ou na nuvem.</p>
    
    <h2>Responsabilidade do Usuário</h2>
    <p>O usuário é o único responsável pelos dados inseridos no sistema, incluindo informações de terceiros. Certifique-se de obter as devidas autorizações antes de processar qualquer dado sensível.</p>
    
    <h2>Uso de Dados</h2>
    <p>Os dados fornecidos são utilizados exclusivamente para a geração dos documentos. Nenhuma informação é retida ou compartilhada.</p>
    
    <h2>Segurança</h2>
    <p>Recomendamos que o usuário tome as devidas precauções para proteger suas informações, incluindo a exclusão dos arquivos gerados após o uso, caso necessário.</p>
    
    <p>Ao utilizar o sistema, você concorda com estes termos e compreende que a privacidade e segurança dos dados inseridos são de sua responsabilidade.</p> -->


    <div class="d-flex align-items-center gap-3">
      <button @click="emit('continue')" type="button" class="btn btn-primary">Gerar PDF</button>
      <button @click="emit('back')" type="button" class="btn">Voltar</button>
    </div>
  <!-- </div> -->

</template>
