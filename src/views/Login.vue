<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const isLoading = ref<boolean>(false)
const VITE_API_URL = import.meta.env.VITE_API_URL;
const email = ref<string>("");
const password = ref<string>("");
interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

const handleLogin = async () => {
  try {
    isLoading.value = true;
    const res = await axios.post<LoginResponse>(`${VITE_API_URL}/auth/login`, {
      email: email.value,
      password: password.value,
    });

    // user va tokenni saqlash
    useAuthStore().setUser(res.data.user, res.data.token);
    isLoading.value = false;

    router.push("/home");
  } catch (err: any) {
    isLoading.value = false;
    alert(err.response?.data?.message || "Login xatosi!");
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Log in</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Email"
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Password"
          />
        </div>
        <button disabled v-if="isLoading" class="login-btn loading">Loading...</button>
        <button v-else type="submit" class="login-btn">Log in</button>
      </form>
    </div>
  </div>
</template>


<style scoped>
.login-container {
    width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #c6f6d5, #81e6d9);
}
.loading{
  background-color: #38a169b1;
}
.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

.login-card h2 {
  margin-bottom: 1.5rem;
  color: #2f855a;
}

.input-group {
  text-align: left;
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #2d3748;
}

.input-group input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

.input-group input:focus {
  border-color: #38a169;
  box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.3);
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #38a169;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}

.login-btn:hover {
  background-color: #2f855a;
}
</style>
