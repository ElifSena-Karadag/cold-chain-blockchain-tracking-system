import { Outlet } from "react-router-dom";

import KenarCubugu from "../bilesenler/KenarCubugu";
import UstCubuk from "../bilesenler/UstCubuk";

export default function GonderenYerlesim() {
  return (
    <div className="uygulama-kabugu">
      <KenarCubugu />

      <main className="ana-alan">
        <UstCubuk />

        <div className="sayfa-icerigi">
          <Outlet />
        </div>
      </main>
    </div>
  );
}