import Image from "next/image";

export default function Page() {
  return (
    <div>
      {/* Header */}
      <header>
        <div className="container inner">
          <div className="logo flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Yayvo Logo"
              width={40}
              height={40}
              priority
            />
            <span>Yayvo</span>
          </div>

          {/* These buttons can be hidden on mobile if desired */}
          <div className="flex gap-4 hide-on-mobile">
            <button className="btn btn-outline">Login</button>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <h1>
          Products That <span>Feel Right</span>
        </h1>
        <p>
          Express how products make you feel with emojis, stories, and authentic sentiment.
        </p>
        <p className="mt-4 text-lg text-gray-600">
          Instead of star ratings, Yayvo highlights{" "}
          <strong>sentiment-based reviews</strong> — showing how products truly
          make people feel.
        </p>

        {/* Centered button group */}
        <div className="button-group">
          <button className="btn btn-primary">Start as Consumer</button>
          <button className="btn btn-primary">Start as Retailer</button>
          <button className="btn btn-outline">
            Already have an account? Login
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="section container grid-3">
        <div className="card">
          <h3>Emotion-First Discovery</h3>
          <p>
            Find products based on how they make you feel, not just what they
            do.
          </p>
        </div>
        <div className="card">
          <h3>Personalized For You</h3>
          <p>Recommendations tailored to your mood and lifestyle.</p>
        </div>
        <div className="card">
          <h3>Authentic Community</h3>
          <p>Connect with real people sharing genuine experiences.</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>
          © {new Date().getFullYear()} Yayvo — Lifestyle discovery through
          emotional design · Web API coursework
        </p>
      </footer>
    </div>
  );
}
