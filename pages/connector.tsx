import type { NextPage } from "next";
import { Space } from "antd";

import useConnector from "../hooks/useConnector";

const ConnectorPage: NextPage = () => {

  const { ConnectorCard } = useConnector();

  return (
    <Space direction="vertical" className="main-space" size="middle">
      <ConnectorCard />
    </Space>
  );
};

export default ConnectorPage;
