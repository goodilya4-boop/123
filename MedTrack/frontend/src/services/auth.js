import { computed, ref } from "vue";

const TOKEN_KEY = "medtrack_access_token";
const USER_KEY = "medtrack_user";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

const token = ref(localStorage.getItem(TOKEN_KEY));
const user = ref(readUser());

export const auth = {
  token,
  user,
  isAuthenticated: () => Boolean(token.value),

  setSession(session) {
    token.value = session.accessToken;
    user.value = {
      id: session.id,
      first_name: session.first_name,
      last_name: session.last_name,
      email: session.email,
      role: session.role
    };

    localStorage.setItem(TOKEN_KEY, token.value);
    localStorage.setItem(USER_KEY, JSON.stringify(user.value));
  },

  clearSession() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  displayName: computed(() => {
    if (!user.value) return "";
    return [user.value.first_name, user.value.last_name]
      .filter(Boolean)
      .join(" ");
  })
};
