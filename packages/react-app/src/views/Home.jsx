import { Card, Spin } from "antd";
import React from "react";
import { useState, useEffect } from "react";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ address }) {
  const [loading, setLoading] = useState(true);
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [data, setData] = useState(null);

  const queryWhiteList = async () => {
    setLoading(true);
    if (!address) return;
    try {
      var res = await fetch(`http://localhost:8080/api/is_whitelisted?addr=${address}`);
      res = await res.json();
      console.log("res", res);
    } catch (err) {
      alert(err);
    }
    setIsWhiteListed(res?.is_whitelisted);
    setData(res?.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!address) return;
    queryWhiteList();
  }, [address]);

  return (
    <div>
      <Spin spinning={loading}>
        {
          isWhiteListed ? (
            <Card
              size="small"
              title={<b>{"会议标题：" + data?.meeting_info?.name}</b>}
              extra={<a href={data?.meeting_info?.url}>More</a>}
              style={{ width: 400, margin: "auto", marginTop: "10px" }}
            >
              <p style={{ textAlign: "left", marginLeft: "50px" }}>
                <b>主讲人：</b>
                {data?.meeting_info?.hoster}
              </p>
              <p style={{ textAlign: "left", marginLeft: "50px" }}>
                <b>会议描述：</b>
                {data?.meeting_info?.description}
              </p>
              <p style={{ textAlign: "left", marginLeft: "50px" }}>
                <b>时间：</b>
                {data?.meeting_info?.period}
              </p>
              <p style={{ textAlign: "left", marginLeft: "50px" }}>
                <b>状态：</b>
                {data?.meeting_info?.status}
              </p>
            </Card>
          ) : (
            <p style={{ marginTop: "10px" }}>
              <a href={data?.apply_url}>Apply for meeting</a>
            </p>
          )
        }
      </Spin>
    </div>
  );
}

export default Home;
