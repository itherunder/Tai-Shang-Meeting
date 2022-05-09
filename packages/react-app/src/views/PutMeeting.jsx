import { Form, Modal, Input, DatePicker, Button, Spin } from "antd";
import { useState } from "react";
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function PutMeeting({ address, signer }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const formItemLayout = {
    labelCol: { span: 4, offset: 0 },
    wrapperCol: { span: 20 },
  };
  const buttonItemLayout ={
    wrapperCol: { span: 24, offset: 4 },
  }

  const putMeeting = async() => {
    setLoading(true);
    let values = form.getFieldsValue();
    values.period = values.period.map((item) => {
      return item.format("YYYY-MM-DD HH:mm");
    });
    console.log('values: ', values);

    if (!address) {
      setLoading(false);
      return;
    }
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
      if (!res || !key) {
        Modal.error({
          title: "Error",
          content: "Failed to get key",
        });
      }
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
      if (res?.result?.status === "ok") {
        Modal.success({
          title: "Success",
          content: "Successfully put meeting with key: " + key,
        });
      } else {
        Modal.error({
          title: "Error",
          content: "Failed to put meeting",
        });
      }
    } catch (err) {
      Modal.error({
        title: "Error",
        content: "Failed to put meeting: " + err,
      });
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
      <Spin spinning={loading} />
      <Form
        {...formItemLayout}
        layout="horizontal"
        onFinish={putMeeting}
        form={form}
        size="middle"
        style={{ width: "50%" }}
      >
        <Form.Item label="会议标题：" name="title" rules={[
          {
            required: true,
            message: '请输入会议标题',
          },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="主讲人：" name="host" rules={[
          {
            required: true,
            message: '请输入会议主讲人',
          },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="会议描述：" name="description"rules={[
          {
            required: true,
            message: '请输入会议描述',
          },
        ]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="会议地址：" name="url" rules={[
          {
            required: true,
            message: '请输入会议地址',
          },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="时间：" name="period" rules={[
          {
            required: true,
            message: '请输入会议时间',
          },
        ]}>
          <RangePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>提交</Button>
        </Form.Item>
      </Form>
    </div>
  )
}