import React from "react";

export default function Privacy() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Privacy Policy</h1>

        <p style={styles.text}>
          At <b>GamenetHub.com</b>, your privacy is extremely important to us.
          This Privacy Policy explains how we collect, use, share, and protect
          your information when you interact with our website. It also explains
          how we use third-party advertising services like Google AdSense.
        </p>

        <h2 style={styles.subtitle}>1. Information We Collect</h2>
        <p style={styles.text}>
          We may collect the following types of information:
          <br /><br />
          <b>• Usage data:</b> Games you play, pages you visit, time spent, IP address, device info, browser type. <br />
          <b>• Cookies & tracking:</b> We use cookies, local storage, and web beacons to enhance your experience. <br />
          <b>• Third-party data:</b> Google AdSense may collect additional data for targeted advertising.
        </p>

        <h2 style={styles.subtitle}>2. How We Use Your Information</h2>
        <p style={styles.text}>
          We use the collected data to:
          <br /><br />
          ✔ Improve website performance and user experience <br />
          ✔ Serve relevant ads through Google AdSense <br />
          ✔ Analyze user behavior (game trends, popular pages) <br />
          ✔ Prevent fraud and maintain platform security
        </p>

        <h2 style={styles.subtitle}>3. Google AdSense & Advertising</h2>
        <p style={styles.text}>
          GamenetHub uses Google AdSense for displaying advertisements.
          Google may use cookies to:
          <br /><br />
          • Show ads based on your visits to this and other websites <br />
          • Track interactions with ads <br />
          • Personalize ad recommendations <br /><br />
          To learn how Google uses collected data, please refer to Google’s
          official Privacy & Terms documentation.
        </p>

        <h2 style={styles.subtitle}>4. User Consent & Opt-Out Options</h2>
        <p style={styles.text}>
          Depending on your region, we may ask for cookie consent.
          You may opt-out of personalized ads by:
          <br /><br />
          • Visiting Google Ad Settings <br />
          • Managing or deleting cookies in your browser settings <br /><br />
          Note: Disabling cookies may affect site functionality.
        </p>

        <h2 style={styles.subtitle}>5. Sharing of Information</h2>
        <p style={styles.text}>
          We <b>do not sell</b> your personal information.  
          We may share:
          <br /><br />
          • Aggregated or anonymized data for analytics <br />
          • Data required by Google AdSense for ad delivery <br />
          • Information when required by law or to protect platform security
        </p>

        <h2 style={styles.subtitle}>6. Data Security</h2>
        <p style={styles.text}>
          We use reasonable security measures to protect your data.
          However, no online platform is 100% secure.
          We cannot guarantee absolute protection against unauthorized access.
        </p>

        <h2 style={styles.subtitle}>7. Your Rights</h2>
        <p style={styles.text}>
          Depending on your location, you may have rights to:
          <br /><br />
          • Request access to your personal data <br />
          • Ask for corrections or deletion <br />
          • Restrict or object to certain data uses <br /><br />
          To exercise these rights, contact us at:  
          <b> <a style={styles.a} href="mailto:gamenethubs@gmail.com">gamenethubs@gmail.com</a></b>
        </p>

        <h2 style={styles.subtitle}>8. Data Retention</h2>
        <p style={styles.text}>
          We keep personal data only as long as necessary to provide our
          services or comply with legal requirements.  
          Anonymized data may be stored indefinitely for analytics.
        </p>

        <h2 style={styles.subtitle}>9. Updates to This Policy</h2>
        <p style={styles.text}>
          We may update this Privacy Policy from time to time.
          Updated policies will be posted on this page with a revised “Last Updated” date.
          Continued use of GamenetHub means you accept the updated policy.
        </p>

        <h2 style={styles.subtitle}>10. Contact Information</h2>
        <p style={styles.text}>
          For questions or concerns about this Privacy Policy, contact us:
          <br /><br />
          <b>Email:</b> <a style={styles.a} href="mailto:gamenethubs@gmail.com">gamenethubs@gmail.com</a> <br />
          
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "40px 16px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 900,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e6f0ff",
    boxSizing: "border-box",
  },
  a:{
    color: "#ffffffff",
    fontWeight: "bold",
  },

  title: {
    fontSize: "26px",
    fontWeight: 800,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginTop: 22,
    marginBottom: 10,
    color: "#fff",
  },
  text: {
    color: "#cdd7f5",
    lineHeight: 1.7,
    marginBottom: 16,
    fontSize: "15px",
  },

  "@media (max-width: 480px)": {
    title: { fontSize: "22px" },
    subtitle: { fontSize: "18px" },
    text: { fontSize: "14px" },
    card: { padding: "18px" },
  },
};
