<script setup lang="ts">
import { useRoute } from "vue-router";

import { computed } from "vue"
import Navbar from "@/components/Navbar.vue"

const route = useRoute()

// reactive qilib olish
const lastSegment = computed(() => {
  const segments = route.path.split("/").filter(Boolean) // bo‘sh stringlarni olib tashlaymiz
  if (route.path.startsWith("/group/")) {
    return "one-group"
  }
  return segments.pop() || ""
})
</script>
<template>
    <div class="row m-0 p-0">
        <div class="col-2 col-sm-3 col-md-2 col-lg-1 m-0 p-0">
            <Navbar />
        </div>
        <div class="col-10 col-sm-9 col-md-10 col-lg-11 m-0 p-0">
            <div class="content-area">
                <h1>{{ lastSegment?.charAt(0).toUpperCase() + lastSegment?.slice(1) }} page</h1>
               <div class="d-flex align-items-center w-25">
                 <input type="search" placeholder="Search..." class="form-control w-100 d-none d-sm-block" />
                <div class="profile-icon ms-3">
                    <i class="fa-solid fa-user"></i>
                </div>
               </div>
            </div>
            <div  style="height: 90vh; overflow-y: auto;">
                <router-view />
            </div>
        </div>
    </div>
</template>
<style scoped>
.content-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  width: 100%;
  height: 10%;
  background: #fff;
  border-bottom: 1px solid green;
}

.profile-icon {
  padding: 10px;
  background: green;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
}

/* 📱 Telefonlar uchun */
@media (max-width: 768px) {
  .row {
    flex-direction: row; /* Doim yonma-yon bo‘ladi */
  }

  .col-sm-3,
  .col-md-2,
  .col-lg-1 {
    width: 70px !important; /* Navbar kichrayadi */
  }

  .col-sm-9,
  .col-md-10,
  .col-lg-11 {
    width: calc(100% - 70px) !important; /* Router-view qolgan joyni oladi */
  }

  .content-area {
    align-items: flex-start;
    height: auto;
    gap: 10px;
  }

  .content-area h1 {
    font-size: 18px;
  }

  .d-flex {
    width: 100% !important;
  }

  .profile-icon {
    margin-left: auto;
  }
}

/* 🖥️ Planshet va katta ekranlar uchun */
@media (min-width: 769px) {
  .row {
    flex-direction: row; /* Yonma-yon */
  }

  .col-sm-3,
  .col-md-2,
  .col-lg-1 {
    width: 100px !important; /* Navbar kengroq */
  }

  .col-sm-9,
  .col-md-10,
  .col-lg-11 {
    width: calc(100% - 100px) !important;
  }

  .content-area h1 {
    font-size: 24px;
  }

  .d-flex {
    width: 50% !important;
  }
}
</style>

