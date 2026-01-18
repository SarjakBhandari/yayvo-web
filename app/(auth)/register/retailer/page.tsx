import RetailerRegisterForm from "../../_components/retailerRegistrationForm";

export default function Page() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <h1 className="auth-title">Create Retailer Account</h1>
          <p style={{ opacity: 0.9, marginTop: "0.5rem", textAlign: "center" }}>
            Join Yayvo and register your store
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <RetailerRegisterForm />
        </div>
      </div>
    </div>
  );
}
