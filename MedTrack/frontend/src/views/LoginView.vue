<template>
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-heading">
        <div class="brand-mark large">M</div>
        <div>
          <p class="eyebrow">MEDICAL SYSTEM</p>
          <h1>Вход в MedTrack</h1>
        </div>
      </div>

      <p class="muted">Введите данные для доступа к системе.</p>

      <form @submit.prevent="submit">
        <label>
          Email
          <input
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            placeholder="doctor@example.com"
            required
          />
        </label>

        <label>
          Пароль
          <input
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            required
          />
        </label>

        <div v-if="error" class="alert error">{{ error }}</div>

        <button class="button primary full" :disabled="loading">
          {{ loading ? "Выполняется вход..." : "Войти" }}
        </button>
      </form>

      <p class="auth-footer">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api.js";
import { auth } from "../services/auth.js";

const router = useRouter();
const route = useRoute();

const form = reactive({
  email: "",
  password: ""
});

const loading = ref(false);
const error = ref("");

async function submit() {
  error.value = "";
  loading.value = true;

  try {
    const { data } = await api.post("/auth/signin", form);
    auth.setSession(data);

    const redirect = typeof route.query.redirect === "string"
      ? route.query.redirect
      : "/dashboard";

    router.push(redirect);
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Не удалось выполнить вход.";
  } finally {
    loading.value = false;
  }
}
</script>
