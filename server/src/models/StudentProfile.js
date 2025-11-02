import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const StudentProfile = sequelize.define("StudentProfile", {
  university: { type: DataTypes.STRING, allowNull: false },
  gpa: { type: DataTypes.FLOAT, allowNull: false },
  skills: { type: DataTypes.JSON, allowNull: true }, // array of strings
  visibility: { type: DataTypes.BOOLEAN, defaultValue: true },
  cv: { type: DataTypes.STRING, allowNull: true } // stores filename of uploaded CV
});

// Relations: 1 User → 1 StudentProfile
StudentProfile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(StudentProfile, { foreignKey: "userId" });

export default StudentProfile;
