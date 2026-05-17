import { useEffect, useState } from "react";

import {
  CheckCircle,
  Copy,
  Link2,
  Search,
} from "lucide-react";

import DurumRozeti from "../bilesenler/DurumRozeti";
import IstatistikKarti from "../bilesenler/IstatistikKarti";

export default function BlockchainKayitlari() {
  const [kayitlar, setKayitlar] = useState([]);
  const [arama, setArama] = useState("");
  const [islemFiltresi, setIslemFiltresi] = useState("Tüm İşlem Türleri");
  const [durumFiltresi, setDurumFiltresi] = useState("Tüm Durumlar");

  async function blockchainKayitlariniGetir() {
    try {
      const cevap = await fetch("http://localhost:5000/api/blockchain");
      const veri = await cevap.json();

      setKayitlar(veri);
    } catch (hata) {
      console.error("Blockchain kayıtları alınamadı:", hata);
    }
  }

  useEffect(() => {
    blockchainKayitlariniGetir();
  }, []);

  const dogrulananKayitSayisi = kayitlar.filter(
    (kayit) => kayit.durum === "Doğrulandı"
  ).length;

  const supheliKayitSayisi = kayitlar.filter(
    (kayit) => kayit.durum === "Şüpheli"
  ).length;

  const filtrelenmisKayitlar = kayitlar.filter((kayit) => {
    const aramaMetni = arama.toLowerCase();

    const aramaUyuyor =
      kayit.hash?.toLowerCase().includes(aramaMetni) ||
      kayit.transactionId?.toLowerCase().includes(aramaMetni) ||
      kayit.sevkiyatId?.partiNo?.toLowerCase().includes(aramaMetni) ||
      kayit.sevkiyatId?.asiAdi?.toLowerCase().includes(aramaMetni);

    const islemUyuyor =
      islemFiltresi === "Tüm İşlem Türleri" ||
      kayit.islemTuru === islemFiltresi;

    const durumUyuyor =
      durumFiltresi === "Tüm Durumlar" ||
      kayit.durum === durumFiltresi;

    return aramaUyuyor && islemUyuyor && durumUyuyor;
  });

  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Blockchain Kayıtları</h1>

        <p>
  Blockchain kayıtları sistem tarafından otomatik doğrulanır.
  Veri bütünlüğü bozulursa kayıt şüpheli olarak işaretlenir.
</p>
      </div>

      <div className="istatistik-grid dortlu-grid">
        <IstatistikKarti
          baslik="Toplam Kayıt"
          deger={kayitlar.length}
          renkSinifi="mor-kart"
          ikon={<Link2 />}
        />

        <IstatistikKarti
          baslik="Doğrulanan"
          deger={dogrulananKayitSayisi}
          renkSinifi="yesil-kart"
          ikon={<CheckCircle />}
        />

        <IstatistikKarti
          baslik="Şüpheli"
          deger={supheliKayitSayisi}
          renkSinifi="kirmizi-kart"
          ikon={<Search />}
        />

        <IstatistikKarti
          baslik="Son İşlem"
          deger={
            kayitlar[0]
              ? new Date(kayitlar[0].createdAt).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"
          }
          renkSinifi="mavi-kart"
          ikon={<Link2 />}
        />
      </div>

      <div className="filtre-cubugu">
        <div className="arama-kutusu">
          <Search size={18} />

          <input
            placeholder="Sevkiyat ID / Hash / TX ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>

        <select
          value={islemFiltresi}
          onChange={(e) => setIslemFiltresi(e.target.value)}
        >
          <option>Tüm İşlem Türleri</option>
          <option>SEVKIYAT_OLUSTURULDU</option>
          <option>SICAKLIK_IHLALI</option>
          <option>TESLIM_ONAYI</option>
        </select>

        <select
          value={durumFiltresi}
          onChange={(e) => setDurumFiltresi(e.target.value)}
        >
          <option>Tüm Durumlar</option>
          <option>Doğrulandı</option>
          <option>Şüpheli</option>
        </select>
      </div>

      <div className="blockchain-liste">
        {filtrelenmisKayitlar.map((kayit) => (
          <article className="blockchain-kaydi" key={kayit._id}>
            <div className="kayit-ana">
              <h2>{kayit.transactionId}</h2>

              <p>
                {kayit.sevkiyatId?.partiNo || "Sevkiyat"}
                {" / "}
                {kayit.sevkiyatId?.asiAdi || "Aşı"}
              </p>

              <DurumRozeti tip="mavi">
                {kayit.islemTuru}
              </DurumRozeti>
            </div>

            <div className="hash-kutusu">
              <span>HASH</span>

              <code>
                {kayit.hash.slice(0, 14)}
                ...
                {kayit.hash.slice(-10)}
              </code>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(kayit.hash);
                  alert("Hash kopyalandı.");
                }}
              >
                <Copy size={16} />
              </button>
            </div>

            <div className="kayit-durumu">
              <DurumRozeti
                tip={kayit.durum === "Doğrulandı" ? "yesil" : "kirmizi"}
              >
                {kayit.durum}
              </DurumRozeti>

              <p>
                {new Date(kayit.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>

            
          </article>
        ))}

        {filtrelenmisKayitlar.length === 0 && (
          <section className="beyaz-panel">
            Filtrelere uygun blockchain kaydı bulunamadı.
          </section>
        )}
      </div>
    </div>
  );
}