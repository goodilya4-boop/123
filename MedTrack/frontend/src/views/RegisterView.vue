<template>
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-heading">
        <div class="brand-mark large">M</div>
        <div>
          <p class="eyebrow">MEDICAL SYSTEM</p>
          <h1>Регистрация</h1>
        </div>
      </div>

      <p class="muted">Создайте учётную запись для работы в MedTrack.</p>

      <form @submit.prevent="submit">
        <div class="form-grid">
          <label>
            Имя
            <input v-model.trim="form.first_name" required maxlength="50" />
          </label>

          <label>
            Фамилия
            <input v-model.trim="form.last_name" required maxlength="50" />
          </label>
        </div>

        <label>
          Email
          <input v-model.trim="form.email" type="email" autocomplete="email" required />
        </label>

        <label>
          Пароль
          <input
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            minlength="8"
            required
          />
        </label>

        <div v-if="error" class="alert error">{{ error }}</div>
        <div v-if="success" class="alert success">{{ success }}</div>

        <button class="button primary full" :disabled="loading">
          {{ loading ? "Создание..." : "Создать аккаунт" }}
        </button>
      </form>

      <p class="auth-footer">
        Уже есть аккаунт?
        <router-link to="/login">Войти</router-link>
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api.js";

const router = useRouter();

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: ""
});

const loading = ref(false);
const error = ref("");
const success = ref("");

async function submit() {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    await api.post("/auth/signup", form);

    success.value = "Аккаунт создан. Сейчас откроется страница входа.";
    setTimeout(() => router.push("/login"), 900);
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Не удалось зарегистрировать пользователя.";
  } finally {
    loading.value = false;
  }
}
</script>
