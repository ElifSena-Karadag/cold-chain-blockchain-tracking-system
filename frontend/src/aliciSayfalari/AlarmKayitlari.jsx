import { useEffect, useState } from "react";

import {
  Bell,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

import IstatistikKarti from "../bilesenler/IstatistikKarti";
import DurumRozeti from "../bilesenler/DurumRozeti";

export default function AlarmKayitlari() {
  const [alarmlar, setAlarmlar] = useState([]);

  useEffect(() => {
    async function alarmlariGetir() {
      try {
        const aktifKullanici = JSON.parse(
          localStorage.getItem("aktifKullanici")
        );

        const cevap = await fetch("http://localhost:5000/api/alarmlar");
        const veri = await cevap.json();

        const filtreliAlarmlar = veri.filter(
          (alarm) =>
            alarm.sevkiyatId?.aliciKurumAdi === aktifKullanici?.kurumAdi
        );

        setAlarmlar(filtreliAlarmlar);
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

  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Alarm Kayıtları</h1>

        <p>
          Kurumunuza ait sıcaklık ihlallerini ve sistem alarmlarını görüntüleyin.
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
          baslik="Kritik İhlal"
          deger={kritikAlarm}
          renkSinifi="sari-kart"
          ikon={<ShieldAlert />}
        />

        <IstatistikKarti
          baslik="Toplam Alarm"
          deger={alarmlar.length}
          renkSinifi="mor-kart"
          ikon={<AlertTriangle />}
        />
      </div>

      <div className="alarm-kart-liste">
        {alarmlar.map((alarm) => (
          <article className="alarm-karti" key={alarm._id}>
            <div className="alarm-sol">
              <DurumRozeti tip="kirmizi">
                {alarm.seviye}
              </DurumRozeti>

              <h2>{alarm.alarmTuru}</h2>

              <p>
                <b>Sevkiyat:</b>{" "}
                {alarm.sevkiyatId?.partiNo} / {alarm.sevkiyatId?.asiAdi}
              </p>

              <p>
                <b>Ölçülen Değer:</b> {alarm.olculenSicaklik}°C
              </p>

              <p>
                <b>İzin Verilen Aralık:</b>{" "}
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
                <b>Açıklama:</b> {alarm.aciklama}
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
                  Detay
                </button>
              </div>
            </div>
          </article>
        ))}

        {alarmlar.length === 0 && (
          <section className="beyaz-panel">
            Kurumunuza ait alarm kaydı bulunmuyor.
          </section>
        )}
      </div>
    </div>
  );
}