export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "text",
      title: "Comment Text",
      type: "text",
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
      name: "parentType",
      title: "Parent Type",
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
      name: "parentId",
      title: "Parent ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "likes",
      title: "Likes",
      type: "number",
      initialValue: 0,
    },
    {
      name: "replies",
      title: "Replies",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Reply Text", type: "text" },
            { name: "author", title: "Author", type: "string" },
            { name: "authorId", title: "Author ID", type: "string" },
            { name: "createdAt", title: "Created At", type: "datetime" },
          ],
        },
      ],
    },
  ],
}
