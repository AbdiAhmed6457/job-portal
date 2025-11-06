import sequelize from "../config/db.js";
import User from "./User.js";
import Company from "./Company.js";
import Job from "./Job.js";
import Application from "./Application.js";
import StudentProfile from "./StudentProfile.js";

// Associations
User.hasOne(StudentProfile, { foreignKey: "userId", onDelete: "CASCADE" });
StudentProfile.belongsTo(User, { foreignKey: "userId" });

Company.belongsTo(User, { foreignKey: "recruiterUserId" });
User.hasOne(Company, { foreignKey: "recruiterUserId" });

Job.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(Job, { foreignKey: "companyId" });

Application.belongsTo(Job, { foreignKey: "jobId" });
Job.hasMany(Application, { foreignKey: "jobId" });

Application.belongsTo(User, { foreignKey: "studentUserId" });
User.hasMany(Application, { foreignKey: "studentUserId" });

// DB Initialization
export const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // **IMPORTANT**: Don't use { alter: true } blindly if duplicates exist
    // Use force: false to avoid dropping data
    await sequelize.sync({ force: false });
    console.log("🧩 Models synchronized successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  }
};

export { sequelize, User, Company, Job, Application, StudentProfile };



