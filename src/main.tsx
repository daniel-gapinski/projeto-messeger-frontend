import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './routes'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FriendsProvider } from './contexts/FriendsContext'
import { ChatProvider } from './contexts/ChatContext'
import { ModalProvider } from './contexts/ModalContext'
import { ToastNotification } from './components/ToastNotification'
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FriendsProvider>
        <ModalProvider>
          <ChatProvider>
            <ToastNotification />
            <RouterProvider router={router} />
          </ChatProvider>
        </ModalProvider>
      </FriendsProvider>
    </AuthProvider>
  </StrictMode>,
)
