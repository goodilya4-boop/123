import { useEffect, useMemo, useState } from "react";
import {
  clearSession,
  getCurrentUser,
  getSession,
  getUsers,
  setSession,
  signIn,
  signUp,
  updateUser
} from "./api";

const isAdmin = (user) => user?.role === "администратор";

function App() {
  const [session, setSessionState] = useState(() => getSession());
  const [view, setView] = useState("overview");
  const [loading, setLoading] = useState(Boolean(session));
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    let active = true;

    getCurrentUser(session.user.id)
      .then((user) => {
        if (!active) return;
        const next = { ...session, user };
        setSession(next);
        setSessionState(next);
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403 || error.status === 404) {
          clearSession();
          setSessionState(null);
        } else {
          setNotice({ type: "error", text: error.message });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const logout = () => {
    clearSession();
    setSessionState(null);
    setView("overview");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return (
      <AuthScreen
        onLogin={(nextSession) => {
          setSessionState(nextSession);
          setView("overview");
        }}
      />
    );
  }

  const user = session.user;

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        view={view}
        setView={setView}
        onLogout={logout}
      />

      <main className="main-content">
        <Topbar user={user} />

        {notice && (
          <div className={`notice notice--${notice.type}`}>
            <span>{notice.text}</span>
            <button className="icon-button" onClick={() => setNotice(null)} aria-label="Закрыть">
              ×
            </button>
          </div>
        )}

        {view === "overview" && <Overview user={user} />}
        {view === "profile" && (
          <Profile
            session={session}
            onUpdated={(nextUser) => {
              const nextSession = { ...session, user: nextUser };
              setSession(nextSession);
              setSessionState(nextSession);
              setNotice({ type: "success", text: "Профиль обновлён." });
            }}
          />
        )}
        {view === "users" && isAdmin(user) && <Users />}
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="brand-mark brand-mark--large">M</div>
      <div className="spinner" />
      <p>Загрузка MedTrack…</p>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (isRegister && form.password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов.");
      return;
    }

    setBusy(true);

    try {
      if (isRegister) {
        await signUp(form);
        const nextSession = await signIn(form.email, form.password);
        onLogin(nextSession);
      } else {
        const nextSession = await signIn(form.email, form.password);
        onLogin(nextSession);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual__inner">
          <div className="brand brand--light">
            <div className="brand-mark">M</div>
            <span>MedTrack</span>
          </div>

          <div className="auth-hero">
            <span className="eyebrow">MEDICAL PLATFORM</span>
            <h1>Медицина, организованная вокруг человека.</h1>
            <p>
              Единое рабочее пространство для пользователей и медицинской команды.
              Без лишней сложности.
            </p>
          </div>

          <div className="security-note">
            <span className="security-icon">✓</span>
            <div>
              <strong>Защищённый доступ</strong>
              <small>Авторизация через API Gateway</small>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand brand">
            <div className="brand-mark">M</div>
            <span>MedTrack</span>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">Добро пожаловать</span>
            <h2>{isRegister ? "Создать аккаунт" : "Войти в систему"}</h2>
            <p>
              {isRegister
                ? "Заполните данные, чтобы начать работу."
                : "Введите данные своей учётной записи."}
            </p>
          </div>

          <form className="form" onSubmit={submit}>
            {isRegister && (
              <div className="form-row">
                <Field
                  label="Имя"
                  value={form.first_name}
                  onChange={update("first_name")}
                  placeholder="Иван"
                  required
                />
                <Field
                  label="Фамилия"
                  value={form.last_name}
                  onChange={update("last_name")}
                  placeholder="Иванов"
                  required
                />
              </div>
            )}

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />

            <Field
              label="Пароль"
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />

            {error && <div className="form-error">{error}</div>}

            <button className="button button--primary button--full" disabled={busy}>
              {busy ? "Подождите…" : isRegister ? "Создать аккаунт" : "Войти"}
            </button>
          </form>

          <div className="auth-switch">
            <span>{isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}</span>
            <button
              className="link-button"
              onClick={() => {
                setError("");
                setMode(isRegister ? "login" : "register");
              }}
            >
              {isRegister ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, type = "text", ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className="input" type={type} {...props} />
    </label>
  );
}

function Sidebar({ user, view, setView, onLogout }) {
  const items = [
    { id: "overview", label: "Обзор", icon: "⌂" },
    { id: "profile", label: "Мой профиль", icon: "○" }
  ];

  if (isAdmin(user)) {
    items.push({ id: "users", label: "Пользователи", icon: "◎" });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-mark">M</div>
          <span>MedTrack</span>
        </div>

        <nav className="nav">
          {items.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? "nav-item--active" : ""}`}
              onClick={() => setView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <Avatar user={user} />
          <div className="sidebar-user__copy">
            <strong>{user.first_name} {user.last_name}</strong>
            <span>{user.role || "Пользователь"}</span>
          </div>
        </div>

        <button className="logout-button" onClick={onLogout}>
          <span>↪</span>
          Выйти
        </button>
      </div>
    </aside>
  );
}

function Topbar({ user }) {
  const date = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());

  return (
    <header className="topbar">
      <div>
        <p className="topbar-date">{date}</p>
        <h1>Добрый день, {user.first_name}</h1>
      </div>
      <div className="topbar-user">
        <Avatar user={user} />
      </div>
    </header>
  );
}

function Avatar({ user, large = false }) {
  const initials = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return <div className={`avatar ${large ? "avatar--large" : ""}`}>{initials || "U"}</div>;
}

function Overview({ user }) {
  const firstName = user.first_name || "пользователь";

  return (
    <section className="page">
      <div className="hero-card">
        <div>
          <span className="eyebrow eyebrow--soft">Ваше рабочее пространство</span>
          <h2>Всё необходимое — в одном месте.</h2>
          <p>
            Используйте профиль для управления личными данными.
            {isAdmin(user) && " В разделе пользователей доступно управление учётными записями."}
          </p>
        </div>
        <div className="hero-orb">
          <span>+</span>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">Быстрый доступ</span>
          <h3>Основные разделы</h3>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardCard
          title="Профиль"
          description="Просмотр и изменение персональных данных."
          icon="○"
          accent="teal"
          onClick={() => window.dispatchEvent(new CustomEvent("open-profile"))}
        />
        <DashboardCard
          title="Безопасность"
          description="Ваш доступ защищён JWT-аутентификацией."
          icon="◇"
          accent="blue"
        />
        <DashboardCard
          title="Система"
          description="API Gateway объединяет backend-сервисы MedTrack."
          icon="⌁"
          accent="purple"
        />
      </div>

      <div className="info-grid">
        <div className="info-card">
          <span className="eyebrow">Аккаунт</span>
          <strong>{firstName} {user.last_name}</strong>
          <span>{user.email}</span>
        </div>
        <div className="info-card">
          <span className="eyebrow">Роль</span>
          <strong>{user.role || "Пользователь"}</strong>
          <span>Уровень доступа аккаунта</span>
        </div>
      </div>
    </section>
  );
}

function DashboardCard({ title, description, icon, accent, onClick }) {
  return (
    <button className={`dashboard-card dashboard-card--${accent}`} onClick={onClick}>
      <span className="dashboard-card__icon">{icon}</span>
      <span className="dashboard-card__title">{title}</span>
      <span className="dashboard-card__description">{description}</span>
      <span className="dashboard-card__arrow">→</span>
    </button>
  );
}

function Profile({ session, onUpdated }) {
  const user = session.user;
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    password: ""
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setSaved(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);

    if (form.password && form.password.length < 8) {
      setError("Новый пароль должен содержать минимум 8 символов.");
      return;
    }

    setBusy(true);

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email
      };

      if (form.password) {
        payload.password = form.password;
      }

      await updateUser(user.id, payload);
      const freshUser = await getCurrentUser(user.id);

      setForm((current) => ({ ...current, password: "" }));
      setSaved(true);
      onUpdated(freshUser);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Учётная запись</span>
          <h2>Мой профиль</h2>
          <p>Управляйте данными, связанными с вашей учётной записью.</p>
        </div>
        <Avatar user={user} large />
      </div>

      <div className="profile-layout">
        <div className="profile-card profile-card--identity">
          <Avatar user={user} large />
          <h3>{user.first_name} {user.last_name}</h3>
          <p>{user.email}</p>
          <span className="role-badge">{user.role || "Пользователь"}</span>
        </div>

        <form className="profile-card form" onSubmit={submit}>
          <div className="card-heading">
            <div>
              <span className="eyebrow">Персональные данные</span>
              <h3>Информация профиля</h3>
            </div>
          </div>

          <div className="form-row">
            <Field label="Имя" value={form.first_name} onChange={update("first_name")} required />
            <Field label="Фамилия" value={form.last_name} onChange={update("last_name")} required />
          </div>

          <Field label="Email" type="email" value={form.email} onChange={update("email")} required />

          <Field
            label="Новый пароль"
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="Оставьте пустым, если менять не нужно"
            autoComplete="new-password"
          />

          {error && <div className="form-error">{error}</div>}
          {saved && <div className="form-success">Изменения сохранены.</div>}

          <div className="form-actions">
            <button className="button button--primary" disabled={busy}>
              {busy ? "Сохранение…" : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <div className="page-heading page-heading--compact">
        <div>
          <span className="eyebrow">Администрирование</span>
          <h2>Пользователи</h2>
          <p>Список зарегистрированных аккаунтов MedTrack.</p>
        </div>
        <div className="stat-pill">
          <strong>{users.length}</strong>
          <span>аккаунтов</span>
        </div>
      </div>

      <div className="table-card">
        {loading && <div className="empty-state"><div className="spinner" />Загрузка пользователей…</div>}
        {!loading && error && <div className="empty-state empty-state--error">{error}</div>}
        {!loading && !error && users.length === 0 && (
          <div className="empty-state">Пользователей пока нет.</div>
        )}
        {!loading && !error && users.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-user">
                        <Avatar user={item} />
                        <strong>{item.first_name} {item.last_name}</strong>
                      </div>
                    </td>
                    <td>{item.email}</td>
                    <td><span className="role-badge role-badge--small">{item.role}</span></td>
                    <td className="muted">#{item.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

window.addEventListener("open-profile", () => {
  // The dashboard card remains intentionally lightweight; navigation is handled by the sidebar.
});
