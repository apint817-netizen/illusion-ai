import styles from "./page.module.css";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import SettingsPanel from "@/components/SettingsPanel";
import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainLayout}>
        <div className={styles.content}>
          <ImageUploader />
          <Gallery />
        </div>
        <SettingsPanel />
      </main>
    </div>
  );
}

