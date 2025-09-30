<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import * as bootstrap from "bootstrap";

const courses = ref<any[]>([]);
const newCourse = ref({
  title: "",
  description: "",
  price: "",
  duration: "",
  level: "beginner",
});

const editingCourse = ref<any | null>(null);
const VITE_API_URL = import.meta.env.VITE_API_URL;
const levels = ["beginner", "intermediate", "advanced"];
const API_URL = VITE_API_URL + "/courses";

const loading = ref(false);

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { token };
};

// 🔹 Faqat bir marta (sahifa ochilganda) backenddan kurslarni olib kelamiz
const fetchCourses = async () => {
  loading.value = true;
  try {
    const res = await axios.get(API_URL, { headers: getAuthHeader() });
    courses.value = res.data;
  } catch (error: any) {
    if (error.response?.data?.message === "jwt expired") {
      useAuthStore().logout();
    }
    alert(error.response?.data?.message || "Xatolik!");
  } finally {
    loading.value = false;
  }
};

const addCourse = async () => {
  loading.value = true;
  try {
    if (editingCourse.value) {
      // 🔹 Backendni yangilash
      await axios.put(`${API_URL}/${editingCourse.value._id}`, newCourse.value, {
        headers: getAuthHeader(),
      });

      // 🔹 Frontend listni yangilash
      const idx = courses.value.findIndex(c => c._id === editingCourse.value._id);
      if (idx !== -1) {
        courses.value[idx] = { ...courses.value[idx], ...newCourse.value };
      }

      editingCourse.value = null;
    } else {
      // 🔹 Yangi kurs qo‘shish
      const res = await axios.post(API_URL, newCourse.value, {
        headers: getAuthHeader(),
      });

      // 🔹 Ro‘yxatga qo‘shib qo‘yamiz
      courses.value.push(res.data);
    }

    resetForm();
  const modalEl: any = document.getElementById("courseModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
  } catch (error: any) {
    if (error.response?.data?.message === "jwt expired") {
      useAuthStore().logout();
    }
    alert(error.response?.data?.message || "Xatolik!");
  } finally {
    loading.value = false;
  }
};

const editCourse = (course: any) => {
  editingCourse.value = course;
  newCourse.value = { ...course };

  const modalEl: any = document.getElementById("courseModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

const deleteCourse = async (id: string) => {
  if (!confirm("Are you sure you want to delete this course?")) return;
  loading.value = true;
  try {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });

    // 🔹 Frontend listdan o‘chiramiz
    courses.value = courses.value.filter(c => c._id !== id);
  } catch (error: any) {
    if (error.response?.data?.message === "jwt expired") {
      useAuthStore().logout();
    }
    alert(error.response?.data?.message || "Xatolik!");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  newCourse.value = {
    title: "",
    description: "",
    price: "",
    duration: "",
    level: "beginner",
  };
  editingCourse.value = null;
};

onMounted(fetchCourses);
</script>



<template>
  <div class="container mt-4">
    <button
      class="btn btn-success mb-3"
      data-bs-toggle="modal"
      data-bs-target="#courseModal"
      @click="resetForm"
    >
      ➕ Add New Course
    </button>

    <!-- Bootstrap Modal -->
    <div
      class="modal fade"
      id="courseModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingCourse ? "Edit Course" : "Add New Course" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resetForm"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCourse">
              <div class="mb-3">
                <input
                  v-model="newCourse.title"
                  class="form-control"
                  placeholder="Title"
                  required
                />
              </div>
              <div class="mb-3">
                <textarea
                  v-model="newCourse.description"
                  class="form-control"
                  placeholder="Description"
                ></textarea>
              </div>
              <div class="mb-3">
                <input
                  v-model="newCourse.price"
                  class="form-control"
                  placeholder="Price"
                  required
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="newCourse.duration"
                  class="form-control"
                  placeholder="Duration"
                  required
                />
              </div>
              <div class="mb-3">
                <select v-model="newCourse.level" class="form-select">
                  <option
                    v-for="lvl in levels"
                    :key="lvl"
                    :value="lvl"
                  >
                    {{ lvl }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-success" :disabled="loading">
                {{ editingCourse ? "Update Course" : "Add Course" }}
              </button>
              <button
                type="button"
                class="btn btn-secondary ms-2"
                data-bs-dismiss="modal"
                @click="resetForm"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-success" role="status"></div>
    </div>

    <!-- Courses list -->
    <div v-else class="row">
      <div class="col-md-4 mb-3" v-for="course in courses" :key="course._id">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ course.title }}</h5>
            <p class="card-text">{{ course.description }}</p>
            <p><strong>Price:</strong> {{ course.price }}</p>
            <p><strong>Duration:</strong> {{ course.duration }}</p>
            <p><strong>Level:</strong> {{ course.level }}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-danger" @click="deleteCourse(course._id)">
              Delete
            </button>
            <button class="btn btn-warning" @click="editCourse(course)">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Loader style */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}

.loader {
  border: 5px solid #c8e6c9;
  border-top: 5px solid #2e7d32;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
}

.title {
  color: #2e7d32;
  margin-bottom: 15px;
  font-size: 22px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}

.form input,
.form textarea,
.form select {
  padding: 12px;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  outline: none;
  font-size: 15px;
  transition: border 0.3s;
}

.form input:focus,
.form textarea:focus,
.form select:focus {
  border: 1px solid #2e7d32;
  box-shadow: 0 0 5px rgba(46, 125, 50, 0.4);
}

.addCourseBtn {
  padding: 12px;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.addCourseBtn:hover {
  background: #1b5e20;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.card {
  padding: 20px;  
  border-radius: 12px;
  background: #f9fff9;
  border: 1px solid #c8e6c9;
  box-shadow: 0 3px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

.card h3 {
  margin-bottom: 10px;
  color: #2e7d32;
}

.card .desc {
  font-size: 14px;
  color: #555;
}

@media (max-width: 600px) {
  .container {
    padding: 15px;
  }

  .title {
    font-size: 18px;
    text-align: center;
  }

  .form input,
  .form textarea,
  .form select {
    font-size: 14px;
    padding: 10px;
  }

  .btn {
    font-size: 14px;
    padding: 10px;
  }

  .course-list {
    grid-template-columns: 1fr; 
  }

  .card {
    padding: 15px;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  .course-list {
    grid-template-columns: repeat(2, 1fr); 
  }

  .title {
    font-size: 20px;
  }
}
</style>
