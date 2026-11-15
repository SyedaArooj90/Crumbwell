const openings = ['Line baker (morning shift)', 'Front counter staff', 'Pastry apprentice']

function Careers() {
  return (
    <section className="page-header">
      <p className="hero-kicker">Join us</p>
      <h1>Careers</h1>
      <ul>
        {openings.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>
    </section>
  )
}

export default Careers