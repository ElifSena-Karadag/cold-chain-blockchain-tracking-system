import { useEffect, useState } from "react";

import { Archive } from "lucide-react";

import DurumRozeti from "../bilesenler/DurumRozeti";

export default function SevkiyatGecmisi() {
  const [sevkiyatlar, setSevkiyatlar] = useState([]);

  useEffect(() => {
    async function sevkiyatlariGetir() {
      try {
        const cevap = await fetch(
          "http://localhost:5000/api/sevkiyatlar"
        );

        const veri = await cevap.json();

        const gecmisSevkiyatlar = veri.filter(
          (sevkiyat) =>
            sevkiyat.teslimDurumu === "Teslim Edildi"
        );

        setSevkiyatlar(gecmisSevkiyatlar);
      } catch (hata) {
        console.error(hata);
      }
    }

    sevkiyatlariGetir();
  }, []);

  return (
    <div className="sayfa">
      <div className="sayfa-basligi kompakt-baslik">
        <h1>Sevkiyat Geçmişi</h1>

        <p>
          Tamamlanan sevkiyat operasyonlarını görüntüleyin.
        </p>
      </div>

      <section className="beyaz-panel">
        <div className="panel-ust">
          <h2>Geçmiş Sevkiyatlar</h2>

          <DurumRozeti tip="yesil">
            {sevkiyatlar.length} TAMAMLANDI
          </DurumRozeti>
        </div>

        <table className="veri-tablosu">
          <thead>
            <tr>
              <th>Parti No</th>
              <th>Aşı</th>
              <th>Rota</th>
              <th>Teslim Tarihi</th>
              <th>Taşıma</th>
              <th>Risk</th>
              <th>Teslim</th>
              <th>Blockchain</th>
            </tr>
          </thead>

          <tbody>
            {sevkiyatlar.map((sevkiyat) => (
              <tr key={sevkiyat._id}>
                <td>{sevkiyat.partiNo}</td>

                <td>{sevkiyat.asiAdi}</td>

                <td>
                  {sevkiyat.cikisNoktasi} →{" "}
                  {sevkiyat.varisNoktasi}
                </td>

                <td>
                  {new Date(
                    sevkiyat.updatedAt
                  ).toLocaleDateString("tr-TR")}
                </td>

                <td>
                  <DurumRozeti tip="yesil">
                    {sevkiyat.tasimaDurumu}
                  </DurumRozeti>
                </td>

                <td>
                  <DurumRozeti
                    tip={
                      sevkiyat.riskDurumu === "Riskli"
                        ? "kirmizi"
                        : "yesil"
                    }
                  >
                    {sevkiyat.riskDurumu}
                  </DurumRozeti>
                </td>

                <td>
                  <DurumRozeti tip="yesil">
                    {sevkiyat.teslimDurumu}
                  </DurumRozeti>
                </td>

                <td>
                  <DurumRozeti tip="mavi">
                    {sevkiyat.blockchainDurumu}
                  </DurumRozeti>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sevkiyatlar.length === 0 && (
          <div className="bos-veri">
            <Archive size={48} />

            <p>Henüz tamamlanan sevkiyat bulunmuyor.</p>
          </div>
        )}
      </section>
    </div>
  );
}