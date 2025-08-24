import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { authFetch, logoutUser } from "../../api/auth";
import { useNotificationStore } from "../../store/notificationStore";
import { Svg } from "../svgs/Svg.module";
import Button from "../ui/button/Button";
import Typing from "../typing/Typing";

import styles from "./Dashboard.module.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const Dashboard = () => {
    const titles = {
        dashboard: "Дашборд",
        account: "Управление аккаунтом",
        constructor: "Конструктор",
        voting: "Управление голосованием"
    };

    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean); // убираем пустые сегменты
    const lastSegment = pathSegments[pathSegments.length - 1];

    const pageTitle = titles[lastSegment as keyof typeof titles] || "По умолчанию";

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
            <Button
                icon={<Svg svgName="Menu" size={{ xs: 40, sm: 40, md: 40, lg: 40 }} color="#FFFFFF" />}
                onClick={toggleDrawer}
                size="small"
                left={"20px"}
                top={"20px"}
                delay={0}
                limiter={window.innerWidth <= 768}
                color="#FFFFFF"
                btnColor="#000000"
            />

            <Typing
                text={pageTitle}
                className={`${styles.title} texturedType2`}
                showCursor={false}
                color="#000"
            />

            <AnimatePresence mode="wait">
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
                            initial={{ x: window.innerWidth <= 440 ? "-100%" : -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: window.innerWidth <= 440 ? "-100%" : -300 }}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            <div className={styles.drawerHeading}>
                                Здравствуй, {user?.name}
                                <div style={{ width: 40, height: 40 }}>
                                    <Button
                                        icon={<Svg svgName="Close" size={{ xs: 40, sm: 40, md: 40, lg: 40 }} color="#FFFFFF" />}
                                        onClick={toggleDrawer}
                                        size="flex"
                                        delay={0}
                                        limiter={window.innerWidth <= 768}
                                        color="#FFFFFF"
                                        btnColor="#000000"
                                    />
                                </div>
                            </div>

                            {!user?.emailVerified && (
                                <div className={styles.warningBox}>
                                    <div className={styles.message}>
                                        <Svg svgName="Warning" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#E05353" />
                                        <p>Email не подтвержден.</p>
                                    </div>
                                    <div style={{ height: 50 }}>
                                        <Button
                                            text="Отправить письмо повторно"
                                            onClick={onResendVerification}
                                            size="flex"
                                            delay={1}
                                            limiter={window.innerWidth <= 768}
                                            color="#FFFFFF"
                                            btnColor="#E05353"
                                            fontSize="1rem"
                                        />
                                    </div>
                                    {resendSuccess && (
                                        <div className={styles.successBox}>
                                            Письмо отправлено повторно
                                        </div>
                                    )}
                                </div>
                            )}

                            {(user?.subscriptionStatus !== "active") && (
                                <div className={styles.warningBox}>
                                    <div className={styles.message}>
                                        <Svg svgName="Warning" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#E05353" />
                                        <p>Подписка не оплачена.</p>
                                    </div>
                                    <div style={{ height: 50 }}>
                                        <Button
                                            text="Отправить письмо повторно"
                                            onClick={onGoToPayment}
                                            size="flex"
                                            delay={1}
                                            limiter={window.innerWidth <= 768}
                                            color="#FFFFFF"
                                            btnColor="#E05353"
                                            fontSize="1rem"
                                        />
                                    </div>
                                </div>
                            )}

                            <div style={{ height: 50 }}>
                                <Button
                                    text="Дашборд"
                                    onClick={() => navigate("/dashboard")}
                                    size="flex"
                                    delay={.2}
                                    limiter={window.innerWidth <= 768}
                                    color="#FFFFFF"
                                    btnColor={lastSegment === "dashboard" ? "rgba(0,0,0,1)" : "rgba(0,0,0,.65)"}
                                    fontSize="1rem"
                                />
                            </div>

                            {user?.emailVerified && user?.subscriptionStatus === "active" && (
                                <div className={styles.sections}>
                                    <div style={{ height: 50 }}>
                                        <Button
                                            text="Перейти в конструктор сайта"
                                            onClick={() => navigate("/dashboard/constructor")}
                                            size="flex"
                                            delay={.2}
                                            limiter={window.innerWidth <= 768}
                                            color="#FFFFFF"
                                            btnColor={lastSegment === "constructor" ? "rgba(0,0,0,1)" : "rgba(0,0,0,.65)"}
                                            fontSize="1rem"
                                        />
                                    </div>

                                    <div style={{ height: 50 }}>
                                        <Button
                                            text="Управление аккаунтом"
                                            onClick={() => navigate("/dashboard/account")}
                                            size="flex"
                                            delay={.4}
                                            limiter={window.innerWidth <= 768}
                                            color="#FFFFFF"
                                            btnColor={lastSegment === "account" ? "rgba(0,0,0,1)" : "rgba(0,0,0,.65)"}
                                            fontSize="1rem"
                                        />
                                    </div>

                                    <div style={{ height: 50 }}>
                                        <Button
                                            text="Предложения"
                                            onClick={() => navigate("/dashboard/voting")}
                                            size="flex"
                                            delay={.6}
                                            limiter={window.innerWidth <= 768}
                                            color="#FFFFFF"
                                            btnColor={lastSegment === "voting" ? "rgba(0,0,0,1)" : "rgba(0,0,0,.65)"}
                                            fontSize="1rem"
                                        />
                                    </div>
                                </div>
                            )}

                            <div style={{ height: 50 }}>
                                <Button
                                    text="Выйти"
                                    onClick={onLogout}
                                    size="flex"
                                    delay={.8}
                                    limiter={window.innerWidth <= 768}
                                    color="#FFFFFF"
                                    btnColor="#63C5AB"
                                    fontSize="1rem"
                                />
                            </div>
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
