import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Job from "./Job.js";
import User from "./User.js";

const Application = sequelize.define("Application", {
  coverLetter: { type: DataTypes.TEXT, allowNull: true },
  cvUrl: { type: DataTypes.STRING, allowNull: true },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
});

// Relation: 1 Job → many Applications
Application.belongsTo(Job, { foreignKey: "jobId", onDelete: "CASCADE" });
Job.hasMany(Application, { foreignKey: "jobId" });

// Relation: 1 User (student) → many Applications
Application.belongsTo(User, { foreignKey: "studentUserId", onDelete: "CASCADE" });
User.hasMany(Application, { foreignKey: "studentUserId" });

export default Application;
