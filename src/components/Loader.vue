<script setup>
const {showLoader} = defineProps(["showLoader"]);
</script>

<template>
  <div class="loader">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>