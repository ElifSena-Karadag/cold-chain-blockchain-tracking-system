import { useEffect, useState } from "react";

import {
  CheckCircle,
  ShieldCheck,
  Thermometer,
  Truck,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

import IstatistikKarti from "../bilesenler/IstatistikKarti";
import DurumRozeti from "../bilesenler/DurumRozeti";

export default function TeslimOnayi() {
  const [sevkiyatlar, setSevkiyatlar] = useState([]);
  const [aktifSevkiyat, setAktifSevkiyat] = useState(null);

  async function sevkiyatlariGetir() {
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
  }

  useEffect(() => {
    sevkiyatlariGetir();
  }, []);

  async function teslimOnayla() {
    if (!aktifSevkiyat) return;

    const onay = window.confirm(
      "Bu sevkiyatı teslim almak istiyor musunuz?"
    );

    if (!onay) return;

    const cevap = await fetch(
      `http://localhost:5000/api/sevkiyatlar/${aktifSevkiyat._id}/teslim`,
      {
        method: "PUT",
      }
    );

    if (!cevap.ok) {
      alert("Teslim onayı sırasında hata oluştu.");
      return;
    }

    alert("Teslim onayı başarıyla kaydedildi.");

    await sevkiyatlariGetir();
  }

  if (!aktifSevkiyat) {
    return (
      <div className="sayfa">
        <h1>Teslim Onayı</h1>
        <p>Kurumunuza ait teslim alınacak sevkiyat bulunamadı.</p>
      </div>
    );
  }

  const bekleyenTeslimSayisi = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.teslimDurumu !== "Teslim Edildi"
  ).length;

  const tamamlananTeslimSayisi = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.teslimDurumu === "Teslim Edildi"
  ).length;

  const dogrulananSayisi = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.blockchainDurumu === "Doğrulandı"
  ).length;

  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Teslim Onayı</h1>

        <p>
          Kurumunuza gelen sevkiyatların teslim alma işlemlerini
          blockchain doğrulaması ile tamamlayın.
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
              {sevkiyat.partiNo} - {sevkiyat.asiAdi} -{" "}
              {sevkiyat.tasimaDurumu} / {sevkiyat.riskDurumu} /{" "}
              {sevkiyat.teslimDurumu}
            </option>
          ))}
        </select>
      </div>

      <div className="istatistik-grid dortlu-grid">
        <IstatistikKarti
          baslik="Bekleyen Teslim"
          deger={bekleyenTeslimSayisi}
          renkSinifi="mavi-kart"
          ikon={<Truck />}
        />

        <IstatistikKarti
          baslik="Doğrulanan"
          deger={dogrulananSayisi}
          renkSinifi="yesil-kart"
          ikon={<ShieldCheck />}
        />

        <IstatistikKarti
          baslik="Risk Durumu"
          deger={aktifSevkiyat.riskDurumu}
          renkSinifi={
            aktifSevkiyat.riskDurumu === "Riskli"
              ? "kirmizi-kart"
              : "mor-kart"
          }
          ikon={<AlertTriangle />}
        />

        <IstatistikKarti
          baslik="Tamamlanan"
          deger={tamamlananTeslimSayisi}
          renkSinifi="yesil-kart"
          ikon={<CheckCircle />}
        />
      </div>

      <section className="teslim-panel">
        <div className="teslim-sol">
          <div className="panel-ust">
            <h2>Sevkiyat Bilgileri</h2>

            <div className="durum-rozet-grup">
              <DurumRozeti
                tip={
                  aktifSevkiyat.tasimaDurumu === "Yolda"
                    ? "mavi"
                    : "yesil"
                }
              >
                {aktifSevkiyat.tasimaDurumu}
              </DurumRozeti>

              <DurumRozeti
                tip={
                  aktifSevkiyat.riskDurumu === "Riskli"
                    ? "kirmizi"
                    : "yesil"
                }
              >
                {aktifSevkiyat.riskDurumu}
              </DurumRozeti>

              
            </div>
          </div>

          <div className="teslim-bilgi-grid">
            <div>
              <span>Parti No</span>
              <strong>{aktifSevkiyat.partiNo}</strong>
            </div>

            <div>
              <span>Aşı Türü</span>
              <strong>{aktifSevkiyat.asiAdi}</strong>
            </div>

            <div>
              <span>Doz Sayısı</span>
              <strong>{aktifSevkiyat.dozSayisi}</strong>
            </div>

            <div>
              <span>Alıcı Kurum</span>
              <strong>{aktifSevkiyat.aliciKurumAdi}</strong>
            </div>

            <div>
              <span>Son Sıcaklık</span>
              <strong>{aktifSevkiyat.sonSicaklik}°C</strong>
            </div>

            <div>
              <span>Blockchain</span>
              <strong>{aktifSevkiyat.blockchainDurumu}</strong>
            </div>

            <div>
              <span>Rota</span>
              <strong>
                {aktifSevkiyat.cikisNoktasi} → {aktifSevkiyat.varisNoktasi}
              </strong>
            </div>

            <div>
              <span>Teslim Durumu</span>
              <strong>{aktifSevkiyat.teslimDurumu}</strong>
            </div>
          </div>
        </div>

        <div className="teslim-sag">
          <div className="teslim-onay-kutu">
            <FileCheck size={64} />

            <h2>Teslim Doğrulama</h2>

            <p>
              Sevkiyat bilgilerini kontrol ettikten sonra teslim onayı
              verebilirsiniz.
            </p>

            
            <button
              className="teslim-butonu"
              onClick={teslimOnayla}
              disabled={aktifSevkiyat.teslimDurumu === "Teslim Edildi"}
            >
              {aktifSevkiyat.teslimDurumu === "Teslim Edildi"
                ? "✓ Teslim Edildi"
                : "✓ Teslimatı Onayla"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}