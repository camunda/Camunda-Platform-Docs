import React from "react";
import "./_zeebe-table.css";

const ZeebeCard = ({ link, title, image, description }) => {
  return (
    <a href={link} className="zeebe-card" title={title}>
      <img src={image} alt={`${title} icon`} className="zeebe-card-image" />
      <h3>{title}</h3>
      <p>{description}</p>
    </a>
  );
};

const ZeebeGrid = ({ zeebe }) => {
  return (
    <div className="zeebe-grid">
      {zeebe.map((zeebe, index) => (
        <ZeebeCard
          key={index}
          link={zeebe.link}
          title={zeebe.title}
          image={zeebe.image}
          description={zeebe.description}
        />
      ))}
    </div>
  );
};

export default ZeebeGrid;
