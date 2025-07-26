import React from "react";
import { Metadata } from "next";
import AdminLayoutWrapper from "./layoutWrapper";

export const metadata: Metadata = {
  title: "Admin | Entrance Question",
  description:
    "A comprehensive admin dashboard for managing multiple choice questions",
};
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
};

export default AdminLayout;
