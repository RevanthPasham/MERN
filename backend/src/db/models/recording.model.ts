import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export type RecordingType = "mock_interview" | "tab_recording";

export interface TranscriptSegment {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

export interface RecordingAttributes {
  id: string;
  sessionId: string;
  userId: string | null;
  recordingType: RecordingType;
  videoUrl: string;
  micUrl: string | null;
  aiUrl: string | null;
  transcript: TranscriptSegment[] | null;
  summary: string | null;
  durationSeconds: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RecordingCreationAttributes = Optional<
  RecordingAttributes,
  "id" | "userId" | "micUrl" | "aiUrl" | "transcript" | "summary" | "durationSeconds" | "createdAt" | "updatedAt"
>;

export class Recording
  extends Model<RecordingAttributes, RecordingCreationAttributes>
  implements RecordingAttributes
{
  declare id: string;
  declare sessionId: string;
  declare userId: string | null;
  declare recordingType: RecordingType;
  declare videoUrl: string;
  declare micUrl: string | null;
  declare aiUrl: string | null;
  declare transcript: TranscriptSegment[] | null;
  declare summary: string | null;
  declare durationSeconds: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Recording.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "session_id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "user_id",
    },
    recordingType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "recording_type",
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "video_url",
    },
    micUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "mic_url",
    },
    aiUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "ai_url",
    },
    transcript: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "duration_seconds",
    },
    createdAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "recordings",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["session_id"] },
      { fields: ["recording_type"] },
      { fields: ["created_at"] },
    ],
  }
);
