import type { NextPage } from "next";
import { Space, Card, Button, message } from "antd";
import Auth, { AuthResult } from "@soundsright/auth";
import Connector, { ConnectType } from "@soundsright/connector";
import { useState, useEffect } from "react";

const auth = new Auth("dev");

const UserPage: NextPage = () => {

  const [connector, setConnector] = useState<Connector>();

  useEffect(() => {
    (async () => {
      const connector = Connector.getInstance();
      setConnector(connector);

      // 弹窗面板
      const QRCodeModal = (await import('@walletconnect/qrcode-modal')).default;

      // 手动注册uri处理器
      connector.registUriHandler((uri: string, disconnect: any) => {
        QRCodeModal.open(uri, () => {
          disconnect();
        });
        return () => QRCodeModal.close();
      });

      // 尝试直接使用上一次的连接
      connector.tryLastConnect();
    })();
  }, []);


  // 提交给服务端验证，获取平台token（目前demo里只有钱包验签演示）
  const authLogin = async (res: AuthResult) => {
    console.log("call login api", res);

    const paramsStr = Object.keys(res).map((key) => `${key}=${encodeURIComponent(res[key as keyof AuthResult])}`).join('&');

    // 提交到服务器
    const result = await fetch(`https://localhost:8080/api/login?${paramsStr}`);

    const json = await result.json();

    json.success ? message.success("验签成功") : message.error("验签失败");

  };

  return (
    <Space direction="vertical" className="main-space" size="middle">
      <Card className="wallet" title="登录功能">
        <div className="data-row">
          <Space>
            <Button onClick={() => auth.authByGoogle().then(authLogin)}>Google 登录</Button>
            <Button onClick={() => auth.authByFacebook().then(authLogin)}>Facebook 登录</Button>
            <Button onClick={() => auth.authByTwitter().then(authLogin)}>Twitter 登录</Button>
            <Button onClick={() => auth.authByWallet({ connectType: ConnectType.MetaMask, signMessage: "Hello，欢迎登录lyrra！" }).then(authLogin)}>MetaMask 钱包登录</Button>
            <Button onClick={() => auth.authByWallet({ connectType: ConnectType.WalletConnector, signMessage: "Hello，欢迎登录lyrra！" }).then(authLogin)}>WalletConnect 钱包登录</Button>
          </Space>
        </div>
      </Card>
    </Space>
  );
};

export default UserPage;
