<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['continue', 'back']);

const props = defineProps(['passengersAmount', 'passengers']);

const passengers = ref(props.passengers);

const removePassenger = (index, surpassConfirm) => {
  if (!surpassConfirm && (passengers.value[index].fullName !== ''
    || passengers.value[index].birthDate !== ''
    || passengers.value[index].nationality !== ''
    || passengers.value[index].idNumber !== '')) {
    if (!confirm('Tem certeza que deseja remover este passageiro?')) {
      return;
    }
  }
  passengers.value.splice(index, 1);
};

const addPassenger = () => {
  passengers.value.push({
    fullName: '',
    birthDate: '',
    nationality: '',
    idType: '',
    idNumber: ''
  });
};

onMounted(() => {
  for (let i = 0; i < props.passengersAmount; i++) {
    if (!passengers.value[i]) {
      addPassenger();
    }
  }

  if (passengers.value.length > props.passengersAmount) {
    if (confirm("Com o novo valor, alguns passageiros serão removidos. Deseja continuar?")) {
      while (passengers.value.length > props.passengersAmount) {
        removePassenger(passengers.value.length - 1, true);
      }
    }
  }
});


// Handle form submission
const handleSubmit = (e) => {
  const form = e.target;
  if (!form.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
  }
  else {
    emit('continue', passengers.value)
  }

  form.classList.add('was-validated');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>

    <p class="lead"><b>3.</b> Por favor, preencha os dados dos passageiros:</p>
    <div class="pt-3 my-3">
    </div>
    <div class="wide-table">
      <div class="table-responsive">
        <table class="table" style="width: 1000px;">
          <thead>
            <tr>
              <th>Nº</th>
              <th style="width: 40%;">Nome Completo</th>
              <th style="width: 11%;">Data de Nascimento</th>
              <th style="width: 11%;">Nacionalidade</th>
              <th style="width: 35%;">Identificação</th>
              <th style="width: 3%;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(passenger, i) in passengers" :key="i">
              <td style="vertical-align: middle;">{{ i + 1 }}</td>
              <td title="Nome Completo">
                <input class="form-control" type="text" v-model="passenger.fullName" required />
              </td>
              <td title="Data de Nascimento">
                <input class="form-control" type="date" v-model="passenger.birthDate" required />
              </td>
              <td title="Nacionalidade">
                <input class="form-control" type="text" v-model="passenger.nationality" required />
              </td>
              <td title="Identificação">
                <div class="input-group" style="align-items: unset;">
                  <input class="form-control" type="text" v-model="passenger.idType" placeholder="Tipo"
                    style="flex: 0 0 25%;" />
                  <input class="form-control" type="text" v-model="passenger.idNumber" placeholder="Nº" required />
                </div>
              </td>
              <td title="Remover passageiro">
                <button @click="removePassenger(i)" type="button" class="bi-person-dash text-danger btn"></button>
              </td>
            </tr>
            <tr class="table-light" style="cursor: pointer; user-select: none;" @dblclick="addPassenger"
              title="Adicionar passageiro">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td title="Adicionar passageiro">
                <button @click="addPassenger" type="button" class="bi-person-plus-fill text-success btn"></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-flex align-items-center gap-3 pt-2">
      <button type="submit" class="btn btn-primary">Continuar</button>
      <button @click="emit('back', passengers)" type="button" class="btn">Voltar</button>
    </div>
  </form>
</template>