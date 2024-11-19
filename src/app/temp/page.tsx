"use client";
import { getAllData } from "@/features/git/GithubSlice";
import React from "react";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
interface Props {}

function Page(props: Props) {
  const {} = props;
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector((state: RootState) => state.gitUser.users);
  return (
    <div>
      <button
        onClick={() => {
          dispatch(getAllData());
        }}
      >
        GET FKING USERS
      </button>
      <div>
        {data.map((item) => (
          <p>{item.login}</p>
        ))}
      </div>
    </div>
  );
}

export default Page;
