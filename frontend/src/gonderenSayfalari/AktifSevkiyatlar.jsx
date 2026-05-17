import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import DurumRozeti from "../bilesenler/DurumRozeti";

export default function AktifSevkiyatlar() {
  const navigate = useNavigate();

  const [sevkiyatlar, setSevkiyatlar] = useState([]);
  const [arama, setArama] = useState("");
  
  const [riskFiltresi, setRiskFiltresi] =
    useState("Tüm Risk Durumları");
  const [asiFiltresi, setAsiFiltresi] =
    useState("Tüm Aşılar");

  useEffect(() => {
    async function sevkiyatlariGetir() {
      try {
        const cevap = await fetch(
          "http://localhost:5000/api/sevkiyatlar"
        );

        const veri = await cevap.json();

        const aktifSevkiyatlar = veri.filter(
          (sevkiyat) =>
            sevkiyat.teslimDurumu !== "Teslim Edildi"
        );

        setSevkiyatlar(aktifSevkiyatlar);
      } catch (hata) {
        console.error("Sevkiyatlar alınamadı:", hata);
      }
    }

    sevkiyatlariGetir();
  }, []);

  const filtrelenmisSevkiyatlar = sevkiyatlar.filter(
    (sevkiyat) => {
      const aramaMetni = arama.toLowerCase();

      const aramaUyuyor =
        sevkiyat.partiNo
          ?.toLowerCase()
          .includes(aramaMetni) ||
        sevkiyat.asiAdi
          ?.toLowerCase()
          .includes(aramaMetni) ||
        sevkiyat.aliciKurumAdi
          ?.toLowerCase()
          .includes(aramaMetni);

      

      const riskUyuyor =
        riskFiltresi === "Tüm Risk Durumları" ||
        sevkiyat.riskDurumu === riskFiltresi;

      const asiUyuyor =
        asiFiltresi === "Tüm Aşılar" ||
        sevkiyat.asiAdi === asiFiltresi;

      return (
        aramaUyuyor  &&
        riskUyuyor &&
        asiUyuyor
      );
    }
  );

  const asiSecenekleri = [
    "Tüm Aşılar",
    ...new Set(
      sevkiyatlar.map((sevkiyat) => sevkiyat.asiAdi)
    ),
  ];

  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Aktif Sevkiyatlar</h1>

        <p>
          Devam eden aşı sevkiyatlarını görüntüleyin ve
          takip edin.
        </p>
      </div>

      <div className="filtre-cubugu">
        <div className="arama-kutusu">
          <Search size={18} />

          <input
            placeholder="Sevkiyat ID / Aşı / Alıcı kurum ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>

        
        <select
          value={riskFiltresi}
          onChange={(e) => setRiskFiltresi(e.target.value)}
        >
          <option>Tüm Risk Durumları</option>
          <option>Güvenli</option>
          <option>Riskli</option>
        </select>

        <select
          value={asiFiltresi}
          onChange={(e) => setAsiFiltresi(e.target.value)}
        >
          {asiSecenekleri.map((asi) => (
            <option key={asi} value={asi}>
              {asi}
            </option>
          ))}
        </select>
      </div>

      <div className="sevkiyat-kart-grid">
        {filtrelenmisSevkiyatlar.map((sevkiyat) => (
          <article
            className="sevkiyat-karti"
            key={sevkiyat._id}
          >
            <div className="sevkiyat-kart-ust">
              <div>
                <h2>{sevkiyat.partiNo}</h2>

                <p>
                  {sevkiyat.asiAdi} / {sevkiyat.dozSayisi}
                </p>
              </div>

              <div className="durum-rozet-grup">
                <DurumRozeti
                  tip={
                    sevkiyat.tasimaDurumu === "Yolda"
                      ? "mavi"
                      : "yesil"
                  }
                >
                  {sevkiyat.tasimaDurumu}
                </DurumRozeti>

                <DurumRozeti
                  tip={
                    sevkiyat.riskDurumu === "Riskli"
                      ? "kirmizi"
                      : "yesil"
                  }
                >
                  {sevkiyat.riskDurumu}
                </DurumRozeti>
              </div>
            </div>

            <div className="rota-yazisi">
              {sevkiyat.cikisNoktasi} →{" "}
              {sevkiyat.varisNoktasi}
            </div>

            <div className="sevkiyat-sicaklik-alani">
              <div>
                <span>Anlık Sıcaklık</span>

                <strong>
                  {sevkiyat.sonSicaklik}°C
                </strong>
              </div>

              <div>
                <span>İzin Verilen Aralık</span>

                <strong>
                  {sevkiyat.minSicaklik}°C -{" "}
                  {sevkiyat.maxSicaklik}°C
                </strong>
              </div>
            </div>

            <div className="mini-bilgi-grid">
              <p>
                <b>Alıcı:</b> {sevkiyat.aliciKurumAdi}
              </p>

              <p>
                <b>Araç:</b> {sevkiyat.tasimaAraci}
              </p>

              <p>
                <b>Blockchain:</b>{" "}
                {sevkiyat.blockchainDurumu}
              </p>

              <p>
                <b>Teslim:</b>{" "}
                {sevkiyat.teslimDurumu}
              </p>

              <p>
                <b>Oluşturulma:</b>{" "}
                {new Date(
                  sevkiyat.createdAt
                ).toLocaleDateString("tr-TR")}
              </p>
            </div>

            <div className="kart-butonlari">
              <button
                className="buton buton-acik"
                onClick={() =>
                  alert(
                    `Sevkiyat Detayı\n\nParti No: ${sevkiyat.partiNo}\nAşı: ${sevkiyat.asiAdi}\nAlıcı: ${sevkiyat.aliciKurumAdi}\nRota: ${sevkiyat.cikisNoktasi} → ${sevkiyat.varisNoktasi}\nTaşıma Durumu: ${sevkiyat.tasimaDurumu}\nRisk Durumu: ${sevkiyat.riskDurumu}\nTeslim Durumu: ${sevkiyat.teslimDurumu}`
                  )
                }
              >
                Detay Gör
              </button>

              <button
                className="buton buton-yesil"
                onClick={() =>
                  navigate("/gonderen/canli-izleme")
                }
              >
                Canlı İzle
              </button>

              <button
                className="buton buton-mavi"
                onClick={() =>
                  navigate(
                    "/gonderen/blockchain-kayitlari"
                  )
                }
              >
                Blockchain
              </button>
            </div>
          </article>
        ))}

        {filtrelenmisSevkiyatlar.length === 0 && (
          <section className="beyaz-panel">
            Filtrelere uygun aktif sevkiyat bulunamadı.
          </section>
        )}
      </div>
    </div>
  );
}