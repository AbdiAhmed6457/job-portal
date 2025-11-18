// src/models/Job.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Company from "./Company.js";


// models/Job.js
const Job = sequelize.define("Job", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  requirements: { type: DataTypes.TEXT }, // optional array or string
  gpaMin: { type: DataTypes.FLOAT },
  location: { type: DataTypes.STRING },
  salary: { type: DataTypes.INTEGER }, // store as number
  category: { type: DataTypes.ENUM("Engineering", "Design", "Marketing", "HR", "Sales", "Health", "Accountant") },
  jobType: { type: DataTypes.ENUM("onsite", "remote", "fulltime") },
  expiresAt: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM("pending", "approved", "rejected", "expired") },
  recruiterUserId: { type: DataTypes.INTEGER, allowNull: false },
});


Job.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(Job, { foreignKey: "companyId" });

export default Job;
