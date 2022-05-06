import type { NextPage } from 'next';
import Link from "next/link";

import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="/sdk">
            <a className={styles.card}>
              <h2>SDK &rarr;</h2>
              <p>SDK 测试页面</p>
            </a>
          </Link>

          <Link href="/connector">
            <a className={styles.card}>
              <h2>Connector &rarr;</h2>
              <p>Connector 测试页面</p>
            </a>
          </Link>

          <Link href="/auth">
            <a className={styles.card}>
              <h2>Auth &rarr;</h2>
              <p>Auth 测试页面</p>
            </a>
          </Link>

          <Link href="/qrcode">
            <a className={styles.card}>
              <h2>Qrcode &rarr;</h2>
              <p>Connector 弹窗自定义</p>
            </a>
          </Link>

        </div>
      </main>
    </div>
  );
};

export default Home;
