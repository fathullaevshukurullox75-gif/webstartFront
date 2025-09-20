<script setup lang="ts">
import { useCounterStore } from '@/stores/active'

const active = useCounterStore()
</script>

<template>
  <div class="home-container">
    <aside class="sidebar">
      <div class="logo">
        <router-link to="/home">
          <img class="w-75" src="@/assets/images/logo.png" alt=""  />
        </router-link>
      </div>

      <div class="slidebar_child">
        <ul class="menu">
          <li>
            <router-link 
              to="/home" 
              :class="{ 'active-link': active.active === 0 }"
              
            >
              <i class="fa-solid fa-house"></i>
            </router-link>
          </li>
          <li>
            <router-link to="/group" :class="{'active-link': active.active === 1}" >
              <i class="fa-solid fa-users"></i>
            </router-link>
          </li>
          <li>
            <router-link to="/course" :class="{'active-link': active.active === 2}">
              <i class="fa-solid fa-chalkboard-user"></i>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/attendance" 
              :class="{ 'active-link': active.active === 3 }"
              
            >
              <i class="fa-regular fa-calendar"></i>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/payme" 
              :class="{ 'active-link': active.active === 4 }"
             
            >
              <i class="fa-solid fa-money-bill-1-wave"></i>
            </router-link>
          </li>
        </ul>

        <button class="logout-button">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </aside>
  </div>
</template>
<style scoped>
.home-container {
  display: flex;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f9fafa;
}

/* Sidebar */
.sidebar {
  width: 220px;
  height: 100vh;
  color: black;
  padding: 20px;
  border-right: 1px solid green;
}

.slidebar_child {
  display: flex;
  height: 85%;
  flex-direction: column;
  justify-content: space-between;
}

.logout-button {
  width: 90%;
  margin: 0 auto;
  padding: 5px 10px;
  border-radius: 5px;
  background: none;
  border: 1px solid red;
  color: red;
  font-size: 20px;
  cursor: pointer;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.menu {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
}

.menu li {
  text-align: center;
  margin-bottom: 18px;
}

.menu a {
  text-decoration: none;
  color: black;
  font-size: 20px;
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu a:hover,
.menu .active-link {
  background: green;
  color: #fff;
}

/* 📱 Kichkina telefonlar (<=400px) */
@media (max-width: 400px) {
  .sidebar {
    width: 60px;
    padding: 10px;
  }

  .logo img {
    width: 100%;
  }

  .menu a {
    font-size: 14px;
    padding: 8px 6px;
  }

  .logout-button {
    font-size: 16px;
    padding: 5px;
  }
}

/* 📱 Telefon (401px - 768px) */
@media (min-width: 401px) and (max-width: 768px) {
  .sidebar {
    width: 80px;
    padding: 15px;
  }

  .logo img {
    width: 90%;
  }

  .menu a {
    font-size: 16px;
    padding: 8px;
  }

  .logout-button {
    font-size: 18px;
  }
}

/* 📱 Planshet (769px - 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 150px;
    padding: 18px;
  }

  .menu a {
    font-size: 18px;
    padding: 10px 12px;
  }
}

/* 🖥️ Katta ekranlar (>=1025px) */
@media (min-width: 1025px) {
  .sidebar {
    width: 220px;
  }
}
</style>

