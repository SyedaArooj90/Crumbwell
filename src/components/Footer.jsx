function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">Hearth &amp; Crumb</p>
          <p>Baked daily from four in the morning, Multan.</p>
        </div>
        <div>
          <p className="footer-heading">Visit</p>
          <p>Cantonment Bazaar, Multan</p>
          <p>Tue–Sun, 7am–8pm</p>
        </div>
        <div>
          <p className="footer-heading">Reach us</p>
          <p>hello@hearthandcrumb.pk</p>
          <p>+92 300 000 0000</p>
        </div>
      </div>
      <p className="footer-line">© {new Date().getFullYear()} Hearth &amp; Crumb. All loaves accounted for.</p>
    </footer>
  )
}

export default Footer
