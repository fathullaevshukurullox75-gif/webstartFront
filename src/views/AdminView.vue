<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
import Navbar from '@/components/Navbar.vue';
const fullPath = route.path;
const lastSegment = fullPath.split("/").pop();
</script>
<template>
    <div class="row m-0 p-0">
        <div class="col-4 col-sm-3 col-md-2 col-lg-1 m-0 p-0">
            <Navbar />
        </div>
        <div class="col-11 m-0 p-0">
            <div class="content-area">
                <!-- <h1>{{ lastSegment?.charAt(0).toUpperCase() + lastSegment?.slice(1) }} page</h1> -->
               <div class="d-flex align-items-center w-25">
                 <input type="search" placeholder="Search..." class="form-control w-100" />
                <div class="profile-icon ms-3">
                    <i class="fa-solid fa-user"></i>
                </div>
               </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.content-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:0 20px;
    width: 100%;
    height: 10%;
    background: #fff;
    border-bottom: 1px solid green;
}
.profile-icon {
    padding: 10px 10px;
    background: green;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
}
</style>