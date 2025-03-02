<script setup>
import { ref, defineEmits } from "vue";
import Loader from "./Loader.vue";

const emit = defineEmits(["login-success"]);

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const showLoader = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = () => {
  showLoader.value = true; // Show loader
  const validUsername = "cas";
  const validPassword = "cas";

  if (username.value === validUsername && password.value === validPassword) {
    localStorage.setItem("isAuthenticated", "true");


    setTimeout(() => {
      emit("login-success"); // Notify parent component
    }, 500);
  } else {
    alert("Credenciais inválidas!");
  }
  
  showLoader.value = false; // Hide loader
};
</script>

<template>
  <form @submit.prevent="handleSubmit" id="login">
    <Loader v-if="showLoader" />
    <div class="form-floating mb-3">
      <input v-model="username" class="form-control" type="text" name="username" placeholder="Usuário" required />
      <label class="form-label" for="username">Usuário</label>
    </div>
    <div class="form-floating mb-4 position-relative">
      <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control" name="password"
        placeholder="Senha" required />
      <label class="form-label" for="password">Senha</label>
      <i :class="showPassword ? 'bi-eye-fill' : 'bi-eye-slash'" id="showPassword" title="Exibir senha"
        @click="togglePassword"></i>
    </div>
    <div class="d-flex align-items-center gap-3">
      <button type="submit" class="btn btn-primary">Entrar</button>
    </div>
  </form>
</template>

<style scoped>
#showPassword {
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: calc(50% - .6rem);
  z-index: 1000;
}

#showPassword::before {
  font-size: 1.25rem;
}
</style>
