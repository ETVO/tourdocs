<script setup>
import { toRefs } from 'vue';

const emit = defineEmits(['continue', 'back']);

const props = defineProps(['tripInformation']);

const { sheetNumber,
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
} = toRefs(props.tripInformation);

// Handle form submission
const handleSubmit = (e) => {
  const form = e.target;
  if (!form.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
  }
  else {
    emit('continue', {
    sheetNumber: sheetNumber.value,
    transportMode: transportMode.value,
    licensePlate: licensePlate.value,
    licenseCountry: licenseCountry.value,
    leftFromCountry: leftFromCountry.value,
    enteredViaCountry: enteredViaCountry.value,
    date: date.value,
    border: border.value,
    crewAmount: crewAmount.value,
    passengersAmount: passengersAmount.value,
    driver: driver.value,
    coordinator: coordinator.value
  })
  }
  // TODO add else back
  form.classList.add('was-validated');
};

</script>

<template>
  <p class="lead"><b>1.</b> Por favor, preencha os dados da viagem:</p>
  <form @submit.prevent="handleSubmit" novalidate>
    <div class="form-floating mb-3">
      <input class="form-control" type="text" v-model="sheetNumber" name="sheetNumber" placeholder="Folha Nº"
        required />
      <label class="form-label" for="sheetNumber">Folha Nº</label>
    </div>

    <div class="form-floating mb-3">
      <input class="form-control" type="text" v-model="transportMode" name="transportMode"
        placeholder="Meio de transporte" required />
      <label class="form-label" for="transportMode">Meio de transporte</label>
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text">Placa</span>
      <input class="form-control" type="text" v-model="licensePlate" name="licensePlate" placeholder="Matrícula"
        required />
      <input class="form-control" type="text" v-model="licenseCountry" name="licenseCountry" placeholder="País"
        required />
    </div>

    <div class="form-floating mb-3">
      <input class="form-control" type="text" v-model="leftFromCountry" name="leftFromCountry"
        placeholder="Saiu de (País)" required />
      <label class="form-label" for="leftFromCountry">Saiu de (País)</label>
    </div>

    <div class="form-floating mb-3">
      <input class="form-control" type="text" v-model="enteredViaCountry" name="enteredViaCountry"
        placeholder="Entrou por (País)" required />
      <label class="form-label" for="enteredViaCountry">Entrou por (País)</label>
    </div>

    <div class="form-floating mb-3">
      <input class="form-control" type="date" v-model="date" name="date" placeholder="Data" required />
      <label class="form-label" for="date">Data</label>
    </div>

    <div class="form-floating mb-3">
      <input class="form-control" type="text" v-model="border" name="border" placeholder="Passagem de Fronteira"
        required />
      <label class="form-label" for="border">Passagem de Fronteira</label>
    </div>

    <div class="row mb-3 g-3">
      <div class="col">
        <div class="form-floating">
          <input class="form-control" type="number" v-model="crewAmount" name="crewAmount"
            placeholder="Nº de Tripulantes" min="1" step="1" required />
          <label class="form-label" for="crewAmount">Nº de Tripulantes</label>
          <div class="invalid-feedback">O número mínimo de tripulantes é 1.</div>
        </div>
      </div>
      <div class="col">
        <div class="form-floating">
          <input class="form-control" type="number" v-model="passengersAmount" name="passengersAmount"
            placeholder="Nº de Passageiros" min="1" max="12" step="1" required />
          <label class="form-label" for="passengersAmount">Nº de Passageiros</label>
          <div class="invalid-feedback">O número deve estar entre 1 e 12.</div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="special-in">Responsável</h4>
      <div class="form-floating mb-2">
        <input class="form-control" type="text" v-model="driver" name="driver" placeholder="Condutor" required />
        <label class="form-label" for="driver">Condutor</label>
      </div>

      <div class="form-floating">
        <input class="form-control" type="text" v-model="coordinator" name="coordinator" placeholder="Coordenador" />
        <label class="form-label" for="coordinator">Coordenador</label>
        <small class="form-text">(Caso fique em branco, será utilizado o nome do Condutor)</small>
      </div>
    </div>

    <div class="d-flex align-items-center gap-3 pt-2">
      <button type="submit" class="btn btn-primary">Continuar</button>
      <button @click="emit('back')" type="button" class="btn">Voltar</button>
    </div>
  </form>
</template>
