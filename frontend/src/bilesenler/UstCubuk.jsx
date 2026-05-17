import { useState } from "react";

import {
  UserCircle,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function UstCubuk() {
  const navigate = useNavigate();
  const [profilAcik, setProfilAcik] = useState(false);

  const aktifKullanici = JSON.parse(
    localStorage.getItem("aktifKullanici")
  );

  function cikisYap() {
    const onay = window.confirm(
      "Çıkış yapmak istediğinize emin misiniz?"
    );

    if (onay) {
      localStorage.removeItem("aktifKullanici");
      navigate("/");
    }
  }

  return (
    <header className="ust-cubuk">
      <div></div>

      <div className="ust-cubuk-sag">
        <span>
          Hoş geldiniz,{" "}
          <b>
            {aktifKullanici?.kurumAdi ||
              "T.C. Sağlık Bakanlığı Aşı ve Soğuk Zincir Dağıtım Merkezi"}
          </b>
        </span>

        <div className="profil-alani">
          <UserCircle
            size={38}
            className="kullanici-ikonu"
            onClick={() => setProfilAcik(!profilAcik)}
          />

          {profilAcik && (
            <div className="profil-kart">
              <p>
                <b>Kurum:</b>{" "}
                {aktifKullanici?.kurumAdi}
              </p>

              <p>
                <b>Rol:</b>{" "}
                {aktifKullanici?.rol}
              </p>

              <p>
                <b>E-posta:</b>{" "}
                {aktifKullanici?.email}
              </p>
            </div>
          )}
        </div>

        <button
          className="mini-cikis-butonu"
          onClick={cikisYap}
        >
          <LogOut size={16} />
          Çıkış
        </button>
      </div>
    </header>
  );
}