import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../../api/auth"; 
import { Link, useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../store/notificationStore";
import { useAuthStore } from "../../store/useAuthStore";

import styles from "./Login.module.css";

const landingUrl = import.meta.env.VITE_LANDING_URL;

export const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const notify = useNotificationStore((state) => state.showNotification);
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            notify({ type: "error", message: "Email и пароль обязательны" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            notify({ type: "error", message: "Некорректный формат email" });
            return;
        }

        setLoading(true);

        try {
            let data = await loginUser({ email, password }); 

            if (data.success) {
                notify({ type: "success", message: "Вы успешно авторизовались" });
                localStorage.setItem("accessToken", data.accessToken);
                setUser(data.user);
                navigate("/dashboard");
            } else {
                notify({ type: "error", message: data.message || "Ошибка при входе" });
            }
        } catch (e: any) {
            notify({ type: "error", message: e.message || "Ошибка при входе" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <a href={landingUrl} className={styles.backButton}>
                ← Вернуться на лендинг
            </a>
            <motion.div 
                className={styles.loginWrapper}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h1 className={styles.title}>Вход</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <button
                    className={styles.button}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Загрузка..." : "Войти"}
                </button>
                <div className={styles.switchAuth}>
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </div>
            </motion.div>
        </div>
    );
};
