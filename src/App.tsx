import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useAuthStore } from "./store/useAuthStore";
import { useConstructorStore } from "./store/constructorStore";
import { useNotificationStore } from "./store/notificationStore";
import { getConstructorLanding } from "./api/constructor";
import { useAppStore } from "./store/useAppStore";

import { ComponentModal } from "./components/ui/modals/ComponentModal";
import { UserLanding } from "./components/userLanding/UserLanding";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { EmailConfirmed } from "./components/auth/EmailConfirmed";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Constructor } from "./components/dashboard/Constructor";
import { Account } from "./components/dashboard/Account";
import { Notification } from "./components/ui/notify/Notification";
import { Preview } from "./components/preview/Preview";
import { FullyVerifiedRoute } from "./components/layout/FullyVerifiedRoute";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { VotingManager } from "./components/dashboard/VotingManager";
import { MyAnimations } from "./components/dashboard/MyAnimations";
import { AnimationPreview } from "./components/dashboard/AnimationPreview";

export default function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const user = useAuthStore(state => state.user);
  const componentId = useConstructorStore((state) => state.selectedComponentId || "");
  const setSelectedComponentId = useConstructorStore((state) => state.setSelectedComponentId);
  const setSlug = useConstructorStore((state) => state.setSlug);
  const notify = useNotificationStore((state) => state.showNotification);
  const { setLandingData } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    const fetchConstructorData = async () => {
      try {
        const res = await getConstructorLanding();
        
        if (res.success) {
          const landingData = {
            slug: res.slug,
						audio: res.data.audio,
						introBtn: res.data.introBtn,
						playMusic: res.data.playMusic,
						components: res.data.components || []
					};
					
          if (res.slug) setSlug(res.slug);
					setLandingData(landingData);
        } else {
          const landingData = {
            slug: "",
						audio: "/audio/awakening.mp3",
						introBtn: "",
						playMusic: false,
						components: []
					};
					
					setLandingData(landingData);
          setSlug("");

          notify({ type: "error", message: res.message || "Не удалось загрузить данные конструктора" });
        }
      } catch {
        notify({ type: "error", message: "Ошибка при загрузке данных конструктора" });
      }
    };
    
    if ((location.pathname.includes("dashboard") || location.pathname.includes("preview")) && user?.subscriptionStatus === "active") {
      fetchConstructorData();
    }
  }, [location.pathname, user]);

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <>
      <ComponentModal
        isOpen={!!componentId}
        componentId={componentId}
        onClose={() => setSelectedComponentId(null)}
      />
      <Routes>
        <Route path="/:slug" element={<UserLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-confirmed" element={<EmailConfirmed />} />
        <Route 
          path="animation/:id"
          element={
            <FullyVerifiedRoute>
              <AnimationPreview />
            </FullyVerifiedRoute>
          }
        />
        <Route 
          path="preview/:slug"
          element={
            <FullyVerifiedRoute>
              <Preview />
            </FullyVerifiedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route 
            index 
            element={
              <ProtectedRoute>
                <MyAnimations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="constructor" 
            element={
              <FullyVerifiedRoute>
                <Constructor />
              </FullyVerifiedRoute>
            } 
          />
          <Route 
            path="voting" 
            element={
              <FullyVerifiedRoute>
                <VotingManager />
              </FullyVerifiedRoute>
            } 
          />
          <Route 
            path="account" 
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
      <Notification />
    </>
  );
}
