import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { authFetch, logoutUser } from "../../api/auth";
import { useNotificationStore } from "../../store/notificationStore";
import { Svg } from "../svgs/Svg.module";

import styles from "./Dashboard.module.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, clearAuth } = useAuthStore();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    const notify = useNotificationStore((state) => state.showNotification);

    const onResendVerification = async () => {
        try {
            await authFetch(`${apiBaseUrl}/api/auth/resend-email`);
            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 3000);
        } catch (e) {
            console.error("Ошибка при повторной отправке письма:", e);
        }
    };

    const onGoToPayment = () => {
        navigate("/dashboard/account");
    };

    const toggleDrawer = () => {
        setDrawerOpen(prev => !prev);
    };

    const onLogout = async () => {
        try {
            let data = await logoutUser(); 

            if (data.success) {
                notify({ type: "success", message: data.message });
                clearAuth();
            } else {
                notify({ type: "error", message: data.message || "Ошибка при выходе" });
            }
        } catch (e: any) {
            notify({ type: "error", message: e.message || "Ошибка при выходе" });
        } 
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                setDrawerOpen(false);
            }
        };

        if (drawerOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [drawerOpen]);

    return (
        <div className={styles.dashboardPage}>
            <button onClick={toggleDrawer} className={`button ${styles.drawerToggle}`}>
                <Svg svgName="Menu" size={{ xs: 40, sm: 40, md: 40, lg: 40 }} color="#FFFFFF" />
            </button>

            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            className={styles.drawerOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            ref={drawerRef}
                            className={styles.drawer}
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            <div className={styles.drawerHeading}>
                                Здравствуй, {user?.name}
                                <button
									className={`${styles.close} buttonLight`}
									onClick={toggleDrawer}
								>
									<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
								</button>
                            </div>

                            {!user?.emailVerified && (
                                <div className={styles.warningBox}>
                                    <p>Email не подтвержден.</p>
                                    <button
                                        className="buttonLight"
                                        onClick={onResendVerification}
                                    >
                                        Отправить письмо повторно
                                    </button>
                                    {resendSuccess && (
                                        <div className={styles.successBox}>
                                            Письмо отправлено повторно
                                        </div>
                                    )}
                                </div>
                            )}

                            {(user?.subscriptionStatus !== "active") && (
                                <div className={styles.warningBox}>
                                    <p>Подписка не оплачена.</p>
                                    <button
                                        className="buttonLight"
                                        onClick={onGoToPayment}
                                    >
                                        Перейти к оплате
                                    </button>
                                </div>
                            )}

                            {user?.emailVerified && user?.subscriptionStatus === "active" && (
                                <div className={styles.sections}>
                                    <button
                                        className="buttonLight"
                                        onClick={() => navigate("/dashboard/constructor")}
                                    >
                                        Перейти в конструктор сайта
                                    </button>

                                    <button
                                        className="buttonLight"
                                        onClick={() => navigate("/dashboard/account")}
                                    >
                                        Управление аккаунтом
                                    </button>

                                    <button
                                        className="buttonLight"
                                        onClick={() => navigate("/dashboard/voting")}
                                    >
                                        Предложения
                                    </button>
                                </div>
                            )}

                            <button
                                className="button"
                                onClick={onLogout}
                            >
                                Выйти
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className={styles.contentArea}>
                <Outlet />
            </div>
        </div>
    );
};
