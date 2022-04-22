import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header({ link, title, subTitle }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <PageHeader title={title} subTitle={subTitle} style={{ cursor: "pointer" }} />
    </a>
  );
}

Header.defaultProps = {
  link: "https://github.com/WeLightProject/Tai-Shang-Meeting-Verifier",
  title: "Tai-Shang-Meeting-Verifier",
  subTitle: "verfier for Tai-Shang-Meeting!",
};
