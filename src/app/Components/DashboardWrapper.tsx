"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Header from "./Header";
interface Props {
  children: React.ReactNode;
}

function DashboardWrapper(props: Props) {
  const { children } = props;

  return (
    <Provider store={store}>
      <Header />
      {children}
    </Provider>
  );
}

export default DashboardWrapper;
