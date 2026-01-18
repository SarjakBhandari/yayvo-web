import Image from "next/image";
import ConsumerRegisterForm from "../../_components/consumerRegistraionForm";


export default function Page() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <Image
            src="/images/logo.png"
            alt="Yayvo Logo"
            width={90}
            height={90}
            priority
          />
          <h1 className="auth-title">Create Consumer Account</h1>
          <p style={{ opacity: 0.9, marginTop: "0.5rem", textAlign: "center" }}>
            Join Yayvo and start your journey with us
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <ConsumerRegisterForm />
        </div>
      </div>
    </div>
  );
}
