   import { useEffect, useState } from "react";
   import { Link } from "react-router";
   import { useAuth } from "../context/AuthContext";
   import { paymentApi } from "../lib/api";
   import { TIERS } from "../lib/tiers";
   import type { Receipt } from "../types";
   import "./AccountPage.css";

   function formatPrice(amountCents: number) {
     return `${(amountCents / 100).toLocaleString("sv-SE")} kr`;
   }

   function formatDate(isoDate: string) {
     return new Date(isoDate).toLocaleString("sv-SE", {
       dateStyle: "medium",
       timeStyle: "short",
     });
   }

   export default function AccountPage() {
     const { user } = useAuth();
     const [receipts, setReceipts] = useState<Receipt[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       paymentApi
         .receipts()
         .then((res) => setReceipts(res.receipts))
         .catch(() => setError("Kunde inte hämta dina kvitton just nu."))
         .finally(() => setLoading(false));
     }, []);

     if (!user) return null;

     const currentTier = TIERS.find((t) => t.level === user.membershipLevel);
     const tierName = (level: string) => TIERS.find((t) => t.level === level)?.name ?? level;

     return (
       <section className="account">
         <h1>Mitt konto</h1>

         <div className="account-card">
           <h2>{user.name ?? "Din profil"}</h2>
           <p>{user.email}</p>
           <p>
             Nuvarande nivå: <span className="account-level">{currentTier?.name}</span>
           </p>
           {user.membershipLevel !== "FULL" && (
             <Link to="/tiers" className="account-upgrade">
               Uppgradera din nivå →
             </Link>
           )}
         </div>

         <h2>Kvitton</h2>

         {loading && <p>Hämtar kvitton...</p>}

         {error && <p className="auth-error">{error}</p>}

         {!loading && !error && receipts.length === 0 && (
           <p>Du har inga kvitton än. När du uppgraderar din nivå dyker kvittot upp här.</p>
         )}

         {receipts.length > 0 && (
           <ul className="receipt-list">
             {receipts.map((receipt) => (
               <li key={receipt.id} className="receipt">
                 <div>
                   <strong>{tierName(receipt.membershipLevel)}</strong>
                   <div>{formatDate(receipt.createdAt)}</div>
                   <div className="receipt-number">{receipt.receiptNumber}</div>
                 </div>
                 <span className="receipt-amount">{formatPrice(receipt.amountCents)}</span>
               </li>
             ))}
           </ul>
         )}
       </section>
     );
   }