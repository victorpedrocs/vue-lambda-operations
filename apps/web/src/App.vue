<script setup lang="ts">

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <nav v-show="authStore.user" class="navbar">
          <div class="navbar-nav">
            <router-link to="/">Home</router-link>
            <router-link to="/operation">Operation</router-link>
            <router-link to="/records">Records</router-link>
          </div>
          <div class="navbar-right">
            <a href="javascript:void(0)" @click="authStore.logout()" class="nav-item nav-link">Logout</a>
          </div>
        </nav>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
<style>
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;

  font-size: 18px;
  color: black;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
