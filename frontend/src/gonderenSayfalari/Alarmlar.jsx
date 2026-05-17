import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertTriangle,
  Bell,
  Search,
} from "lucide-react";

import DurumRozeti from "../bilesenler/DurumRozeti";
import IstatistikKarti from "../bilesenler/IstatistikKarti";

export default function Alarmlar() {
  const navigate = useNavigate();

  const [alarmlar, setAlarmlar] = useState([]);
  const [arama, setArama] = useState("");

  useEffect(() => {
    async function alarmlariGetir() {
      try {
        const cevap = await fetch("http://localhost:5000/api/alarmlar");
        const veri = await cevap.json();

        setAlarmlar(veri);
      } catch (hata) {
        console.error("Alarmlar alınamadı:", hata);
      }
    }

    alarmlariGetir();
  }, []);

  const aktifAlarm = alarmlar.filter(
    (alarm) => alarm.durum === "Aktif"
  ).length;

  const kritikAlarm = alarmlar.filter(
    (alarm) => alarm.seviye === "Kritik"
  ).length;

  const filtrelenmisAlarmlar = alarmlar.filter((alarm) => {
    const aramaMetni = arama.toLowerCase();

    return (
      alarm.sevkiyatId?.partiNo?.toLowerCase().includes(aramaMetni) ||
      alarm.sevkiyatId?.asiAdi?.toLowerCase().includes(aramaMetni)
    );
  });

  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Alarm ve İhlaller</h1>

        <p>
          Sıcaklık limitlerini aşan veya risk oluşturan sevkiyat kayıtları.
        </p>
      </div>

      <div className="istatistik-grid uclu-grid">
        <IstatistikKarti
          baslik="Aktif Alarm"
          deger={aktifAlarm}
          renkSinifi="kirmizi-kart"
          ikon={<Bell />}
        />

        <IstatistikKarti
          baslik="Kritik Alarm"
          deger={kritikAlarm}
          renkSinifi="sari-kart"
          ikon={<AlertTriangle />}
        />

        <IstatistikKarti
          baslik="Bugünkü İhlal"
          deger={alarmlar.length}
          renkSinifi="mavi-kart"
          ikon={<AlertTriangle />}
        />
      </div>

      <div className="filtre-cubugu">
        <div className="arama-kutusu">
          <Search size={18} />

          <input
            placeholder="Sevkiyat ID / Aşı ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>
      </div>

      <div className="alarm-kart-liste">
        {filtrelenmisAlarmlar.map((alarm) => (
          <article className="alarm-karti" key={alarm._id}>
            <div className="alarm-sol">
              <DurumRozeti tip="kirmizi">
                {alarm.seviye}
              </DurumRozeti>

              <h2>{alarm.alarmTuru}</h2>

              <p>
                <b>Sevkiyat:</b> {alarm.sevkiyatId?.partiNo} /{" "}
                {alarm.sevkiyatId?.asiAdi}
              </p>

              <p>
                <b>Ölçülen:</b> {alarm.olculenSicaklik}°C | Limit:{" "}
                {alarm.minSicaklik}°C - {alarm.maxSicaklik}°C
              </p>
            </div>

            <div className="alarm-sag">
              <p>
                <b>Zaman:</b>{" "}
                {new Date(alarm.createdAt).toLocaleString("tr-TR")}
              </p>

              <p>
                <b>Durum:</b> {alarm.durum}
              </p>

              <p>
                <b>Blockchain:</b> Blockchain kayıtlarında doğrulanabilir
              </p>

              <div className="kart-butonlari sag-butonlar">
                <button
                  className="buton buton-acik"
                  onClick={() =>
                    alert(
                      `Alarm Detayı\n\nAlarm: ${alarm.alarmTuru}\nSevkiyat: ${alarm.sevkiyatId?.partiNo}\nAşı: ${alarm.sevkiyatId?.asiAdi}\nÖlçülen: ${alarm.olculenSicaklik}°C\nLimit: ${alarm.minSicaklik}°C - ${alarm.maxSicaklik}°C\nDurum: ${alarm.durum}`
                    )
                  }
                >
                  Detay Gör
                </button>

                <button
                  className="buton buton-mavi"
                  onClick={() => navigate("/gonderen/blockchain-kayitlari")}
                >
                  Blockchain
                </button>
              </div>
            </div>
          </article>
        ))}

        {filtrelenmisAlarmlar.length === 0 && (
          <section className="beyaz-panel">
            Aramaya uygun alarm kaydı bulunmuyor.
          </section>
        )}
      </div>
    </div>
  );
}