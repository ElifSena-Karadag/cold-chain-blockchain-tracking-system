import { useEffect, useState } from "react";

import {
  Thermometer,
  AlertTriangle,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import IstatistikKarti from "../bilesenler/IstatistikKarti";
import DurumRozeti from "../bilesenler/DurumRozeti";

export default function SicaklikGecmisi() {
  const [sevkiyatlar, setSevkiyatlar] = useState([]);
  const [aktifSevkiyat, setAktifSevkiyat] = useState(null);
  const [sicaklikKayitlari, setSicaklikKayitlari] = useState([]);

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
            sevkiyat.aliciKurumAdi === aktifKullanici?.kurumAdi
        );

        setSevkiyatlar(filtreliVeri);
        setAktifSevkiyat(filtreliVeri[0] || null);
      } catch (hata) {
        console.error("Sevkiyatlar alınamadı:", hata);
      }
    }

    sevkiyatlariGetir();
  }, []);

  useEffect(() => {
    async function sicakliklariGetir() {
      if (!aktifSevkiyat) return;

      try {
        const cevap = await fetch(
          `http://localhost:5000/api/sicaklik/${aktifSevkiyat._id}`
        );

        const veri = await cevap.json();
        setSicaklikKayitlari(veri);
      } catch (hata) {
        console.error("Sıcaklık kayıtları alınamadı:", hata);
      }
    }

    sicakliklariGetir();
  }, [aktifSevkiyat]);

  if (!aktifSevkiyat) {
    return (
      <div className="sayfa">
        <div className="sayfa-basligi kompakt-baslik">
          <h1>Sıcaklık Geçmişi</h1>
          <p>Kurumunuza ait sıcaklık geçmişi gösterilecek sevkiyat bulunamadı.</p>
        </div>
      </div>
    );
  }

  const sicakliklar = sicaklikKayitlari.map((kayit) => kayit.sicaklik);

  const enYuksek = sicakliklar.length > 0 ? Math.max(...sicakliklar) : 0;
  const enDusuk = sicakliklar.length > 0 ? Math.min(...sicakliklar) : 0;

  const ihlalSayisi = sicaklikKayitlari.filter(
    (kayit) => kayit.durum === "İhlal"
  ).length;

  const sonSicaklik =
    sicaklikKayitlari.length > 0
      ? sicaklikKayitlari[sicaklikKayitlari.length - 1].sicaklik
      : aktifSevkiyat.baslangicSicakligi;

  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Sıcaklık Geçmişi</h1>

        <p>
          Kurumunuza ait sevkiyatların sıcaklık geçmişini inceleyin.
        </p>
      </div>

      <div className="filtre-cubugu">
        <select
          value={aktifSevkiyat._id}
          onChange={(e) => {
            const secilen = sevkiyatlar.find(
              (sevkiyat) => sevkiyat._id === e.target.value
            );

            setAktifSevkiyat(secilen);
          }}
        >
          {sevkiyatlar.map((sevkiyat) => (
            <option key={sevkiyat._id} value={sevkiyat._id}>
              {sevkiyat.partiNo} - {sevkiyat.asiAdi} - {sevkiyat.durum}
            </option>
          ))}
        </select>
      </div>

      <div className="istatistik-grid dortlu-grid">
        <IstatistikKarti
          baslik="Son Sıcaklık"
          deger={`${sonSicaklik}°C`}
          renkSinifi="mavi-kart"
          ikon={<Thermometer />}
        />

        <IstatistikKarti
          baslik="Maksimum"
          deger={`${enYuksek}°C`}
          renkSinifi={ihlalSayisi > 0 ? "kirmizi-kart" : "yesil-kart"}
          ikon={<AlertTriangle />}
        />

        <IstatistikKarti
          baslik="Minimum"
          deger={`${enDusuk}°C`}
          renkSinifi="yesil-kart"
          ikon={<ShieldCheck />}
        />

        <IstatistikKarti
          baslik="Kayıt Sayısı"
          deger={sicaklikKayitlari.length}
          renkSinifi="mor-kart"
          ikon={<Clock3 />}
        />
      </div>

      

      <section className="beyaz-panel">
        <h2>Sensör Kayıtları</h2>

        <table className="veri-tablosu">
          <thead>
            <tr>
              <th>Zaman</th>
              <th>Sıcaklık</th>
              <th>İzin Verilen Aralık</th>
              <th>Konum</th>
              <th>Durum</th>
              <th>Blockchain</th>
            </tr>
          </thead>

          <tbody>
            {sicaklikKayitlari.map((kayit) => (
              <tr key={kayit._id}>
                <td>
                  {new Date(kayit.createdAt).toLocaleString("tr-TR")}
                </td>

                <td>{kayit.sicaklik}°C</td>

                <td>
                  {kayit.minSicaklik}°C - {kayit.maxSicaklik}°C
                </td>

                <td>{kayit.konum}</td>

                <td>
                  <DurumRozeti
                    tip={kayit.durum === "İhlal" ? "kirmizi" : "yesil"}
                  >
                    {kayit.durum}
                  </DurumRozeti>
                </td>

                <td>
                  <DurumRozeti tip="mavi">
                    {kayit.blockchainDurumu}
                  </DurumRozeti>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sicaklikKayitlari.length === 0 && (
          <p>Bu sevkiyat için henüz sıcaklık kaydı bulunmuyor.</p>
        )}
      </section>
    </div>
  );
}