import prisma from "@/lib/db";
import React from "react";

interface Props {
  params: any;
}

async function Page(props: Props) {
  const { params } = props;

  return (
    <div>
      <h1 className="text-3xl font-semibold">
        {/* {showConfigs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-none w-60 hidden"
          >
            <TotalPages />
          </motion.div>
        )} */}
      </h1>
    </div>
  );
}

export default Page;
