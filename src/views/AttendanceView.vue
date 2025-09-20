<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";


const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL + "/groups";

const groups = ref<any[]>([]);

const fetchGroups = async () => {
  try {
    const res = await axios.get(API_URL, {
      headers: { token: localStorage.getItem("token") },
    });
    groups.value = res.data;
  } catch (err: any) {
    if (err.response?.data?.message === "jwt expired") {
      useAuthStore().logout();
    } else {
      console.error("Failed to fetch groups", err);
    }
  }
};
const goToGroup = (id: string) => {
  router.push({ name: "onegroup", params: { id } });
};
onMounted(() => {
  fetchGroups();
});
</script>

<template>
  <div class="attendance-container">

    <div v-if="groups.length === 0" class="empty">
      <p>No groups found ❌</p>
    </div>

    <div class="group-list">
      <div class="group-card" v-for="g in groups" :key="g._id" @click="goToGroup(g._id)">
        <h3>{{ g.groupName }}</h3>
        <p><strong>Teacher:</strong> {{ g.teacher?.username || "—" }}</p>
        <p><strong>Course:</strong> {{ g.course?.title || "—" }}</p>
        <p><strong>Students:</strong> {{ g.students?.length || 0 }}</p>
        <p><strong>Status:</strong> 
          <span :class="['badge', g.status]">{{ g.status }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attendance-container {
  margin: 30px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
}



.group-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.group-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #c8e6c9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.group-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.group-card h3 {
  margin-bottom: 10px;
  color: #2e7d32;
  font-weight: 600;
}

.group-card p {
  margin: 6px 0;
  font-size: 14px;
  color: #444;
}

.badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

.badge.active {
  background: #2e7d32;
}
.badge.inactive {
  background: #757575;
}
.badge.archived {
  background: #fbc02d;
  color: #333;
}

.empty {
  text-align: center;
  color: #777;
  font-style: italic;
}
</style>
