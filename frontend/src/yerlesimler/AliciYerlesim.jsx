import { Outlet } from "react-router-dom";

import AliciKenarCubugu from "../bilesenler/AliciKenarCubugu";
import AliciUstCubuk from "../bilesenler/AliciUstCubuk";

export default function AliciYerlesim() {
  return (
    <div className="uygulama-kabugu">
      <AliciKenarCubugu />

      <main className="ana-alan">
        <AliciUstCubuk />

        <div className="sayfa-icerigi">
          <Outlet />
        </div>
      </main>
    </div>
  );
}