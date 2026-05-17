export default function IstatistikKarti({ baslik, deger, ikon, renkSinifi }) {
  return (
    <div className={`istatistik-karti ${renkSinifi}`}>
      <div>
        <p>{baslik}</p>
        <h2>{deger}</h2>
      </div>

      <div className="istatistik-ikon">
        {ikon}
      </div>
    </div>
  );
}