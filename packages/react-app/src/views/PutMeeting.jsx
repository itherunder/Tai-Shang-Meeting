import { Form, Modal, Input } from "antd";
import { useState } from "react";

export default function PutMeeting({ signer, address }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const putMeeting = async() => {
    setLoading(true);
    let values = form.getFieldsValue();

    if (!address) return;
    try {
      var response = await fetch("https://faasbyleeduckgo.gigalixirapp.com/api/v1/run?name=Meeting&func_name=rand_msg", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "params": []
        })
      });
      var res = await response.json();
      var key = res?.result;
      var meeting_info = JSON.stringify(values)
      var sig = await signer.signMessage(meeting_info);
      response = await fetch('https://faasbyleeduckgo.gigalixirapp.com/api/v1/run?name=Meeting&func_name=put_meeting', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "params": [
            key,
            address,
            meeting_info,
            sig,
          ]
        })
      });
      res = await response.json();
      if (res?.status === "ok") {
        Modal.success("Successfully put meeting with key: " + key);
      }
    } catch (err) {
      Modal.error("Failed to put meeting: " + err);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Form
        layout="horizontal"
        onFinish={putMeeting}
        form={form}
        size="middle"
      >
        <h4>会议信息：</h4>
        <Form.Item label="会议标题：" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="主讲人：" name="host">
          <Input />
        </Form.Item>
        <Form.Item label="会议描述：" name="description">
          <Input />
        </Form.Item>
        <Form.Item label="时间：" name="period">
          <Input />
        </Form.Item>
      </Form>
    </div>
  )
}