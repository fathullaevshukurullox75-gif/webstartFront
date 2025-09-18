<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const groups = ref<any[]>([]);
const teachers = ref<any[]>([]);
const courses = ref<any[]>([]);
const students = ref<any[]>([]); // 👈 faqat role=user

const newGroup = ref({
  groupName: "",
  teacher: "",
  course: "",
  students: [] as string[], // 👈 studentlarni ID arrayi
  schedule: [{ day: "", time: "" }],
  status: "active",
  startDate: "",
  endDate: "",
  capacity: 20,
  description: "",
});

const editingGroup = ref<any | null>(null);
const statuses = ["active", "inactive", "archived"];

const API_URL = "http://localhost:4001/api/groups";
const TEACHER_URL = "http://localhost:4001/api/users/top";
const COURSE_URL = "http://localhost:4001/api/courses";
const STUDENT_URL = "http://localhost:4001/api/users"; // 👈 backendda role=user chiqadigan endpoint

// Groups
const fetchGroups = async () => {
  try {
    const res = await axios.get(API_URL, {
      headers: { token: localStorage.getItem("token") },
    });
    groups.value = res.data;
  } catch (err: any) {
    if (err.response?.data?.message === "jwt expired") {
      useAuthStore().logout();
    }
  }
};

// Teachers
const fetchTeachers = async () => {
  try {
    const res = await axios.get(TEACHER_URL, {
      headers: { token: localStorage.getItem("token") },
    });
    teachers.value = res.data.users;
  } catch (err) {
    console.error("Failed to fetch teachers", err);
  }
};

// Courses
const fetchCourses = async () => {
  try {
    const res = await axios.get(COURSE_URL, {
      headers: { token: localStorage.getItem("token") },
    });
    courses.value = res.data;
  } catch (err) {
    console.error("Failed to fetch courses", err);
  }
};

// Students (role=user)
const fetchStudents = async () => {
  try {
    const res = await axios.get(STUDENT_URL, {
      headers: { token: localStorage.getItem("token") },
    });
    students.value = res.data.users;
  } catch (err) {
    console.error("Failed to fetch students", err);
  }
};

// Save
const saveGroup = async () => {
  try {
    if (editingGroup.value) {
      await axios.put(`${API_URL}/${editingGroup.value._id}`, newGroup.value, {
        headers: { token: localStorage.getItem("token") },
      });
      editingGroup.value = null;
    } else {
      await axios.post(API_URL, newGroup.value, {
        headers: { token: localStorage.getItem("token") },
      });
    }
    resetForm();
    await fetchGroups();
  } catch (err: any) {
    console.log(err.response?.data);
  }
};

// Edit
const editGroup = (group: any) => {
  editingGroup.value = group;
  newGroup.value = { ...group, students: group.students?.map((s: any) => s._id) || [] };
};

// Delete
const deleteGroup = async (id: string) => {
  if (!confirm("Are you sure you want to delete this group?")) return;
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { token: localStorage.getItem("token") },
    });
    await fetchGroups();
  } catch (err: any) {
    alert(err.response?.data?.message || "Error deleting group");
  }
};

const addScheduleRow = () => {
  newGroup.value.schedule.push({ day: "", time: "" });
};

// Reset
const resetForm = () => {
  newGroup.value = {
    groupName: "",
    teacher: "",
    course: "",
    students: [],
    schedule: [{ day: "", time: "" }],
    status: "active",
    startDate: "",
    endDate: "",
    capacity: 20,
    description: "",
  };
  editingGroup.value = null;
};

onMounted(() => {
  fetchGroups();
  fetchTeachers();
  fetchCourses();
  fetchStudents();
});
</script>

