
import React from "react";
import SkillsManager from "@/components/admin/SkillsManager";

const AdminMySkill = () => {
  return (
    <div className="min-h-screen bg-background px-4 pt-6">
      <h1 className="text-3xl font-extrabold mb-6">Manage My Skill</h1>
      <SkillsManager />
    </div>
  );
};

export default AdminMySkill;
