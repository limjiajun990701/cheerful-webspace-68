
import React from "react";
import SkillCategoryManager from "@/components/admin/SkillCategoryManager";

const AdminMySkill = () => {
  return (
    <div className="min-h-screen bg-background px-4 pt-6">
      <h1 className="text-3xl font-extrabold mb-6">Manage My Skill</h1>
      <SkillCategoryManager />
    </div>
  );
};

export default AdminMySkill;
