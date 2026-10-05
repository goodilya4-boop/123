<template>
  <section class="container narrow">
    <div class="section-heading">
      <div>
        <p class="eyebrow">ACCOUNT</p>
        <h1>Профиль</h1>
      </div>
    </div>

    <form class="panel" @submit.prevent="save">
      <div class="form-grid">
        <label>
          Имя
          <input v-model.trim="form.first_name" maxlength="50" required />
        </label>

        <label>
          Фамилия
          <input v-model.trim="form.last_name" maxlength="50" required />
        </label>
      </div>

      <label>
        Email
        <input v-model.trim="form.email" type="email" required />
      </label>

      <label>
        Новый пароль
        <input
          v-model="form.password"
          type="password"
          minlength="8"
          placeholder="Оставьте пустым, чтобы не менять"
        />
      </label>

      <div v-if="message" class="alert success">{{ message }}</div>
      <div v-if="error" class="alert error">{{ error }}</div>

      <button class="button primary" :disabled="loading">
        {{ loading ? "Сохранение..." : "Сохранить изменения" }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import api from "../services/api.js";
import { auth } from "../services/auth.js";

const form = reactive({
  first_name: auth.user.value?.first_name || "",
  last_name: auth.user.value?.last_name || "",
  email: auth.user.value?.email || "",
  password: ""
});

const loading = ref(false);
const message = ref("");
const error = ref("");

async function save() {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email
    };

    if (form.password) payload.password = form.password;

    await api.put(`/users/${auth.user.value.id}`, payload);

    auth.user.value = {
      ...auth.user.value,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email
    };

    localStorage.setItem("medtrack_user", JSON.stringify(auth.user.value));
    form.password = "";
    message.value = "Профиль обновлён.";
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Не удалось сохранить изменения.";
  } finally {
    loading.value = false;
  }
}
</script>
