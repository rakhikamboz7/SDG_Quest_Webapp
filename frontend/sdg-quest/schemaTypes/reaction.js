export default {
  name: "reaction",
  title: "Reaction",
  type: "document",
  fields: [
    {
      name: "type",
      title: "Reaction Type",
      type: "string",
      options: {
        list: [
          { title: "Like", value: "like" },
          { title: "Helpful", value: "helpful" },
          { title: "Inspiring", value: "inspiring" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "userName",
      title: "User Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "targetType",
      title: "Target Type",
      type: "string",
      options: {
        list: [
          { title: "Problem Submission", value: "problemSubmission" },
          { title: "Solution", value: "solution" },
          { title: "Pledge", value: "pledge" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "targetId",
      title: "Target ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
}
