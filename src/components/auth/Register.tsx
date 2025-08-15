import React, { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../../api/auth";
import { registerSchema } from "../../validation/register";
import type { z } from "zod";
import { Link } from "react-router-dom";
import { useNotificationStore } from "../../store/notificationStore";

import styles from "./Register.module.css";

type RegisterInput = z.infer<typeof registerSchema> & { promoCode?: string };

const landingUrl = import.meta.env.VITE_LANDING_URL;

export const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    promoCode: "",
  });
  const [loading, setLoading] = useState(false);

  const notify = useNotificationStore((state) => state.showNotification);

  const handleChange = (field: keyof RegisterInput, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.format();
      const firstError =
        fieldErrors.name?._errors[0] ||
        fieldErrors.email?._errors[0] ||
        fieldErrors.password?._errors[0] ||
        "Ошибка валидации";
      notify({ type: "error", message: firstError });
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(form);
      localStorage.setItem("accessToken", result.accessToken);
      notify({ type: "success", message: result.message || "Успешная регистрация" });
    } catch (e: any) {
      notify({ type: "error", message: e.message || "Ошибка регистрации" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <a href={landingUrl} className={styles.backButton}>
        ← Вернуться на лендинг
      </a>
      <motion.div 
        className={styles.registerWrapper}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className={styles.title}>Регистрация</h1>
        <input
          type="text"
          placeholder="Имя"
          className={styles.input}
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className={styles.input}
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        {/* Поле для промокода */}
        <input
          type="text"
          placeholder="Промокод (если есть)"
          className={styles.input}
          value={form.promoCode}
          onChange={(e) => handleChange("promoCode", e.target.value)}
        />
        <button
          className={styles.button}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
        <div className={styles.switchAuth}>
          Есть аккаунт? <Link to="/login">Вход</Link>
        </div>
      </motion.div>
    </div>
  );
};
