import { ConnectorHelper, WalletConfig } from "@soundsright/connector";
import { useCallback, useEffect, useState } from "react";
import qrcode from "qrcode";
import { Button, Tabs, Image, List, Avatar, Modal } from "antd";

import { browser } from "../libs/utils";

const { TabPane } = Tabs;


export const QRCodePanel = ({ uri }: { uri: string }) => {

  const [walletConfigs, setWalletConfigs] = useState<WalletConfig[]>([]);
  const [qrcodeUrl, setQrcodeUrl] = useState<string>("");

  useEffect(() => {
    (async () => {
      const img = await qrcode.toDataURL(uri);
      setQrcodeUrl(img);

      if (browser.isAndroid()) {

      } else if (browser.isIOS()) {
        const wcs = await ConnectorHelper.getIOSWalletConfigs(); // 获取ios支持的钱包列表，可以传入白名单
        setWalletConfigs(wcs);
      } else {
        const wcs = await ConnectorHelper.getDesktopWalletConfigs();
        console.log("------------", wcs);
        setWalletConfigs(wcs);
      }
    })();

  }, [uri]);

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="扫码" key="1">
        <Image src={qrcodeUrl} alt="" />
        {walletConfigs.length}
      </TabPane>
      <TabPane tab="App唤起" key="2">
        {!walletConfigs.length ? (
          // 安卓中连接钱包
          <Button onClick={() => ConnectorHelper.openUri(uri)}>连接</Button>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={walletConfigs}
            renderItem={v => (
              // ios中或桌面，点击相应钱包按钮的操作
              <List.Item onClick={() => ConnectorHelper.openAppUri(uri, v)}>
                <List.Item.Meta
                  avatar={<Avatar src={v.logo} />}
                  title={v.name}
                />
              </List.Item>
            )}
          />
        )}
      </TabPane>
    </Tabs>
  );
};

const QRCodeModal = (() => {
  let modal: any;

  return {
    open(uri: string, onClose: () => void) {
      modal = Modal.confirm({
        content: (
          <QRCodePanel uri={uri}></QRCodePanel>
        ),
        onCancel: () => onClose(),
        onOk: () => onClose()
      });
    },
    close() {
      modal.destroy();
    }
  };
})();

export default QRCodeModal;