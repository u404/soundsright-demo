import type { NextPage } from "next";
import { Space } from "antd";

import useConnector from "../hooks/useConnector";
import QRCodeModal from "../hooks/QRCodeModal";
import { useEffect } from "react";

const ConnectorPage: NextPage = () => {

  const { connector, ConnectorCard } = useConnector();

  useEffect(() => {
    // 注意，一旦注册，将不提供取消注册的方式
    connector?.registUriHandler((uri, disconnect) => {
      QRCodeModal.open(uri, disconnect);
      return () => QRCodeModal.close();
    });
  }, [connector]);

  return (
    <Space direction="vertical" className="main-space" size="middle">
      <ConnectorCard></ConnectorCard>
    </Space>
  );
};

export default ConnectorPage;
