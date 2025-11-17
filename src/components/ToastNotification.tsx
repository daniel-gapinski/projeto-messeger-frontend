import { Toaster, toast } from "react-hot-toast";

export const ToastNotification = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: "#333",
        color: "#fff",
        borderRadius: "10px",
        fontSize: "0.9rem",
      },
      success: {
        iconTheme: {
          primary: "#4ade80",
          secondary: "#333",
        },
      },
      error: {
        iconTheme: {
          primary: "#f87171",
          secondary: "#333",
        },
      },
    }}
  />
);

type ToastMessages = {
  loading: string;
  success: string;
  error: string | ((err: any) => string);
};

export const notify = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  loading: (msg: string) => toast.loading(msg),
  promise: (promise: Promise<any>, messages: ToastMessages) =>
    toast.promise(promise, messages),
};
