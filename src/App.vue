<script setup lang="ts">
import Login from './views/Login.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ref } from 'vue';
import { useAuthStore } from './stores/auth';
import HomeView from './views/HomeView.vue';


const auth = useAuthStore()
</script>
<template>
  <HomeView v-if="auth.user"/> 
  <Login v-else />
</template>
<style>
body{
  margin : 0;
  padding: 0;
  box-sizing: border-box;
}
</style>