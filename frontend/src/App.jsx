import Header from "./components/Header";
import "./App.css";
import WorkDashboard from "./pages/AgentDashboard/WorkDashboard";
import CheckLocationVerify from "./pages/AgentDashboard/CheckLocationVerify";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CheckLocationMap from "./pages/AgentDashboard/CheckLocationMap";
import QandA from "./pages/AgentDashboard/QandA";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CheckLiveFace from "./pages/AgentDashboard/CheckLiveFace";
import CheckAadharCard from "./pages/AgentDashboard/CheckAadharCard";
import CheckAadharDetailsTable from "./pages/AgentDashboard/CheckAadharDetailsTable";
import CheckPanCard from "./pages/AgentDashboard/CheckPanCard";
import CheckPanDetailsTable from "./pages/AgentDashboard/CheckPanDetailsTable";
import FinalReport from "./pages/AgentDashboard/FinalReport";
import HorizontalStepper from "./components/HorizontalStepper";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import OtpPage from "./pages/OtpPage";

function AppContent() {
  const location = useLocation();

  const showStepperPaths = [
    '/check-location-map',
    '/question-answer',
    '/check-face',
    '/check-aadhar-face',
    '/check-aadhar-details-table',
    '/check-pan-face',
    '/check-pan-details-table'
  ];

  const showStepper = showStepperPaths.some(path =>
    location.pathname.includes(path)
  );

  const isAuthPage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/otp' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/forgot-password-otp' ||
    location.pathname === '/change-password' ||
    location.pathname === '/reset-password';

  return (
    <div className="App">
      {isAuthPage ? (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OtpPage mode="login" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/forgot-password-otp" element={<OtpPage mode="forgot" />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Routes>
      ) : (
        <>
          <Header />
          <div className="container-fluid">
            {showStepper && <HorizontalStepper />}
            <Routes>
              <Route path="/work-dashboard" element={<WorkDashboard />} />
              <Route path="/check-location" element={<CheckLocationVerify />} />
              <Route path="/check-location-map" element={<CheckLocationMap />} />
              <Route path="/question-answer" element={<QandA />} />
              <Route path="/check-face" element={<CheckLiveFace />} />
              <Route path="/check-aadhar-face" element={<CheckAadharCard />} />
              <Route path="/check-aadhar-details-table" element={<CheckAadharDetailsTable />} />
              <Route path="/check-pan-face" element={<CheckPanCard />} />
              <Route path="/check-pan-details-table" element={<CheckPanDetailsTable />} />
              <Route path="/final-report" element={<FinalReport />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (   
      <AppContent />
  );
}

export default App;
