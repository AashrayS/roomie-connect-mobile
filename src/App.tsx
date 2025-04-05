
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster'; // Using shadcn/ui Toaster
import { AuthProvider } from './contexts/AuthContext';
import { ListingProvider } from './contexts/ListingContext';
import { WhatsAppProvider } from './contexts/WhatsAppContext';
import { EmailAuth } from './pages/auth/EmailAuth';
import { ProfileSetup } from './pages/profile/ProfileSetup';
import { ListingsPage } from './pages/listings/ListingsPage';
import { CreateListingPage } from './pages/listings/CreateListingPage';
import { ListingDetailsPage } from './pages/listings/ListingDetailsPage';
import { EditListingPage } from './pages/listings/EditListingPage';
import { ProfileLayout } from './pages/profile/ProfileLayout';
import { PersonalInfoPage } from './pages/profile/PersonalInfoPage';
import { SavedListingsPage } from './pages/profile/SavedListingsPage';
import { AccountSettingsPage } from './pages/profile/AccountSettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ListingProvider>
          <WhatsAppProvider>
            <Toaster />
            <Routes>
              <Route path="/auth" element={<EmailAuth />} />
              <Route
                path="/profile-setup"
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="personal" element={<PersonalInfoPage />} />
                <Route path="saved" element={<SavedListingsPage />} />
                <Route path="account" element={<AccountSettingsPage />} />
                <Route index element={<Navigate to="personal" replace />} />
              </Route>
              <Route
                path="/listings"
                element={
                  <ProtectedRoute>
                    <ListingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listings/new"
                element={
                  <ProtectedRoute>
                    <CreateListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listings/:id"
                element={
                  <ProtectedRoute>
                    <ListingDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listings/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditListingPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/listings" replace />} />
            </Routes>
          </WhatsAppProvider>
        </ListingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
