import type { NextPage } from "next";
import { Space, Card, Button } from "antd";
import { authResponse } from "@soundsright/auth";
import { useEffect, useState } from "react";

const AuthCallback: NextPage = () => {
  const [error, setError] = useState("");

  useEffect(() => {
    const { error } = authResponse();
    if (error) {
      setError(error);
    }
  }, []);

  return (
    <Space direction="vertical" className="main-space" size="middle">
      <Card className="wallet" title="登录功能">
        <div className="data-row">
          {!error ? (
            <div>授权成功，请关闭此页面</div>
          ) : (
            <div>授权失败，错误信息：{error}</div>
          )}
        </div>
      </Card>
    </Space>
  );
};

export default AuthCallback;
