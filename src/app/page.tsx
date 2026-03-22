import styles from "./page.module.css";
import Header from "@/components/Header";
import Workspace from "@/components/Workspace";
import SettingsPanel from "@/components/SettingsPanel";
import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainLayout}>
        <div className={styles.content}>
          <Workspace />
          <Gallery />
        </div>
        <SettingsPanel />
      </main>
    </div>
  );
}


