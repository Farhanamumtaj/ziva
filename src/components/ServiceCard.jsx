export default function ServiceCard({ service }) {
  if (!service) return null;

  return (
    <div className="service-card">

      <div className="service-icon">
        {service.icon}
      </div>

      <div className="service-content">

        <span className="service-category">
          {service.category}
        </span>

        <h3>{service.tamilName}</h3>

        <p>{service.description}</p>

        {service.eligibility && (
          <>
            <h4>யார் விண்ணப்பிக்கலாம்?</h4>

            <ul>
              {service.eligibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {service.documents && (
          <>
            <h4>தேவையான ஆவணங்கள்</h4>

            <ul>
              {service.documents.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}

        <a
          href={service.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="official-button"
        >
          அதிகாரப்பூர்வ இணையதளம் ↗
        </a>

      </div>

    </div>
  );
}