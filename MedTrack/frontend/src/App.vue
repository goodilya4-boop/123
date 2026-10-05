<template>
  <div class="app-shell">
    <header v-if="auth.isAuthenticated()" class="topbar">
      <router-link class="brand" to="/dashboard">
        <span class="brand-mark">M</span>
        <span>MedTrack</span>
      </router-link>

      <nav class="nav">
        <router-link to="/dashboard">Главная</router-link>
        <router-link to="/profile">Профиль</router-link>
        <router-link v-if="auth.user.value?.role === 'администратор'" to="/users">
          Пользователи
        </router-link>
      </nav>

      <div class="user-menu">
        <div class="user-info">
          <strong>{{ auth.displayName.value }}</strong>
          <span>{{ auth.user.value?.role }}</span>
        </div>
        <button class="button button-secondary" @click="logout">Выйти</button>
      </div>
    </header>

    <main :class="{ 'page-with-header': auth.isAuthenticated() }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { auth } from "./services/auth.js";

const router = useRouter();

function logout() {
  auth.clearSession();
  router.push("/login");
}
</script>
