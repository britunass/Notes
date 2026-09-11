import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';

export function AuthForm({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = isLogin ? { email, password, rememberMe } : { email, password };
      const authFn = isLogin ? loginUser : registerUser;
      const response = await authFn(payload);

      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        onLoginSuccess();
      } else if (!isLogin) {
        alert('Регистрация успешна! Теперь войдите в систему.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        (isLogin ? 'Ошибка при входе в систему' : 'Ошибка при регистрации')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '15px', color: '#fff' }}>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          {isLogin && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Запомнить меня
            </label>
          )}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <span 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }} 
            style={styles.toggleLink}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#181818',
    color: '#fff',
  },
  card: {
    padding: '30px',
    borderRadius: '8px',
    backgroundColor: '#262626',
    width: '320px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '15px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    outline: 'none',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '5px',
  },
  error: {
    color: '#ff4d4d',
    marginBottom: '10px',
    fontSize: '14px',
  },
  toggleText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#ccc',
  },
  toggleLink: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};