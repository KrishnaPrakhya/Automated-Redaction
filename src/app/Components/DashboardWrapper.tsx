"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
interface Props {
  children: React.ReactNode;
}

function DashboardWrapper(props: Props) {
  const { children } = props;

  return <Provider store={store}>{children}</Provider>;
}

export default DashboardWrapper;
