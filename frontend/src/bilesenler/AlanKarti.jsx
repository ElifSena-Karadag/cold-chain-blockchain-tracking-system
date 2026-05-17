export default function AlanKarti({ baslik, ikon, children }) {
  return (
    <section className="alan-karti">
      <div className="alan-ikonu">
        {ikon}
      </div>

      <div className="alan-icerigi">
        <h2>{baslik}</h2>
        {children}
      </div>
    </section>
  );
}