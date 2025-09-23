<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const apiUrl = import.meta.env.VITE_API_URL;
const router = useRouter();

const groups = ref<any[]>([]);
const teachers = ref<any[]>([]);
const courses = ref<any[]>([]);
const students = ref<any[]>([]);

const newGroup = ref({
  groupName: "",
  teacher: "",
  course: "",
  students: [] as string[],
  schedule: [{ day: "", time: "" }],
  status: "active",
  startDate: "",
  endDate: "",
  capacity: 20,
  description: "",
});

const editingGroup = ref<any | null>(null);
const statuses = ["active", "inactive", "archived"];

// ✅ Loaderlar
const loading = ref({
  fetch: false,
  save: false,
  delete: false,
});

const API_URL = `${apiUrl}/groups`;
const TEACHER_URL = `${apiUrl}/users/top`;
const COURSE_URL = `${apiUrl}/courses`;
const STUDENT_URL = `${apiUrl}/users`;

const fetchGroups = async () => {
  loading.value.fetch = true;
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
  } finally {
    loading.value.fetch = false;
  }
};

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

const fetchStudents = async () => { try { const res = await axios.get(STUDENT_URL, { headers: { token: localStorage.getItem("token") }, }); const allStudents = res.data.users; groups.value = groups.value.map((group: any) => { if (group.students && group.students.length > 0) { group.students .map((studentId: string) => allStudents.find((user: any) => user._id === studentId) ) .filter((s: any) => s); } return group; }); const studentsInGroups = groups.value.flatMap((g) => g.students.map((s: any) => s._id) ); students.value = allStudents.filter( (u: any) => u.role === "user" && !studentsInGroups.includes(u._id) ); } catch (err) { console.error("Failed to fetch students", err); } };
// Save Group
const saveGroup = async () => {
  loading.value.save = true;
  try {
    if (editingGroup.value) {
      await axios.put(
        `${API_URL}/${editingGroup.value._id}`,
        newGroup.value,
        { headers: { token: localStorage.getItem("token") } }
      );
      editingGroup.value = null;
    } else {
      await axios.post(API_URL, newGroup.value, {
        headers: { token: localStorage.getItem("token") },
      });
    }
    resetForm();
    await fetchGroups();
    await fetchStudents();
  } catch (err: any) {
    console.error(err.response?.data || err);
  } finally {
    loading.value.save = false;
  }
};

// Edit Group
const editGroup = (group: any) => {
  editingGroup.value = group;
  newGroup.value = {
    ...group,
    students: group.students?.map((s: any) => s._id) || [],
  };
};

// Delete Group
const deleteGroup = async (id: string) => {
  if (!confirm("Are you sure you want to delete this group?")) return;
  loading.value.delete = true;
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { token: localStorage.getItem("token") },
    });
    await fetchGroups();
    await fetchStudents();
  } catch (err: any) {
    alert(err.response?.data?.message || "Error deleting group");
  } finally {
    loading.value.delete = false;
  }
};

// Add schedule row
const addScheduleRow = () => {
  newGroup.value.schedule.push({ day: "", time: "" });
};

// Reset form
const resetForm = () => {
  fetchStudents();
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

// ✅ Mounted
onMounted(async () => {
  await fetchGroups();
  await fetchTeachers();
  await fetchCourses();
  await fetchStudents();
});
const goToGroup = (id: string) => {
  router.push({ name: "onegroup", params: { id } });
};
</script>

<template>
  <div class="group-container">
    <h2 class="title">
      {{ editingGroup ? "Edit Group" : "Add New Group" }}
    </h2>

    <form @submit.prevent="saveGroup" class="form">
      <input v-model="newGroup.groupName" placeholder="Group Name" required />

      <select v-model="newGroup.teacher" required>
        <option disabled value="">-- Select Teacher --</option>
        <option v-for="t in teachers" :key="t._id" :value="t._id">
          {{ t.username }} {{ t.surname }}
        </option>
      </select>

      <select v-model="newGroup.course" required>
        <option disabled value="">-- Select Course --</option>
        <option v-for="c in courses" :key="c._id" :value="c._id">
          {{ c.title }}
        </option>
      </select>

      <div class="students-select">
        <h4>
          Select Students ({{ newGroup.students.length }}/{{ newGroup.capacity }})
        </h4>
        <div class="student-list">
          <label v-for="s in students" :key="s._id" class="student-item">
            <input
              type="checkbox"
              :value="s._id"
              v-model="newGroup.students"
            />
            {{ s.username }} {{ s.surname }}
          </label>
        </div>
      </div>

      <div v-for="(s, i) in newGroup.schedule" :key="i" class="schedule-row">
        <input v-model="s.day" placeholder="Day (e.g. Monday)" />
        <input v-model="s.time" placeholder="Time (e.g. 14:00)" />
      </div>
      <button type="button" class="btn small" @click="addScheduleRow">
        Add Schedule
      </button>

      <select v-model="newGroup.status">
        <option v-for="st in statuses" :key="st" :value="st">{{ st }}</option>
      </select>

      <input type="date" v-model="newGroup.startDate" />
      <input type="date" v-model="newGroup.endDate" />

      <input
        type="number"
        v-model="newGroup.capacity"
        placeholder="Capacity"
        min="1"
      />

      <textarea v-model="newGroup.description" placeholder="Description"></textarea>

      <div class="btn-group">
        <button type="submit" class="btn green" :disabled="loading.save">
          <span v-if="loading.save"> Saving...</span>
          <span v-else>{{ editingGroup ? "Update Group" : "Add Group" }}</span>
        </button>
        <button
          v-if="editingGroup"
          type="button"
          class="btn gray"
          @click="resetForm"
        >
          Cancel
        </button>
      </div>
    </form>

    <h2 class="title">Groups</h2>

    <div v-if="loading.fetch"> Loading groups...</div>

    <div class="course-list" v-else>
      <div v-for="group in groups" :key="group._id" class="card">
        <h3 @click="goToGroup(group._id)">{{ group.groupName }}</h3>
        <p>
          <strong>Teacher:</strong>
          {{ group.teacher?.username }} {{ group.teacher?.surname }}
        </p>
        <p><strong>Course:</strong> {{ group.course?.title || group.course }}</p>
        <p><strong>Students:</strong> {{ group.students?.length }}</p>

        <p>
          <strong>Status:</strong>
          <span :class="'badge ' + group.status">{{ group.status }}</span>
        </p>
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
          <button
            class="btn red"
            @click="deleteGroup(group._id)"
            :disabled="loading.delete"
          >
            <span v-if="loading.delete"> Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.students-select {
  border: 1px solid #c8e6c9;
  padding: 12px;
  border-radius: 10px;
}
.student-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-top: 10px;
}
.student-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
}
.student-item input {
  accent-color: #2e7d32;
}
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
  padding: 25px;
  border-radius: 14px;
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