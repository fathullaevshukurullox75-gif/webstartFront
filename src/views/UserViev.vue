<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const users = ref<any[]>([]);
const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = apiUrl + "/users";

const showModal = ref(false);       // Add user modal
const showEditModal = ref(false);   // Edit user modal

const loading = ref(false);         // Global loading state
const deleteLoading = ref<string | null>(null); // faqat qaysi user o‘chayotganini ko‘rsatadi

const newUser = ref({
  username: "",
  surname: "",
  email: "",
  age: "",
  phonenumber: "",
  role: "user",
  password: ""
});

const editUserData = ref<any>(null);
const fetchUsers = async () => {
  try {
    const res = await axios.get(API_URL, {
      headers: { token: localStorage.getItem("token") },
    });

    let newdata = res.data.users.filter((item: any) => item.role === "user");

    users.value = newdata;
  } catch (err: any) {
    if (err.response?.data?.message === "jwt expired") {
      useAuthStore().logout();
    } else {
      console.error("Failed to fetch users", err);
    }
  }
};


const addUser = async () => {
  loading.value = true;
  try {
    await axios.post(`${apiUrl}/auth/signup`, newUser.value, {
      headers: { token: localStorage.getItem("token") },
    });
    showModal.value = false;
    await fetchUsers();
    newUser.value = { username: "", surname: "", email: "", age: "", phonenumber: "", role: "user", password: "" };
  } catch (err) {
    console.error("Failed to add user", err);
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (id: string) => {
  if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
  deleteLoading.value = id;
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { token: localStorage.getItem("token") },
    });
    await fetchUsers();
  } catch (err) {
    console.error("Failed to delete user", err);
  } finally {
    deleteLoading.value = null;
  }
};

// Edit modalni ochish
const openEditModal = (u: any) => {
  editUserData.value = { ...u }; // user ma’lumotlarini ko‘chirish
  showEditModal.value = true;
};

// Userni yangilash
const updateUser = async () => {
  loading.value = true;
  try {
    await axios.put(`${API_URL}/${editUserData.value._id}`, editUserData.value, {
      headers: { token: localStorage.getItem("token") },
    });
    showEditModal.value = false;
    await fetchUsers();
  } catch (err) {
    console.error("Failed to update user", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="user-container">
    <div class="header">
        <h2 class="title">All Users</h2>
        <button class="btn-add" @click="showModal = true" :disabled="loading">
          <i class="fa-solid fa-plus"></i>
          <span v-if="!loading">Add User</span>
          <span v-else class="spinner"></span>
        </button>
    </div>

    <!-- Users table -->
    <table class="user-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Full Name</th>
          <th>Age</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, index) in users" :key="u._id">
          <td>{{ index + 1 }}</td>
          <td>{{ u.username }} {{ u.surname }}</td>
          <td>{{ u.age }} years old</td>
          <td>{{ u.email }}</td>
          <td>{{ u.phonenumber }}</td>
          <td><span :class="'badge ' + u.role">{{ u.role }}</span></td>
          <td>{{ u.createdAt?.slice(0,10) }}</td>
          <td class="action-buttons">
            <button class="btn-edit" @click="openEditModal(u)" :disabled="loading">
              <span v-if="!(loading && editUserData?._id===u._id)">Edit</span>
              <span v-else class="spinner"></span>
            </button>
            <button class="btn-delete" @click="deleteUser(u._id)" :disabled="deleteLoading===u._id">
              <span v-if="deleteLoading !== u._id">Delete</span>
              <span v-else class="spinner"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Add New User</h3>
        <form @submit.prevent="addUser">
          <input v-model="newUser.username" type="text" placeholder="First Name" required />
          <input v-model="newUser.surname" type="text" placeholder="Last Name" required />
          <input v-model="newUser.age" type="number" placeholder="Age" required />
          <input v-model="newUser.email" type="email" placeholder="Email" required />
          <input v-model="newUser.phonenumber" type="text" placeholder="Phone" required />
          <select v-model="newUser.role" required>
            <option value="user">User</option>
            <option value="teacher">Teacher</option>
          </select>
          <input v-model="newUser.password" type="password" placeholder="Password" required />

          <div class="actions">
            <button type="button" class="btn-cancel" @click="showModal = false" :disabled="loading">Cancel</button>
            <button type="submit" class="btn-save" :disabled="loading">
              <span v-if="!loading">Save</span>
              <span v-else class="spinner"></span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit User</h3>
        <form @submit.prevent="updateUser">
          <input v-model="editUserData.username" type="text" placeholder="First Name" required />
          <input v-model="editUserData.surname" type="text" placeholder="Last Name" required />
          <input v-model="editUserData.age" type="number" placeholder="Age" required />
          <input v-model="editUserData.email" type="email" placeholder="Email" required />
          <input v-model="editUserData.phonenumber" type="text" placeholder="Phone" required />
          <select v-model="editUserData.role" required>
            <option value="user">User</option>
            <option value="teacher">Teacher</option>
          </select>

          <div class="actions">
            <button type="button" class="btn-cancel" @click="showEditModal = false" :disabled="loading">Cancel</button>
            <button type="submit" class="btn-save" :disabled="loading">
              <span v-if="!loading">Update</span>
              <span v-else class="spinner"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-container { margin:30px auto; padding:20px; background:#fff; border-radius:12px; overflow-x:auto; }
.header { display:flex; justify-content:space-between; align-items:center; }
.title { font-size:26px; font-weight:700; color:#2e7d32; }

.btn-add, .btn-save, .btn-cancel, .btn-edit, .btn-delete {
  border:none; border-radius:6px; cursor:pointer; font-size:14px; padding:8px 14px; transition:0.2s;
  display:flex; align-items:center; justify-content:center; gap:6px;
}
.btn-add { background:#2e7d32; color:#fff; }
.btn-add:hover { background:#256528; }
.btn-save { background:#2e7d32; color:#fff; }
.btn-save:hover { background:#256528; }
.btn-cancel { background:#ccc; color:#000; }
.btn-cancel:hover { background:#aaa; }
.btn-edit { background:#1976d2; color:#fff; }
.btn-edit:hover { background:#125a9c; }
.btn-delete { background:#e53935; color:#fff; }
.btn-delete:hover { background:#c62828; }

.user-table { width:100%; border-collapse:collapse; min-width:700px; margin-top:20px; }
.user-table th, .user-table td { padding:10px 14px; border:1px solid #e0e0e0; text-align:left; font-size:14px; }
.user-table th { background:#f1f8f1; font-weight:600; }
.user-table tr:nth-child(even) { background:#fafafa; }

.action-buttons { display:flex; gap:8px; }

.badge { padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600; color:#fff; }
.badge.user { background:#2e7d32; }
.badge.teacher { background:#1976d2; }
.badge.admin { background:#f57c00; }

.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:999; }
.modal-content { background:#fff; padding:20px; border-radius:12px; width:400px; max-width:90%; }
.modal-content h3 { margin-bottom:15px; }
.modal-content form { display:flex; flex-direction:column; gap:10px; }
.modal-content input, .modal-content select { padding:10px; border:1px solid #ccc; border-radius:6px; }

.actions { display:flex; justify-content:flex-end; gap:10px; margin-top:10px; }

/* Spinner loader */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
