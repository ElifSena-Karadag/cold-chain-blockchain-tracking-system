import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Truck,
  CheckCircle,
  AlertCircle,
  Bell,
  Link2,
} from "lucide-react";

import IstatistikKarti from "../bilesenler/IstatistikKarti";
import DurumRozeti from "../bilesenler/DurumRozeti";

export default function Dashboard() {
  const navigate = useNavigate();

  const [sevkiyatlar, setSevkiyatlar] = useState([]);
  const [alarmlar, setAlarmlar] = useState([]);
  const [blockchainKayitlari, setBlockchainKayitlari] = useState([]);

  useEffect(() => {
    async function verileriGetir() {
      try {
        const sevkiyatCevap = await fetch(
          "http://localhost:5000/api/sevkiyatlar"
        );
        const sevkiyatVeri = await sevkiyatCevap.json();

        const alarmCevap = await fetch("http://localhost:5000/api/alarmlar");
        const alarmVeri = await alarmCevap.json();

        const blockchainCevap = await fetch(
          "http://localhost:5000/api/blockchain"
        );
        const blockchainVeri = await blockchainCevap.json();

        setSevkiyatlar(sevkiyatVeri);
        setAlarmlar(alarmVeri);
        setBlockchainKayitlari(blockchainVeri);
      } catch (hata) {
        console.error("Dashboard verileri alınamadı:", hata);
      }
    }

    verileriGetir();
  }, []);

  const aktifSevkiyatSayisi = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.tasimaDurumu === "Yolda"
  ).length;

  const tamamlananSevkiyatSayisi = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.teslimDurumu === "Teslim Edildi"
  ).length;

  const riskliSevkiyatSayisi = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.riskDurumu === "Riskli"
  ).length;

  const dogrulananKayitSayisi = blockchainKayitlari.filter(
    (kayit) => kayit.durum === "Doğrulandı"
  ).length;

  const supheliKayitSayisi = blockchainKayitlari.filter(
    (kayit) => kayit.durum === "Şüpheli"
  ).length;

  const aktifSevkiyatlar = sevkiyatlar.filter(
    (sevkiyat) => sevkiyat.teslimDurumu !== "Teslim Edildi"
  );

  return (
    <div className="sayfa">
      <div className="istatistik-grid">
        <IstatistikKarti
          baslik="Yoldaki Sevkiyatlar"
          deger={aktifSevkiyatSayisi}
          renkSinifi="mavi-kart"
          ikon={<Truck />}
        />

        <IstatistikKarti
          baslik="Tamamlanan Sevkiyatlar"
          deger={tamamlananSevkiyatSayisi}
          renkSinifi="yesil-kart"
          ikon={<CheckCircle />}
        />

        <IstatistikKarti
          baslik="Riskli Sevkiyatlar"
          deger={riskliSevkiyatSayisi}
          renkSinifi="sari-kart"
          ikon={<AlertCircle />}
        />

        <IstatistikKarti
          baslik="Bugünkü Alarmlar"
          deger={alarmlar.length}
          renkSinifi="kirmizi-kart"
          ikon={<Bell />}
        />

        <IstatistikKarti
          baslik="Blockchain Kayıt Sayısı"
          deger={blockchainKayitlari.length}
          renkSinifi="mor-kart"
          ikon={<Link2 />}
        />
      </div>

      <section className="beyaz-panel">
        <div className="panel-ust">
          <h2>Aktif Sevkiyatlar</h2>

          <button
            className="buton buton-yesil"
            onClick={() => navigate("/gonderen/yeni-sevkiyat-olustur")}
          >
            🚚 Yeni Sevkiyat Başlat
          </button>
        </div>

        <table className="veri-tablosu">
          <thead>
            <tr>
              <th>Parti No</th>
              <th>Aşı Adı</th>
              <th>Alıcı Kurum</th>
              <th>Rota</th>
              <th>Son Sıcaklık</th>
              <th>Taşıma</th>
              <th>Risk</th>
              <th>Başlangıç Tarihi</th>
            </tr>
          </thead>

          <tbody>
            {aktifSevkiyatlar.map((sevkiyat) => (
              <tr key={sevkiyat._id}>
                <td>{sevkiyat.partiNo}</td>

                <td>
                  {sevkiyat.asiAdi} ({sevkiyat.dozSayisi})
                </td>

                <td>{sevkiyat.aliciKurumAdi}</td>

                <td>
                  {sevkiyat.cikisNoktasi} → {sevkiyat.varisNoktasi}
                </td>

                <td>
                  <span className="sicaklik-noktasi"></span>
                  {sevkiyat.sonSicaklik}°C
                </td>

                <td>
                  <DurumRozeti
                    tip={sevkiyat.tasimaDurumu === "Yolda" ? "mavi" : "yesil"}
                  >
                    {sevkiyat.tasimaDurumu}
                  </DurumRozeti>
                </td>

                <td>
                  <DurumRozeti
                    tip={sevkiyat.riskDurumu === "Riskli" ? "kirmizi" : "yesil"}
                  >
                    {sevkiyat.riskDurumu}
                  </DurumRozeti>
                </td>

                <td>
                  {new Date(sevkiyat.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {aktifSevkiyatlar.length === 0 && (
          <p>Aktif sevkiyat bulunmuyor.</p>
        )}
      </section>

      <div className="alt-grid">
        <section className="beyaz-panel">
          <h2>Son Alarmlar</h2>

          {alarmlar.length === 0 ? (
            <p>Henüz alarm kaydı bulunmuyor.</p>
          ) : (
            <table className="veri-tablosu">
              <thead>
                <tr>
                  <th>Alarm</th>
                  <th>Sevkiyat</th>
                  <th>Sıcaklık</th>
                  <th>Zaman</th>
                </tr>
              </thead>

              <tbody>
                {alarmlar.slice(0, 3).map((alarm) => (
                  <tr key={alarm._id}>
                    <td>{alarm.alarmTuru}</td>

                    <td>
                      {alarm.sevkiyatId?.partiNo} / {alarm.sevkiyatId?.asiAdi}
                    </td>

                    <td>{alarm.olculenSicaklik}°C</td>

                    <td>
                      {new Date(alarm.createdAt).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="beyaz-panel">
          <h2>Blockchain Doğrulama Özeti</h2>

          <p>
            Son blockchain işlemi:{" "}
            <span className="basarili-yazi">
              {blockchainKayitlari[0]?.durum || "Bekliyor"}
            </span>
          </p>

          <hr />

          <p>
            Doğrulanan kayıt:{" "}
            <span className="basarili-yazi">{dogrulananKayitSayisi}</span>
          </p>

          <p>
            Şüpheli kayıt:{" "}
            <span className="tehlike-yazi">{supheliKayitSayisi}</span>
          </p>
        </section>
      </div>
    </div>
  );
}