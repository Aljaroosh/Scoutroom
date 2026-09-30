   import { Link } from "react-router";
   import { useAuth } from "../context/AuthContext";
   import "./HomePage.css";

   const FEATURES = [
     {
       icon: "📋",
       title: "Spelarprofiler",
       text: "Utforska spelare från klubbar i hela Europa med position, ålder och grundläggande statistik.",
     },
     {
       icon: "📝",
       title: "Scoutrapporter",
       text: "Läs djupgående rapporter om styrkor, svagheter och potential, skrivna av erfarna scouter.",
     },
     {
       icon: "⚖️",
       title: "Jämför spelare",
       text: "Ställ spelare sida vid sida och se direkt vem som passar din trupp bäst.",
     },
     {
       icon: "⭐",
       title: "Egna scoutlistor",
       text: "Bygg dina egna bevakningslistor och sätt betyg på spelarna du följer.",
     },
   ];

   export default function HomePage() {
     const { user } = useAuth();

     return (
       <section className="home">
         <div className="home-hero">
           <h1>Hitta nästa stjärna före alla andra ⚽</h1>
           <p>
             ScoutRoom samlar spelarprofiler, scoutrapporter och analysverktyg på ett ställe,
             byggt för dig som jobbar med talangscouting.
           </p>

           <div className="home-actions">
             {user ? (
               <Link to="/tiers" className="home-button">Se dina nivåer</Link>
             ) : (
               <>
                 <Link to="/register" className="home-button">Kom igång gratis</Link>
                 <Link to="/tiers" className="home-button home-button--outline">Se nivåer och priser</Link>
               </>
             )}
           </div>
         </div>

         <div className="home-features">
           {FEATURES.map((feature) => (
             <article key={feature.title} className="home-feature">
               <span className="home-feature-icon">{feature.icon}</span>
               <h3>{feature.title}</h3>
               <p>{feature.text}</p>
             </article>
           ))}
         </div>
       </section>
     );
   }