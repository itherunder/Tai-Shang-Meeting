import { Card, Spin, Input, Modal, Typography } from "antd";
import React from "react";
import { useState } from "react";
const { Search } = Input;
const { Paragraph } = Typography;
/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ address, signer }) {
  const [loading, setLoading] = useState(false);
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [data, setData] = useState(null);
  const [hide, setHide] = useState(true);

  const getMeeting = async (key) => {
    if (key === "") {
      return;
    }
    setLoading(true);
    if (!address) return;
    try {
      var sig = await signer.signMessage("I'm query for the meeting: " + key);
      var response = await fetch('https://faasbyleeduckgo.gigalixirapp.com/api/v1/run?name=Meeting&func_name=get_meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          params: [
            key,
            address,
            "I'm query for the meeting: " + key,
            sig,
          ],
        }),
      });
      var res = await response.json();
      if (res?.result?.status === "ok") {
        setIsWhiteListed(true);
        setData(JSON.parse(res?.result?.payload));
      } else {
        Modal.error({
          title: "错误",
          content: "您不是白名单用户，无法查询，请点击下面的链接申请白名单",
        })
        setIsWhiteListed(false);
      }
      setHide(false);
    } catch (err) {
      Modal.error({
        title: "错误",
        content: "获取会议信息失败：" + err,
      })
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
      <div style={{ width: "50%" }}>
        <Search
          placeholder="请输入会议的key"
          allowClear
          enterButton="查询"
          size="middle"
          onSearch={(value) => {getMeeting(value);}}
          required={true}
          loading={loading}
        />
        {
          hide ? null : (isWhiteListed ? (
            <Card
              size="middle"
              title={<b>{"会议标题：" + data?.title}</b>}
              extra={<a href={data?.url}>参会</a>}
              style={{ width: "100%", marginTop: "20px" }}
            >
              <div style={{ textAlign: "left", marginLeft: "10px" }}>
                <Paragraph>
                  <b>主讲人：</b>
                  {data?.host}
                </Paragraph>
              </div>
              <div style={{ textAlign: "left", marginLeft: "10px" }}>
                {/* {data?.description} */}
                <Paragraph>
                  <b>会议描述：</b>
                  {data?.description}
                </Paragraph>
              </div>
              <div style={{ textAlign: "left", marginLeft: "10px" }}>
                <Paragraph>
                  <b>时间：</b>
                  {data?.period[0] + " ~ " + data?.period[1]}
                </Paragraph>
              </div>
            </Card>
          ) : (
            <div style={{ marginTop: "10px" }}>
              <a href="mailto:leeduckgo@gmail.com">白名单申请请联系：leeduckgo</a>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Home;
