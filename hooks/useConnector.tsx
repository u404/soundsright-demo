import { Card, Space, Button, Modal, Radio, message } from "antd";

import Connector, { ConnectType } from "@soundsright/connector";
import { useState, useEffect, useCallback } from "react";

const ConnectorCard = ({ connected, connectType, account, chainId, onConnect, onDisconnect, onSwitchChain }: {
  connected: boolean,
  connectType: ConnectType | undefined,
  account: string,
  chainId: number,
  onConnect: (type: ConnectType) => void,
  onDisconnect: () => void,
  onSwitchChain: (chainId: number) => void
}) => {

  const showSwitchChainModal = useCallback(() => {
    const options = [
      { label: 'Ethereum', value: 1 },
      { label: 'Polygon', value: 137 },
      { label: 'Polygon Mumbai', value: 80001 },
    ];
    let selectedChainId = chainId;
    Modal.confirm({
      title: "切换链",
      content: (
        <Radio.Group options={options} defaultValue={selectedChainId} onChange={e => (selectedChainId = +e.target.value)}></Radio.Group>
      ),
      onOk: () => {
        if (selectedChainId === chainId) {
          message.error("请选择一个不同的链");
          return Promise.reject();
        }
        onSwitchChain(selectedChainId);
      }
    });
  }, [chainId, onSwitchChain]);

  return (
    <Card className="connection" title="钱包连接">
      <div className="data-row">
        <span className="data-label">连接状态：</span>
        <span className="data-col">
          {connected ? (
            <span className="data-value success-text">已连接，类型【{connectType}】，钱包地址【{account}】，链ID【{chainId}】</span>
          ) : (
            <span className="data-value error-text">未连接</span>
          )}
        </span>
      </div>
      <div className="data-row">
        <span className="data-label">操作：</span>
        <span className="data-col">
          <Space>
            {connectType !== ConnectType.MetaMask && (
              <Button onClick={() => onConnect(ConnectType.MetaMask)}>连接MetaMask</Button>
            )}
            {connectType !== ConnectType.WalletConnector && (
              <Button onClick={() => onConnect(ConnectType.WalletConnector)}>连接WalletConnector</Button>
            )}
            {connected && (
              <>
                <Button onClick={showSwitchChainModal}>切换链</Button>
                <Button onClick={onDisconnect}>断开连接</Button>
              </>
            )}
          </Space>
        </span>
      </div>
    </Card>
  );
};

const useConnector = () => {
  const [connector, setConnector] = useState<Connector>();
  const [connected, setConnected] = useState<boolean>(false);
  const [connectType, setConnectType] = useState<ConnectType>();
  const [chainId, setChainId] = useState<number>(1);
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    (async () => {
      const connector = Connector.getInstance();
      setConnector(connector);

      connector.on("change", (e) => {
        setConnected(!!e.connected);
        setAccount(e.account);
        setChainId(e.chainId || 1);
        setConnectType(connector.type);
      });

      // 尝试直接使用上一次的连接
      connector.tryLastConnect();
    })();
  }, []);

  const onConnect = useCallback(async (type: ConnectType) => {
    const targetChainId = chainId;
    const state = await connector?.connect(type);
    if (state.chainId !== targetChainId) {
      connector?.switchChain(targetChainId);
    }
  }, [connector, chainId]);

  const onDisconnect = useCallback(() => {
    connector?.disconnect();
  }, [connector]);

  const onSwitchChain = useCallback((chainId: number) => {
    connector?.switchChain(chainId);
  }, [connector]);

  return {
    connector,
    ConnectorCard: () => ConnectorCard({ connected, connectType, chainId, account, onConnect, onDisconnect, onSwitchChain })
  };
};

export default useConnector;