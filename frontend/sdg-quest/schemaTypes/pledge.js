export default {
  name: "pledge",
  title: "Pledge",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "goalType",
      title: "Goal Type",
      type: "string",
      options: {
        list: [
          { title: "Plastic Reduction", value: "plastic" },
          { title: "Energy Conservation", value: "energy" },
          { title: "Water Conservation", value: "water" },
          { title: "Sustainable Transport", value: "transport" },
          { title: "Food Waste Reduction", value: "food" },
          { title: "Waste Management", value: "waste" },
          { title: "Green Living", value: "green" },
          { title: "Community Action", value: "community" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "author",
      title: "Author",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "authorId",
      title: "Author ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "authorEmail",
      title: "Author Email",
      type: "string",
    },
    {
      name: "isPublic",
      title: "Is Public",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "endDate",
      title: "End Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "frequency",
      title: "Frequency",
      type: "string",
      options: {
        list: [
          { title: "Daily", value: "daily" },
          { title: "Weekly", value: "weekly" },
          { title: "Monthly", value: "monthly" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "targetValue",
      title: "Target Value",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "currentProgress",
      title: "Current Progress",
      type: "number",
      initialValue: 0,
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
          { title: "Paused", value: "paused" },
        ],
      },
      initialValue: "active",
    },
    {
      name: "motivation",
      title: "Motivation",
      type: "text",
    },
    {
      name: "relatedSDG",
      title: "Related SDG",
      type: "number",
      validation: (Rule) => Rule.min(1).max(17),
    },
    {
      name: "progressLog",
      title: "Progress Log",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "date", title: "Date", type: "date" },
            { name: "completed", title: "Completed", type: "boolean" },
            { name: "note", title: "Note", type: "string" },
          ],
        },
      ],
    },
    {
      name: "likes",
      title: "Likes",
      type: "number",
      initialValue: 0,
    },
  ],
}
