import mongoose from "mongoose";

export async function veritabaninaBaglan() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB bağlantısı başarılı");
  } catch (hata) {
    console.error("MongoDB bağlantı hatası:", hata.message);
    process.exit(1);
  }
}