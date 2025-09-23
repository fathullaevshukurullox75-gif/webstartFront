<script setup lang="ts"></script>

<template>
  <div class="payment-container">
    <div class="card">
      <h2 class="title">Payment Page</h2>
      <p class="message">Ushbu sahifada hozirda ishlar olib borilmoqda...</p>
      <div class="loader"></div>
      <router-link to="/home" class="mt-5"><i class="fa-solid fa-arrow-left"></i> back home</router-link>
    </div>
  </div>
</template>

<style scoped>
.payment-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  background: linear-gradient(135deg, green 0%, white 100%);
}

.card {
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 0   px 18px white;
  max-width: 400px;
  width: 100%;
}

.title {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

.message {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2575fc;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
