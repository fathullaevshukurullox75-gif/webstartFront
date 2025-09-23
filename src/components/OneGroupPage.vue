<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const groupId = route.params.id as string;
const {user} = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL + "/groups";
const ATTENDANCE_API = import.meta.env.VITE_API_URL + "/attandanse";

const group = ref<any>(null);
const loading = ref(true);
const error = ref("");

const selectedDate = ref(new Date().toISOString().slice(0, 10));
const attendance = ref<Record<string, string>>({});
const saving = ref(false);

const fetchGroup = async () => {
  try {
    const res = await axios.get(`${API_URL}/${groupId}`, {
      headers: { token: localStorage.getItem("token") },
    });
    group.value = res.data;
    await fetchAttendance();
  } catch (err: any) {
    if (err.response?.data?.message === "jwt expired") {
      useAuthStore().logout();
    } else {
      error.value = "Guruhni olishda xato";
    }
  } finally {
    loading.value = false;
  }
};

// Davomatni olish
const fetchAttendance = async () => {
  try {
    const res = await axios.get(
      `${ATTENDANCE_API}?group=${groupId}&date=${selectedDate.value}`,
      { headers: { token: localStorage.getItem("token") } }
    );

    attendance.value = {};
    group.value.students.forEach((s: any) => {
      const record = res.data.find((r: any) =>
        typeof r.student === "string"
          ? r.student === s._id
          : r.student._id === s._id
      );
      attendance.value[s._id] = record ? record.status : "absent"; 
    });
  } catch (err) {
    console.error("Fetch attendance error", err);
    attendance.value = {};
  }
};

// Davomatni saqlash
const saveAttendance = async () => {
    if((user.role !== "admin" && user.role !== "superadmin") && selectedDate.value < new Date().toISOString().slice(0,10)){
    return alert("Faqat admin yoki superadmin oldingi sanani o'zgartira oladi!");
    } else if(selectedDate.value > new Date().toISOString().slice(0, 10)){
    return alert("Siz faqat bugungi davomatni qila olasiz!");
    }

  try {
    saving.value = true;
    await axios.post(
      ATTENDANCE_API,
      {
        group: groupId,
        date: selectedDate.value,
        records: Object.entries(attendance.value).map(([studentId, status]) => ({
          student: studentId,
          status,
        })),
      },
      { headers: { token: localStorage.getItem("token") } }
    );
    alert("✅ Davomat saqlandi!");
  } catch (err: any) {
    console.error("Failed to save attendance", err);
    alert(err.response?.data?.message || "❌ Davomatni saqlashda xato");
  } finally {
    saving.value = false;
  }
};

onMounted(fetchGroup);
</script>


<template>
  <div class="container">
    <div v-if="loading" class="loading"> Yuklanmoqda...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="group-card">
      <h2>{{ group.groupName }} </h2>
      <p class="meta">
         O‘qituvchi: <strong>{{ group.teacher?.username }}</strong> | Kurs:
        <strong>{{ group.course?.title }}</strong>
      </p>

      <div class="date-picker">
        <label>Sana:</label>
        <input type="date" v-model="selectedDate" @change="fetchAttendance" />
      </div>

      <div class="attendance-section">
        <table class="attendance-table">
          <thead>
            <tr>
              <th>Talaba</th>
              <th>Holat</th>
              <th>Tanlash</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in group.students" :key="s._id">
              <td class="student-name">{{ s.username }}</td>
              <td>
                <span
                  :class="[
                    'status',
                    attendance[s._id] === 'present'
                      ? 'present'
                      : attendance[s._id] === 'late'
                      ? 'late'
                      : 'absent'
                  ]"
                >
                  {{ attendance[s._id] }}
                </span>
              </td>
              <td>
                <button
                  class="btn present-btn"
                  @click="attendance[s._id] = 'present'"
                  :disabled="attendance[s._id] === 'present'"
                >
                  ✅
                </button>
                <button
                  class="btn absent-btn"
                  @click="attendance[s._id] = 'absent'"
                  :disabled="attendance[s._id] === 'absent'"
                >
                  ❌
                </button>
                <button
                  class="btn late-btn"
                  @click="attendance[s._id] = 'late'"
                  :disabled="attendance[s._id] === 'late'"
                >
                  ⏰
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Saqlash tugmasi -->
      <button class="save-btn" @click="saveAttendance" :disabled="saving">
         Saqlash
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 30px auto;
  padding: 20px;
  font-family: "Segoe UI", sans-serif;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #555;
}

.error {
  color: #d32f2f;
  background: #fdecea;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
}

.group-card {
  background: #fff;
  padding: 28px;
  border-radius: 16px;
  text-align: center;;
}

.group-card h2 {
  margin: 0 0 10px;
  font-size: 28px;
  color: #2e7d32;
}

.meta {
  margin-bottom: 20px;
  font-size: 15px;
  color: #555;
}

.date-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.date-picker input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.attendance-section {
  overflow-x: auto;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.attendance-table th,
.attendance-table td {
  border: 1px solid #eee;
  padding: 12px;
  text-align: center;
}

.attendance-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.student-name {
  text-align: left;
  font-weight: 500;
}

.status {
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: capitalize;
}

.present {
  color: #2e7d32;
  background: #e8f5e9;
}

.absent {
  color: #c62828;
  background: #ffebee;
}

.late {
  color: #ef6c00;
  background: #fff3e0;
}

.btn {
  margin: 0 3px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.present-btn {
  background: #4caf50;
  color: white;
}

.absent-btn {
  background: #e53935;
  color: white;
}

.late-btn {
  background: #fb8c00;
  color: white;
}

.btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-btn {
  width: 100%;
  padding: 14px;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: 0.3s;
}

.save-btn:hover:not(:disabled) {
  background: #1b5e20;
}

.save-btn:disabled {
  background: #9e9e9e;
  cursor: not-allowed;
}
/* === Media Queries === */
@media (max-width: 1024px) {
  .container {
    padding: 15px;
  }

  .group-card h2 {
    font-size: 24px;
  }

  .attendance-table th,
  .attendance-table td {
    padding: 10px;
    font-size: 14px;
  }

  .save-btn {
    font-size: 15px;
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .group-card {
    padding: 20px;
  }

  .group-card h2 {
    font-size: 22px;
  }

  .date-picker {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .attendance-table th,
  .attendance-table td {
    padding: 8px;
    font-size: 13px;
  }

  .btn {
    font-size: 12px;
    padding: 5px 8px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  .group-card {
    padding: 15px;
  }

  .group-card h2 {
    font-size: 20px;
  }

  .meta {
    font-size: 13px;
  }

  .attendance-table {
    font-size: 12px;
  }

  .attendance-table th,
  .attendance-table td {
    padding: 6px;
  }

  .btn {
    font-size: 11px;
    padding: 4px 6px;
    margin: 2px;
  }

  .save-btn {
    font-size: 14px;
    padding: 10px;
  }
}

</style>
