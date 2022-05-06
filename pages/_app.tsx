import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout, Menu, Space } from "antd";
const { Header, Content } = Layout;


function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const VConsole = (await import('vconsole')).default;
      const vConsole = new VConsole();
    })();
  }, []);


  return (
    <Layout>
      <Head>
        <title>Soundsright SDK Examples</title>
        <meta name="description" content="Soundsright SDK Examples" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <Link href="/">
          <a className='logo'>SoundsRight Examples</a>
        </Link>
        <Menu theme="dark" mode="horizontal" selectedKeys={[router.asPath]}>
          <Menu.Item key="/sdk">
            <Link href="/sdk">SDK 测试页面</Link>
          </Menu.Item>
          <Menu.Item key="/connector">
            <Link href="/connector">Connector 测试页面</Link>
          </Menu.Item>
          <Menu.Item key="/auth">
            <Link href="/auth">Auth 测试页面</Link>
          </Menu.Item>
          <Menu.Item key="/qrcode">
            <Link href="/qrcode">Connector 弹窗自定义</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Component {...pageProps} />
      </Content>
    </Layout>
  );
}

export default MyApp;
