import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {

  Truck,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import IstatistikKarti from "../bilesenler/IstatistikKarti";
import DurumRozeti from "../bilesenler/DurumRozeti";

export default function BanaGelenSevkiyatlar() {
  const navigate = useNavigate();
  const [sevkiyatlar, setSevkiyatlar] = useState([]);

  useEffect(() => {
    async function sevkiyatlariGetir() {
      try {
        const aktifKullanici = JSON.parse(
          localStorage.getItem("aktifKullanici")
        );

        const cevap = await fetch("http://localhost:5000/api/sevkiyatlar");
        const veri = await cevap.json();

        const filtreliVeri = veri.filter(
          (sevkiyat) =>
            sevkiyat.teslimDurumu !== "Teslim Edildi" &&
            sevkiyat.aliciKurumAdi === aktifKullanici?.kurumAdi
        );

        setSevkiyatlar(filtreliVeri);
      } catch (hata) {
        console.error("Alıcı sevkiyatları alınamadı:", hata);
      }
    }

    sevkiyatlariGetir();
  }, []);

  const yoldakiSevkiyat = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.tasimaDurumu === "Yolda"
  ).length;

  const guvenliSevkiyat = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.riskDurumu === "Güvenli"
  ).length;

  const riskliSevkiyat = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.riskDurumu === "Riskli"
  ).length;


  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Bana Gelen Sevkiyatlar</h1>
        <p>Kurumunuza gönderilen aktif aşı sevkiyatlarını görüntüleyin.</p>
      </div>

      <div className="istatistik-grid dortlu-grid">
        <IstatistikKarti
          baslik="Yoldaki Sevkiyat"
          deger={yoldakiSevkiyat}
          renkSinifi="mavi-kart"
          ikon={<Truck />}
        />

        <IstatistikKarti
          baslik="Güvenli Sevkiyat"
          deger={guvenliSevkiyat}
          renkSinifi="yesil-kart"
          ikon={<ShieldCheck />}
        />

        <IstatistikKarti
          baslik="Riskli Sevkiyat"
          deger={riskliSevkiyat}
          renkSinifi="sari-kart"
          ikon={<AlertTriangle />}
        />

        
      </div>

      <div className="sevkiyat-kart-grid">
        {sevkiyatlar.map((sevkiyat) => (
          <article key={sevkiyat._id} className="sevkiyat-karti">
            <div className="sevkiyat-kart-ust">
              <div>
                <h2>{sevkiyat.partiNo}</h2>
                <p>{sevkiyat.asiAdi} / {sevkiyat.dozSayisi}</p>
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
              {sevkiyat.cikisNoktasi} → {sevkiyat.varisNoktasi}
            </div>

            <div className="sevkiyat-sicaklik-alani">
              <div>
                <span>Anlık Sıcaklık</span>
                <strong>{sevkiyat.sonSicaklik}°C</strong>
              </div>

              <div>
                <span>İzin Verilen Aralık</span>
                <strong>
                  {sevkiyat.minSicaklik}°C - {sevkiyat.maxSicaklik}°C
                </strong>
              </div>
            </div>

            <div className="mini-bilgi-grid">
              <p>
                <b>Tahmini Teslim:</b> {sevkiyat.tahminiTeslimSuresi}
              </p>

              <p>
                <b>Araç:</b> {sevkiyat.tasimaAraci}
              </p>

              <p>
                <b>Blockchain:</b> {sevkiyat.blockchainDurumu}
              </p>

              <p>
                <b>Teslim:</b> {sevkiyat.teslimDurumu}
              </p>

              <p>
                <b>Alarm:</b>{" "}
                {sevkiyat.riskDurumu === "Riskli" ? "Var" : "Yok"}
              </p>
            </div>

            <div className="kart-butonlari">
              <button
                className="buton buton-acik"
                onClick={() =>
                  alert(
                    `Sevkiyat Detayı\n\nParti No: ${sevkiyat.partiNo}\nAşı: ${sevkiyat.asiAdi}\nRota: ${sevkiyat.cikisNoktasi} → ${sevkiyat.varisNoktasi}\nTaşıma Durumu: ${sevkiyat.tasimaDurumu}\nRisk Durumu: ${sevkiyat.riskDurumu}\nTeslim Durumu: ${sevkiyat.teslimDurumu}\nBlockchain: ${sevkiyat.blockchainDurumu}`
                  )
                }
              >
                Detay
              </button>

              <button
                className="buton buton-mavi"
                onClick={() => navigate("/alici/canli-izleme")}
              >
                Canlı İzle
              </button>

              <button
                className="buton buton-yesil"
                onClick={() => navigate("/alici/teslim-onayi")}
              >
                Teslim Al
              </button>
            </div>
          </article>
        ))}

        {sevkiyatlar.length === 0 && (
          <section className="beyaz-panel">
            Kurumunuza gelen aktif sevkiyat bulunmuyor.
          </section>
        )}
      </div>
    </div>
  );
}