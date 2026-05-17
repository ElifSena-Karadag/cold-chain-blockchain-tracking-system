import { useState } from "react";

import {
  ShieldCheck,
  Mail,
  LogIn,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { kullaniciBul } from "./veriler/kullanicilar";

export default function Giris() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [hata, setHata] = useState("");

  function girisYap() {
    const kullanici = kullaniciBul(email);

    if (!kullanici) {
      setHata("Yetkisiz e-posta adresi.");
      return;
    }

    localStorage.setItem(
      "aktifKullanici",
      JSON.stringify(kullanici)
    );

    if (kullanici.rol === "Gönderen Kurum") {
      navigate("/gonderen/dashboard");
    } else {
      navigate("/alici/gelen-sevkiyatlar");
    }
  }

  return (
    <div className="giris-sayfasi">
      <div className="giris-karti">
        <div className="giris-logo">
          <ShieldCheck size={54} />

          <h1>COLDCHAIN PRO</h1>
        </div>

        <p className="giris-aciklama">
          Blockchain tabanlı aşı soğuk zincir takip sistemine
          kurum e-postanız ile giriş yapın.
        </p>

        <div className="giris-formu">
          <label>Kurum E-Postası</label>

          <div className="giris-input-alani">
            <Mail size={20} />

            <input
              type="email"
              placeholder="ornek: erzurumsehir@saglik.gov.tr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setHata("");
              }}
            />
          </div>

          {hata && (
            <div className="giris-hata">
              {hata}
            </div>
          )}

          <button
            className="giris-buton"
            onClick={girisYap}
          >
            <LogIn size={20} />
            Sisteme Giriş Yap
          </button>
        </div>

        <div className="demo-bilgileri">
          <h3>Demo Hesapları</h3>

          <div className="demo-kutu">
            <strong>Gönderen Kurum</strong>

            <p>tcasidagitim@saglik.gov.tr</p>
          </div>

          <div className="demo-kutu">
            <strong>Alıcı Kurum Örnekleri</strong>

            <p>erzurumsehir@saglik.gov.tr</p>
<p>ankarasehir@saglik.gov.tr</p>
<p>istanbulsehir@saglik.gov.tr</p>
          </div>
        </div>
      </div>
    </div>
  );
}