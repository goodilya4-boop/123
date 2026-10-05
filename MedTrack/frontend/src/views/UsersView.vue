<template>
  <section class="container">
    <div class="section-heading">
      <div>
        <p class="eyebrow">ADMINISTRATION</p>
        <h1>Пользователи</h1>
      </div>

      <button class="button button-secondary" @click="loadUsers">
        Обновить
      </button>
    </div>

    <div v-if="error" class="alert error">{{ error }}</div>

    <div class="panel table-panel">
      <div v-if="loading" class="empty">Загрузка...</div>

      <div v-else-if="!users.length" class="empty">
        Пользователей пока нет.
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Сотрудник</th>
              <th>Email</th>
              <th>Роль</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in users" :key="item.id">
              <td>#{{ item.id }}</td>
              <td>
                <strong>{{ item.first_name }} {{ item.last_name }}</strong>
              </td>
              <td>{{ item.email }}</td>
              <td><span class="badge">{{ item.role }}</span></td>
              <td>
                <button
                  class="button danger small"
                  :disabled="item.id === auth.user.value?.id"
                  @click="removeUser(item)"
                >
                  Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../services/api.js";
import { auth } from "../services/auth.js";

const users = ref([]);
const loading = ref(true);
const error = ref("");

async function loadUsers() {
  loading.value = true;
  error.value = "";

  try {
    const { data } = await api.get("/users");
    users.value = data;
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Не удалось загрузить пользователей.";
  } finally {
    loading.value = false;
  }
}

async function removeUser(user) {
  if (!window.confirm(`Удалить пользователя ${user.email}?`)) return;

  try {
    await api.delete(`/users/${user.id}`);
    users.value = users.value.filter((item) => item.id !== user.id);
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Не удалось удалить пользователя.";
  }
}

onMounted(loadUsers);
</script>
