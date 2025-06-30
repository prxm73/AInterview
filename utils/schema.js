const { pgTable, serial, text, varchar } = require("drizzle-orm/pg-core")

export const MockInterview=pgTable("mockInterview",{
    id:serial('id').primaryKey(),
    jsonMockResp:text('jsonMockResp').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    jobExp:varchar('jobExp').notNull(),
    createdAt:varchar('createdAt'),
    createdBy:varchar('createdBy').notNull(),
    mockId:varchar('mockId').notNull()
})
export const Usertable = pgTable("userTable", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockIdRef").notNull(),
  questionIndex: varchar("questionIndex").notNull(),
  question: varchar("question").notNull(),
  correctAns: text("correctAns"),
  userAns: text("userAns"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  userEmail: text("userEmail"),
  createdAt: varchar("createdAt"),
});

