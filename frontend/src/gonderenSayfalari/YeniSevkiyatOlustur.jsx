import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  CalendarDays,
  CheckCircle,
  Link2,
  Syringe,
  Thermometer,
  Truck,
} from "lucide-react";

import AlanKarti from "../bilesenler/AlanKarti";

import {
  aliciKurumlar,
  iller,
  tasimaAraclari,
} from "../veriler/ornekVeriler";

const baslangicFormu = {
  asiId: "",
  partiNo: "",
  dozSayisi: "",
  sonKullanmaTarihi: "",
  aliciKurumId: "",
  aliciYetkiliKisi: "",
  aliciKurumEposta: "",
  cikisNoktasi: "",
  varisNoktasi: "",
  tasimaAraci: "",
  tahminiTeslimSuresi: "48 Saat",
  sorumluPersonel: "",
  sensorModu: "Simülasyon",
  olcumAraligi: "5 Saniyede Bir",
  baslangicSicakligi: "4.0",
};

export default function YeniSevkiyatOlustur() {
  const [form, setForm] = useState(baslangicFormu);
  const [gonderildiMi, setGonderildiMi] = useState(false);
  const [asilar, setAsilar] = useState([]);

  useEffect(() => {
    async function asilarGetir() {
      try {
        const cevap = await fetch("http://localhost:5000/api/asilar");
        const veri = await cevap.json();
        setAsilar(veri);
      } catch (hata) {
        console.error("Aşılar alınamadı:", hata);
      }
    }

    asilarGetir();
  }, []);

  const secilenAsi = useMemo(() => {
    return asilar.find((asi) => asi._id === form.asiId);
  }, [asilar, form.asiId]);

  const secilenAliciKurum = useMemo(() => {
    return aliciKurumlar.find(
      (kurum) => kurum.id === form.aliciKurumId
    );
  }, [form.aliciKurumId]);

  const filtreliAliciKurumlar = useMemo(() => {
    if (!form.varisNoktasi) return [];

    return aliciKurumlar.filter(
      (kurum) => kurum.il === form.varisNoktasi
    );
  }, [form.varisNoktasi]);

  const zorunluAlanlar = [
    "asiId",
    "partiNo",
    "dozSayisi",
    "sonKullanmaTarihi",
    "aliciKurumId",
    "aliciYetkiliKisi",
    "cikisNoktasi",
    "varisNoktasi",
    "tasimaAraci",
    "sorumluPersonel",
    "baslangicSicakligi",
  ];

  function alanGuncelle(alanAdi, deger) {
    setForm((oncekiForm) => ({
      ...oncekiForm,
      [alanAdi]: deger,
    }));
  }

  function hataVarMi(alanAdi) {
    return (
      gonderildiMi &&
      zorunluAlanlar.includes(alanAdi) &&
      !form[alanAdi]
    );
  }

  function varisNoktasiGuncelle(deger) {
    setForm((oncekiForm) => ({
      ...oncekiForm,
      varisNoktasi: deger,
      aliciKurumId: "",
      aliciKurumEposta: "",
      aliciYetkiliKisi: "",
    }));
  }

  function aliciKurumSec(deger) {
    const kurum = aliciKurumlar.find(
      (kurum) => kurum.id === deger
    );

    setForm((oncekiForm) => ({
      ...oncekiForm,
      aliciKurumId: deger,
      aliciKurumEposta: kurum?.eposta || "",
    }));
  }

  async function formuGonder(event) {
    event.preventDefault();
    setGonderildiMi(true);

    const formGecerliMi = zorunluAlanlar.every((alan) =>
      Boolean(form[alan])
    );

    if (!formGecerliMi) {
      return;
    }

    if (!secilenAsi || !secilenAliciKurum) {
      alert("Lütfen aşı ve alıcı kurum seçiniz.");
      return;
    }

    try {
      const gonderilecekVeri = {
        asiId: form.asiId,
        asiAdi: secilenAsi.ad,

        partiNo: form.partiNo,
        dozSayisi: form.dozSayisi,
        sonKullanmaTarihi: form.sonKullanmaTarihi,

        aliciKurumId: form.aliciKurumId,
        aliciKurumAdi: secilenAliciKurum.ad,
        aliciYetkiliKisi: form.aliciYetkiliKisi,
        aliciKurumEposta: form.aliciKurumEposta,

        cikisNoktasi: form.cikisNoktasi,
        varisNoktasi: form.varisNoktasi,
        tasimaAraci: form.tasimaAraci,
        tahminiTeslimSuresi: form.tahminiTeslimSuresi,
        sorumluPersonel: form.sorumluPersonel,

        sensorModu: form.sensorModu,
        olcumAraligi: form.olcumAraligi,
        baslangicSicakligi: Number(form.baslangicSicakligi),

        minSicaklik: secilenAsi.minSicaklik,
        maxSicaklik: secilenAsi.maxSicaklik,
      };

      const cevap = await fetch(
        "http://localhost:5000/api/sevkiyatlar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gonderilecekVeri),
        }
      );

      if (!cevap.ok) {
        throw new Error("Sevkiyat oluşturulamadı");
      }

      alert("Sevkiyat başarıyla veritabanına kaydedildi.");

      setForm(baslangicFormu);
      setGonderildiMi(false);
    } catch (hata) {
      console.error(hata);
      alert("Sevkiyat oluşturulurken hata oluştu.");
    }
  }

  return (
    <div className="sayfa">
      <div className="sayfa-basligi">
        <h1>Yeni Sevkiyat Oluştur</h1>
        <p>
          Aşı sevkiyat bilgilerini girerek soğuk zincir
          takibini başlatın.
        </p>
      </div>

      <form onSubmit={formuGonder} className="sevkiyat-form-grid">
        <AlanKarti
          baslik="Aşı Bilgileri"
          ikon={<Syringe size={62} />}
        >
          <div className="form-grid iki-kolon">
            <div className="form-grup">
              <label>Aşı Türü</label>

              <select
                className={hataVarMi("asiId") ? "input-hata" : ""}
                value={form.asiId}
                onChange={(e) =>
                  alanGuncelle("asiId", e.target.value)
                }
              >
                <option value="">Seçiniz</option>

                {asilar.map((asi) => (
                  <option key={asi._id} value={asi._id}>
                    {asi.ad}
                  </option>
                ))}
              </select>

              {hataVarMi("asiId") && (
                <span className="hata-isareti">!</span>
              )}
            </div>

            <div className="form-grup">
              <label>Parti Numarası</label>

              <input
                className={
                  hataVarMi("partiNo") ? "input-hata" : ""
                }
                value={form.partiNo}
                onChange={(e) =>
                  alanGuncelle("partiNo", e.target.value)
                }
              />

              {hataVarMi("partiNo") && (
                <span className="hata-isareti">!</span>
              )}
            </div>

            <div className="form-grup">
              <label>Doz / Kutu Sayısı</label>

              <input
                className={
                  hataVarMi("dozSayisi") ? "input-hata" : ""
                }
                value={form.dozSayisi}
                onChange={(e) =>
                  alanGuncelle("dozSayisi", e.target.value)
                }
              />

              {hataVarMi("dozSayisi") && (
                <span className="hata-isareti">!</span>
              )}
            </div>

            <div className="form-grup tarih-alani">
              <label>Son Kullanma Tarihi</label>

              <input
                type="date"
                className={
                  hataVarMi("sonKullanmaTarihi")
                    ? "input-hata"
                    : ""
                }
                value={form.sonKullanmaTarihi}
                onChange={(e) =>
                  alanGuncelle(
                    "sonKullanmaTarihi",
                    e.target.value
                  )
                }
              />

              <CalendarDays className="tarih-ikonu" size={19} />

              {hataVarMi("sonKullanmaTarihi") && (
                <span className="hata-isareti">!</span>
              )}
            </div>
          </div>

          <div className="salt-okunur-bilgi sicaklik-araligi">
            İzin Verilen Sıcaklık Aralığı:{" "}
            {secilenAsi
              ? `${secilenAsi.minSicaklik}°C - ${secilenAsi.maxSicaklik}°C`
              : "Aşı seçiniz"}

            {secilenAsi && <CheckCircle size={20} />}
          </div>
        </AlanKarti>

        <AlanKarti
          baslik="Rota ve Lojistik Bilgileri"
          ikon={<Truck size={62} />}
        >
          <div className="form-grid iki-kolon">
            <div className="form-grup">
              <label>Çıkış Noktası</label>

              <select
                className={
                  hataVarMi("cikisNoktasi")
                    ? "input-hata"
                    : ""
                }
                value={form.cikisNoktasi}
                onChange={(e) =>
                  alanGuncelle(
                    "cikisNoktasi",
                    e.target.value
                  )
                }
              >
                <option value="">Seçiniz</option>

                {iller.map((il) => (
                  <option key={il} value={il}>
                    {il}
                  </option>
                ))}
              </select>

              {hataVarMi("cikisNoktasi") && (
                <span className="hata-isareti">!</span>
              )}
            </div>

            <div className="form-grup">
              <label>Varış Noktası</label>

              <select
                className={
                  hataVarMi("varisNoktasi")
                    ? "input-hata"
                    : ""
                }
                value={form.varisNoktasi}
                onChange={(e) =>
                  varisNoktasiGuncelle(e.target.value)
                }
              >
                <option value="">Seçiniz</option>

                {iller.map((il) => (
                  <option key={il} value={il}>
                    {il}
                  </option>
                ))}
              </select>

              {hataVarMi("varisNoktasi") && (
                <span className="hata-isareti">!</span>
              )}
            </div>

            <div className="form-grup">
              <label>Taşıma Aracı</label>

              <select
                className={
                  hataVarMi("tasimaAraci")
                    ? "input-hata"
                    : ""
                }
                value={form.tasimaAraci}
                onChange={(e) =>
                  alanGuncelle(
                    "tasimaAraci",
                    e.target.value
                  )
                }
              >
                <option value="">Seçiniz</option>

                {tasimaAraclari.map((arac) => (
                  <option key={arac} value={arac}>
                    {arac}
                  </option>
                ))}
              </select>

              {hataVarMi("tasimaAraci") && (
                <span className="hata-isareti">!</span>
              )}
            </div>

            <div className="form-grup">
              <label>Tahmini Teslim Süresi</label>

              <input
                value={form.tahminiTeslimSuresi}
                onChange={(e) =>
                  alanGuncelle(
                    "tahminiTeslimSuresi",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-grup tam-genislik">
              <label>Sorumlu Personel</label>

              <input
                className={
                  hataVarMi("sorumluPersonel")
                    ? "input-hata"
                    : ""
                }
                value={form.sorumluPersonel}
                onChange={(e) =>
                  alanGuncelle(
                    "sorumluPersonel",
                    e.target.value
                  )
                }
              />

              {hataVarMi("sorumluPersonel") && (
                <span className="hata-isareti">!</span>
              )}
            </div>
          </div>
        </AlanKarti>

        <AlanKarti
          baslik="Alıcı Kurum Bilgileri"
          ikon={<Building2 size={62} />}
        >
          <div className="alici-grid">
            <label>Alıcı Kurum</label>

            <div className="form-grup">
              <select
                className={
                  hataVarMi("aliciKurumId")
                    ? "input-hata"
                    : ""
                }
                value={form.aliciKurumId}
                onChange={(e) => aliciKurumSec(e.target.value)}
                disabled={!form.varisNoktasi}
              >
                <option value="">
                  {form.varisNoktasi
                    ? "Seçiniz"
                    : "Önce varış noktası seçiniz"}
                </option>

                {filtreliAliciKurumlar.map((kurum) => (
                  <option key={kurum.id} value={kurum.id}>
                    {kurum.ad}
                  </option>
                ))}
              </select>

              {hataVarMi("aliciKurumId") && (
                <span className="hata-isareti">!</span>
              )}
            </div>

            <label>Alıcı Yetkili Kişi</label>

            <input
              className={
                hataVarMi("aliciYetkiliKisi")
                  ? "input-hata"
                  : ""
              }
              value={form.aliciYetkiliKisi}
              onChange={(e) =>
                alanGuncelle("aliciYetkiliKisi", e.target.value)
              }
              placeholder="Yetkili kişi adını giriniz"
            />

            <label>Alıcı Kurum E-Posta</label>

            <input
              readOnly
              value={
                form.aliciKurumEposta ||
                "Kurum seçildiğinde otomatik dolacak"
              }
            />
          </div>
        </AlanKarti>

        <AlanKarti
          baslik="Sensör / Simülasyon Bilgileri"
          ikon={<Thermometer size={62} />}
        >
          <div className="form-grid iki-kolon">
            <div className="form-grup">
              <label>Sensör Modu</label>

              <select
                value={form.sensorModu}
                onChange={(e) =>
                  alanGuncelle(
                    "sensorModu",
                    e.target.value
                  )
                }
              >
                <option>Simülasyon</option>
              </select>
            </div>

            <div className="form-grup">
              <label>Ölçüm Aralığı</label>

              <select
                value={form.olcumAraligi}
                onChange={(e) =>
                  alanGuncelle(
                    "olcumAraligi",
                    e.target.value
                  )
                }
              >
                <option>5 Saniyede Bir</option>
                <option>10 Saniyede Bir</option>
                <option>30 Saniyede Bir</option>
              </select>
            </div>

            <div className="form-grup tam-genislik">
              <label>Başlangıç Sıcaklığı</label>

              <input
                className={
                  hataVarMi("baslangicSicakligi")
                    ? "input-hata"
                    : ""
                }
                value={form.baslangicSicakligi}
                onChange={(e) =>
                  alanGuncelle(
                    "baslangicSicakligi",
                    e.target.value
                  )
                }
              />

              {hataVarMi("baslangicSicakligi") && (
                <span className="hata-isareti">!</span>
              )}
            </div>
          </div>
        </AlanKarti>

        <section className="blockchain-bilgi-kutusu">
          <Link2 size={58} />

          <div>
            <h2>Blockchain Ön Kaydı</h2>

            <p>
              Bu sevkiyat başlatıldığında veriler
              veritabanına kaydedilecek, başlangıç hash’i
              oluşturulacak ve blockchain ağına yazılacaktır.
            </p>
          </div>
        </section>

        <div className="form-butonlari">
          <button
            type="button"
            className="buton buton-kirmizi-soft"
          >
            İptal
          </button>

          <button
            type="button"
            className="buton buton-acik"
            onClick={() => {
              setForm(baslangicFormu);
              setGonderildiMi(false);
            }}
          >
            Temizle
          </button>

          <button type="submit" className="buton buton-yesil">
            ↔ Sevkiyatı Başlat
          </button>
        </div>
      </form>
    </div>
  );
}