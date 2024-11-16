import React from "react";
import UsersTable from "./table";

function AdminUsersDataPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-start w-full mb-5">
        <h1 className="font-bold text-xl md:!text-2xl lg:!text-3xl">
          ユーザーデータ
        </h1>
      </div>
      <section className="flex flex-col justify-center items-start w-full">
        <UsersTable />
      </section>
    </div>
  );
}

export default AdminUsersDataPage;
