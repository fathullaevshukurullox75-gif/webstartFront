<script setup lang="ts">
import { ref } from "vue";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar as BarChart } from "vue-chartjs";

interface HomeItem {
  name: string;
  path: string;
  active: number;
  icon: string;
}

const homeCom = ref<HomeItem[]>([
  { name: "Home", path: "/home", active: 0, icon: "fa-solid fa-house" },
  { name: "Group", path: "/group", active: 1, icon: "fa-solid fa-users" },
  { name: "Course", path: "/course", active: 2, icon: "fa-solid fa-chalkboard-teacher" },
  { name: "attendance", path: "/attendance", active: 3, icon: "fa-solid fa-calendar-check" },
  { name: "Payme", path: "/payme", active: 4, icon: "fa-solid fa-money-bill" },
  { name: "Teacher", path: "/teacher", active: 5, icon: "fa-solid fa-chalkboard-teacher" },
  { name: "Users", path: "/users", active: 6, icon: "fa-solid fa-users" }
]);

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = {
  labels: ["Yanvar", "Fevral", "Mart","Aprel","May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
  datasets: [
    {
      label: "Kelganlar",
      backgroundColor: "green",
      data: [120, 110, 130,140,150,160,170,180,190,200,210,220],
    },
    {
      label: "Kelmaganlar",
      backgroundColor: "red",
      data: [15, 20, 10, 5, 25, 30, 20, 15, 10, 5, 0, 10],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};
</script>

<template>
  <div class="container">
    <ul class="list-unstyled d-flex flex-wrap gap-2 align-items-center ">
      <li 
        v-for="item in homeCom" 
        :key="item.active" 
        class="list-item"
      >
        <router-link :to="item.path">
          <i :class=" item.icon"></i><p> {{ item.name }}</p>
        </router-link>
      </li>
      <li>
        <div class="list-item">
          <a href="#">
            <i class="fa-solid fa-box"></i>
            <p>Add collection</p>
          </a>
        </div>
      </li>

      <li v-if="homeCom.length === 0">
        No components available.
      </li>
    </ul>
      <div class="d-none d-sm-block">
        <BarChart :data="chartData" :options="chartOptions" />
      </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.list-item {
  width: 300px;
  height: 150px;   
  margin: 10px 0;
  border: 2px solid green;
  text-align: center;
  border-radius: 10px;  
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.list-item a {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: green;
  font-size: 30px;
  padding: 20px;
  transition: all 0.3s ease;
}

.list-item a:hover {
  text-decoration: underline;
  background: green;
  color: white;
  box-shadow: 0 0 10px green;
}

/* 📱 Telefonlar uchun */
@media (max-width: 576px) {
  .list-item {
    width: 100%;         /* to‘liq eni oladi */
    height: 120px;
    font-size: 18px;
  }

  .list-item a {
    font-size: 20px;
    padding: 10px;
  }
}

/* 📱 Planshet (o‘rtacha ekranlar) */
@media (min-width: 577px) and (max-width: 992px) {
  .list-item {
    width: 45%;          /* yonma-yon ikkita joylashadi */
    height: 140px;
  }

  .list-item a {
    font-size: 22px;
    padding: 15px;
  }
}

/* 🖥️ Katta ekranlar */
@media (min-width: 993px) {
  .list-item {
    width: 300px;         /* asl kattaligi */
    height: 150px;
  }
}
</style>
