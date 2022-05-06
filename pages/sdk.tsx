import SDK from "@soundsright/sdk";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Card, Space, message, Input } from "antd";
import useConnector from "../hooks/useConnector";

const SdkPage: NextPage = () => {

  const [sdk, setSdk] = useState<SDK>();
  const [text, setText] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [loadingText, setLoadingText] = useState<string>("");
  const { ConnectorCard } = useConnector();

  useEffect(() => {
    (async () => {
      const sdk = new SDK();
      setSdk(sdk);
      sdk?.service.setHeaders({
        "Finger-Nft-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aGlzIGlzIGZpbmdlciBuZnQgdG9rZW4iLCJhdWQiOiJEQVBQQ0hBSU4iLCJhZGRyZXNzIjoiMHgxMDUzNjhmNDZmNTk2YWVlYjdiZmRlYjk0NGY2ZTE1MTVlNGYxOGNkIiwiaXNzIjoiRmluZ2VybmZ0IiwiZXhwIjoxNjU0MTY2MzIyLCJpYXQiOjE2NTE0ODc5MjJ9.HxITruDCA3923D6t9RgrTJEDei0zl7EOTROBPnotqhw"
      });

    })();
  }, []);

  const signMessage = async () => {
    const signedMesssage = await sdk?.chain.signMessage(text);
    message.success(`签名后的数据为：${signedMesssage}`);
  };

  const getBalance = async () => {
    const bl = await sdk?.chain.getBalance();
    setBalance(bl as string);
  };

  const approveUSDC = async () => {
    const NftAddress = "0x0AE9999FF8e9B6f30CeB01834eF9945efa0da08f"; // "0xa6aF5f9113a9992CD5b794DAeb8491bdCc417dbF";
    const usdcTokenAddress = "0x19d31b7e068b5E1EC77fbc66116D686C82F169c2";

    const res = await sdk?.chain.token.approve(usdcTokenAddress, NftAddress, "10000000000000000");
    console.log("approve---------", res);
  };

  const buyAndMint = async () => {
    const nftAddress = "0x4b31e4716A4A371CCb4504163B0A942CA45f3D05";
    const tokenId = "";

    const apiData = await sdk?.service.nft.getBuySignData(nftAddress, tokenId);

    const { to, tokenURI, skuContractInfo, v, r, s } = apiData;

    await sdk?.chain.token.approve(skuContractInfo.token, nftAddress, skuContractInfo.price);

    const tx = await sdk?.chain.nft.buyAndMint(
      nftAddress,
      apiData.tokenId,
      to,
      tokenURI,
      skuContractInfo,
      v,
      r,
      s,
    );

    message.success("购买成功");

  };

  const signTypedData = async () => {
    // All properties on a domain are optional
    const domain = {
      name: 'Ether Mail',
      version: '1',
      chainId: sdk?.connector.state.chainId,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    };

    // The named list of all type definitions
    const types = {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' }
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' }
      ]
    };

    // The data to sign
    const value = {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
      },
      contents: 'Hello, Bob!'
    };

    const signedMesssage = await sdk?.chain.signTypedMessage(domain, types, value);
    message.success(`签名后的数据为：${signedMesssage}`);
  };

  return (
    <Space direction="vertical" className="main-space" size="middle">
      <ConnectorCard />
      <Card className="wallet" title="钱包功能">
        <div className="data-row">
          <span className="data-label">签名消息：</span>
          <span className="data-col">
            <Input.Group compact style={{ width: '400px' }}>
              <Input style={{ width: 'calc(100% - 100px)' }} placeholder="消息内容" value={text} onInput={e => setText((e.target as any).value)} />
              <Button style={{ width: '100px' }} type="primary" disabled={!text} onClick={signMessage}>签名消息</Button>
            </Input.Group>
          </span>
        </div>
        <div className="data-row">
          <span className="data-label">签名消息：</span>
          <span className="data-col">
            <Button type="primary" onClick={signTypedData}>签名格式化数据</Button>
          </span>
        </div>
        <div className="data-row">
          <span className="data-label">获取余额：</span>
          <span className="data-col">
            <Space>
              <span>{balance} ETH</span>
              <Button onClick={getBalance}>获取余额</Button>
            </Space>
          </span>
        </div>
      </Card>
      <Card className="nft" title="NFT市场">
        <div className="data-row">
          <span className="data-label">Approve ERC20</span>
          <span className="data-col">
            <Space>
              <Button loading={!!loadingText} onClick={approveUSDC}>Approve USDC</Button>
            </Space>
          </span>
        </div>
        <div className="data-row">
          <span className="data-label">购买：</span>
          <span className="data-col">
            <Space>
              <Button loading={!!loadingText} onClick={buyAndMint}>购买并铸造</Button>
              <Button loading={!!loadingText} onClick={() => sdk?.nftMarket.buyAndMint("0x4b31e4716A4A371CCb4504163B0A942CA45f3D05", "")}>购买并铸造（包装）</Button>
            </Space>
          </span>
        </div>
      </Card>
    </Space>
  );
};

export default SdkPage;
