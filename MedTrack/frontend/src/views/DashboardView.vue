<template>
  <section class="container">
    <div class="hero">
      <div>
        <p class="eyebrow">MEDTRACK</p>
        <h1>Добро пожаловать, {{ auth.user.value?.first_name }}.</h1>
        <p class="muted">
          Рабочее пространство медицинской информационной системы.
        </p>
      </div>

      <div class="status-card">
        <span class="status-dot"></span>
        Система доступна
      </div>
    </div>

    <div class="stats">
      <article class="stat-card">
        <span>Пользователь</span>
        <strong>#{{ auth.user.value?.id }}</strong>
      </article>

      <article class="stat-card">
        <span>Роль</span>
        <strong>{{ auth.user.value?.role }}</strong>
      </article>

      <article class="stat-card">
        <span>Email</span>
        <strong>{{ auth.user.value?.email }}</strong>
      </article>
    </div>

    <div class="section-heading">
      <div>
        <p class="eyebrow">БЫСТРЫЙ ДОСТУП</p>
        <h2>Разделы системы</h2>
      </div>
    </div>

    <div class="cards">
      <router-link to="/profile" class="feature-card">
        <div class="feature-icon">01</div>
        <h3>Профиль</h3>
        <p>Просмотр и изменение персональных данных.</p>
      </router-link>

      <router-link
        v-if="auth.user.value?.role === 'администратор'"
        to="/users"
        class="feature-card"
      >
        <div class="feature-icon">02</div>
        <h3>Пользователи</h3>
        <p>Управление учётными записями сотрудников.</p>
      </router-link>

      <article class="feature-card disabled-card">
        <div class="feature-icon">03</div>
        <h3>Аудит</h3>
        <p>Журнал действий будет подключён к audit-service.</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { auth } from "../services/auth.js";
</script>
