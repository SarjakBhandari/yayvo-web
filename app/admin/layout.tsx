import { ToastContainer } from "react-toastify";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section>
            <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
            {children}
        </section>
    );
}