<template>
  <div class="group-container">
    <h2 class="title">
      {{ editingGroup ? "✏ Edit Group" : "Add New Group" }}
    </h2>

    <!-- Form -->
    <form @submit.prevent="saveGroup" class="form">
      <input v-model="newGroup.groupName" placeholder="Group Name" required />

      <!-- Teachers select -->
      <select v-model="newGroup.teacher" required>
        <option disabled value="">-- Select Teacher --</option>
        <option v-for="t in teachers" :key="t._id" :value="t._id">
          {{ t.username }} {{ t.surname }}
        </option>
      </select>

      <!-- Courses select -->
      <select v-model="newGroup.course" required>
        <option disabled value="">-- Select Course --</option>
        <option v-for="c in courses" :key="c._id" :value="c._id">
          {{ c.title }}
        </option>
      </select>

      <!-- Students multi select -->
      <select v-model="newGroup.students" multiple required>
        <option v-for="s in students" :key="s._id" :value="s._id">
          {{ s.username }} {{ s.surname }}
        </option>
      </select>

      <!-- Schedule -->
      <div v-for="(s, i) in newGroup.schedule" :key="i" class="schedule-row">
        <input v-model="s.day" placeholder="Day (e.g. Monday)" />
        <input v-model="s.time" placeholder="Time (e.g. 14:00)" />
      </div>
      <button type="button" class="btn small" @click="addScheduleRow">
        Add Schedule
      </button>

      <!-- Status -->
      <select v-model="newGroup.status">
        <option v-for="st in statuses" :key="st" :value="st">{{ st }}</option>
      </select>

      <input type="date" v-model="newGroup.startDate" />
      <input type="date" v-model="newGroup.endDate" />

      <input type="number" v-model="newGroup.capacity" placeholder="Capacity" min="1" />

      <textarea v-model="newGroup.description" placeholder="Description"></textarea>

      <div class="btn-group">
        <button type="submit" class="btn green">
          {{ editingGroup ? "Update Group" : "Add Group" }}
        </button>
        <button v-if="editingGroup" type="button" class="btn gray" @click="resetForm">
          Cancel
        </button>
      </div>
    </form>

    <!-- Groups list -->
    <h2 class="title">Groups</h2>
    <div class="course-list">
      <div class="card" v-for="group in groups" :key="group._id">
        <h3>{{ group.groupName }}</h3>
        <p><strong>Teacher:</strong> {{ group.teacher?.username }} {{ group.teacher?.surname }}</p>
        <p><strong>Course:</strong> {{ group.course?.title || group.course }}</p>
        <p><strong>Students:</strong> {{ group.students?.length }}</p>
        <ul>
          <li v-for="stu in group.students" :key="stu._id">
            {{ stu.username }} {{ stu.surname }}
          </li>
        </ul>
        <p><strong>Status:</strong> <span :class="'badge ' + group.status">{{ group.status }}</span></p>
        <p><strong>Capacity:</strong> {{ group.capacity }}</p>
        <p><strong>Start:</strong> {{ group.startDate?.slice(0, 10) }}</p>
        <p><strong>End:</strong> {{ group.endDate?.slice(0, 10) }}</p>
        <p><strong>Description:</strong> {{ group.description }}</p>

        <div v-if="group.schedule?.length">
          <h4>Schedule:</h4>
          <ul>
            <li v-for="(sch, idx) in group.schedule" :key="idx">
              {{ sch.day }} - {{ sch.time }}
            </li>
          </ul>
        </div>

        <div class="d-flex gap-2 mt-3">
          <button class="btn yellow" @click="editGroup(group)">Edit</button>
          <button class="btn red" @click="deleteGroup(group._id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Sizning style'laringiz o‘zgarishsiz qoldi */
</style>

<style scoped>
.group-container {
  max-width: 1100px;
  margin: 30px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(90deg, #2e7d32, #66bb6a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 25px 0;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
  background: #f9fff9;
  padding: 25px;
  border: 1px solid #c8e6c9;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.1);
}

.form input,
.form select,
.form textarea {
  padding: 10px;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}
.form input:focus,
.form select:focus,
.form textarea:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 6px rgba(46, 125, 50, 0.3);
}

.schedule-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

textarea {
  min-height: 70px;
}

.btn-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
  color: white;
}
.btn.green {
  background: #2e7d32;
}
.btn.green:hover {
  background: #1b5e20;
}
.btn.gray {
  background: #9e9e9e;
}
.btn.red {
  background: #e53935;
}
.btn.red:hover {
  background: #c62828;
}
.btn.yellow {
  background: #fbc02d;
  color: #333;
}
.btn.yellow:hover {
  background: #f9a825;
}
.btn.small {
  padding: 6px 10px;
  font-size: 12px;
  background: #2e7d32;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #c8e6c9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
.card h3 {
  margin-bottom: 10px;
  color: #2e7d32;
  font-weight: 600;
}
.card p {
  margin: 6px 0;
  font-size: 14px;
  color: #444;
}

.badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: white;
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

/* 📱 Responsive */
@media (max-width: 768px) {
  .group-container {
    padding: 15px;
  }
  .form {
    padding: 15px;
  }
  .schedule-row {
    flex-direction: column;
  }
  .btn-group {
    flex-direction: column;
  }
}
</style>
