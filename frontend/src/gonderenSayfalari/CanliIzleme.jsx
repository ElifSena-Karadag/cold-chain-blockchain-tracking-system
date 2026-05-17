import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  Clock3,
  MapPin,
  ShieldCheck,
  Thermometer,
  Truck,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import DurumRozeti from "../bilesenler/DurumRozeti";
import IstatistikKarti from "../bilesenler/IstatistikKarti";

export default function CanliIzleme() {
  const [sevkiyatlar, setSevkiyatlar] = useState([]);
  const [aktifSevkiyat, setAktifSevkiyat] = useState(null);
  const [sicaklikKayitlari, setSicaklikKayitlari] = useState([]);
  const [sonSicaklik, setSonSicaklik] = useState(null);

  useEffect(() => {
    async function sevkiyatlariGetir() {
      try {
        const cevap = await fetch("http://localhost:5000/api/sevkiyatlar");
        const veri = await cevap.json();

        const aktifler = veri.filter(
          (sevkiyat) => sevkiyat.teslimDurumu !== "Teslim Edildi"
        );

        setSevkiyatlar(aktifler);
        setAktifSevkiyat(aktifler[0] || null);
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

        if (veri.length > 0) {
          setSonSicaklik(veri[veri.length - 1].sicaklik);
        } else {
          setSonSicaklik(aktifSevkiyat.baslangicSicakligi);
        }
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
          <h1>Gönderen Kurum Canlı İzleme</h1>
          <p>Şu anda canlı izlenecek aktif sevkiyat bulunmuyor.</p>
        </div>

        <section className="beyaz-panel">
          <h2>Canlı izleme için ne gerekli?</h2>

          <p>
            Canlı izleme sayfasında sadece teslim edilmemiş sevkiyatlar
            görüntülenir.
          </p>

          <p>
            Yeni bir sevkiyat oluşturduğunda bu sayfada otomatik olarak
            görünecektir.
          </p>
        </section>
      </div>
    );
  }

  const gosterilenSicaklik =
    sonSicaklik ?? aktifSevkiyat.baslangicSicakligi;

  const guvenliMi =
    gosterilenSicaklik >= aktifSevkiyat.minSicaklik &&
    gosterilenSicaklik <= aktifSevkiyat.maxSicaklik;

  const ihlalSayisi = sicaklikKayitlari.filter(
    (kayit) => kayit.durum === "İhlal"
  ).length;

  const grafikVerisi = sicaklikKayitlari.map((kayit) => ({
    zaman: new Date(kayit.createdAt).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    sicaklik: kayit.sicaklik,
  }));

  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Gönderen Kurum Canlı İzleme</h1>

        <p>
          Yolda olan sevkiyatların sıcaklık, rota, alarm ve blockchain
          durumunu takip edin.
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
            setSonSicaklik(null);
            setSicaklikKayitlari([]);
          }}
        >
          {sevkiyatlar.map((sevkiyat) => (
            <option key={sevkiyat._id} value={sevkiyat._id}>
              {sevkiyat.partiNo} - {sevkiyat.asiAdi} -{" "}
              {sevkiyat.tasimaDurumu} / {sevkiyat.riskDurumu}
            </option>
          ))}
        </select>
      </div>

      <div className="istatistik-grid dortlu-grid">
        <IstatistikKarti
          baslik="Anlık Sıcaklık"
          deger={`${gosterilenSicaklik}°C`}
          renkSinifi={guvenliMi ? "mavi-kart" : "kirmizi-kart"}
          ikon={<Thermometer />}
        />

        <IstatistikKarti
          baslik="Taşıma Durumu"
          deger={aktifSevkiyat.tasimaDurumu}
          renkSinifi={
            aktifSevkiyat.tasimaDurumu === "Yolda"
              ? "yesil-kart"
              : "mavi-kart"
          }
          ikon={<Truck />}
        />

        <IstatistikKarti
          baslik="Risk Durumu"
          deger={aktifSevkiyat.riskDurumu}
          renkSinifi={
            aktifSevkiyat.riskDurumu === "Riskli"
              ? "kirmizi-kart"
              : "yesil-kart"
          }
          ikon={<AlertTriangle />}
        />

        <IstatistikKarti
          baslik="Blockchain"
          deger={aktifSevkiyat.blockchainDurumu}
          renkSinifi="mor-kart"
          ikon={<ShieldCheck />}
        />
      </div>

      <div className="istatistik-grid dortlu-grid">
        <IstatistikKarti
          baslik="İhlal Sayısı"
          deger={ihlalSayisi}
          renkSinifi={ihlalSayisi > 0 ? "kirmizi-kart" : "mor-kart"}
          ikon={<AlertTriangle />}
        />

        <IstatistikKarti
          baslik="Teslim Durumu"
          deger={aktifSevkiyat.teslimDurumu}
          renkSinifi={
            aktifSevkiyat.teslimDurumu === "Teslim Edildi"
              ? "yesil-kart"
              : "sari-kart"
          }
          ikon={<Clock3 />}
        />

        <IstatistikKarti
          baslik="Tahmini Süre"
          deger={aktifSevkiyat.tahminiTeslimSuresi}
          renkSinifi="sari-kart"
          ikon={<Clock3 />}
        />

        <IstatistikKarti
          baslik="Alıcı Kurum"
          deger={aktifSevkiyat.aliciKurumAdi}
          renkSinifi="mavi-kart"
          ikon={<MapPin />}
        />
      </div>

      <div className="canli-grid">
        <section className="beyaz-panel">
          <div className="panel-ust">
            <h2>Sevkiyat Bilgileri</h2>

            <div className="durum-rozet-grup">
              <DurumRozeti tip="mavi">
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

          <div className="canli-bilgi-grid">
            <div className="canli-bilgi-karti">
              <MapPin size={22} />
              <div>
                <span>Çıkış Noktası</span>
                <strong>{aktifSevkiyat.cikisNoktasi}</strong>
              </div>
            </div>

            <div className="canli-bilgi-karti">
              <MapPin size={22} />
              <div>
                <span>Varış Noktası</span>
                <strong>{aktifSevkiyat.varisNoktasi}</strong>
              </div>
            </div>

            <div className="canli-bilgi-karti">
              <Truck size={22} />
              <div>
                <span>Taşıma Aracı</span>
                <strong>{aktifSevkiyat.tasimaAraci}</strong>
              </div>
            </div>

            <div className="canli-bilgi-karti">
              <Clock3 size={22} />
              <div>
                <span>Tahmini Teslim</span>
                <strong>{aktifSevkiyat.tahminiTeslimSuresi}</strong>
              </div>
            </div>

            <div className="canli-bilgi-karti">
              <Activity size={22} />
              <div>
                <span>Sensör Modu</span>
                <strong>{aktifSevkiyat.sensorModu}</strong>
              </div>
            </div>

            <div className="canli-bilgi-karti">
              <ShieldCheck size={22} />
              <div>
                <span>Blockchain</span>
                <strong>{aktifSevkiyat.blockchainDurumu}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="beyaz-panel">
          <h2>Sıcaklık Kontrolü</h2>

          <div className="sicaklik-buyuk-kutu">
            {gosterilenSicaklik}°C
          </div>

          <div className="sicaklik-alt-bilgi">
            <div>
              <span>Minimum</span>
              <strong>{aktifSevkiyat.minSicaklik}°C</strong>
            </div>

            <div>
              <span>Maksimum</span>
              <strong>{aktifSevkiyat.maxSicaklik}°C</strong>
            </div>

            <div>
              <span>Durum</span>

              <DurumRozeti tip={guvenliMi ? "yesil" : "kirmizi"}>
                {guvenliMi ? "Normal" : "İhlal"}
              </DurumRozeti>
            </div>
          </div>
        </section>
      </div>

      <section className="beyaz-panel">
        <div className="panel-ust">
          <h2>Canlı Sıcaklık Grafiği</h2>

          <DurumRozeti tip={guvenliMi ? "yesil" : "kirmizi"}>
            {guvenliMi ? "GÜVENLİ ARALIKTA" : "İHLAL VAR"}
          </DurumRozeti>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={grafikVerisi}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="zaman" />

              <YAxis />

              <Tooltip />

              <ReferenceLine
                y={aktifSevkiyat.minSicaklik}
                label="Min"
                strokeDasharray="4 4"
              />

              <ReferenceLine
                y={aktifSevkiyat.maxSicaklik}
                label="Max"
                strokeDasharray="4 4"
              />

              <Line
                type="monotone"
                dataKey="sicaklik"
                stroke={guvenliMi ? "#2563eb" : "#dc2626"}
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: guvenliMi ? "#2563eb" : "#dc2626",
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="beyaz-panel">
        <div className="panel-ust">
          <h2>Son Sıcaklık Kayıtları</h2>

          <DurumRozeti tip="mavi">CANLI VERİ</DurumRozeti>
        </div>

        <table className="veri-tablosu">
          <thead>
            <tr>
              <th>Zaman</th>
              <th>Sıcaklık</th>
              <th>Konum</th>
              <th>Durum</th>
              <th>Blockchain</th>
            </tr>
          </thead>

          <tbody>
            {sicaklikKayitlari.slice(-5).reverse().map((kayit) => (
              <tr key={kayit._id}>
                <td>
                  {new Date(kayit.createdAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </td>

                <td>{kayit.sicaklik}°C</td>

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
      </section>

      <section className="beyaz-panel harita-paneli">
        <div className="panel-ust">
          <h2>Rota Takibi</h2>

          <DurumRozeti tip="mavi">SİMÜLASYON</DurumRozeti>
        </div>

        <div className="sahte-harita">
          <div className="harita-yol"></div>

          <div className="harita-arac">🚚</div>

          <div className="harita-nokta baslangic">
            {aktifSevkiyat.varisNoktasi}
          </div>

          <div className="harita-nokta bitis">
            {aktifSevkiyat.cikisNoktasi}
          </div>
        </div>
      </section>
    </div>
  );
}