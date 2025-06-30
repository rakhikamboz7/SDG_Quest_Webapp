export default {
  name: "problemSubmission",
  title: "Problem Submission",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Problem Title",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(200),
    },
    {
      name: "description",
      title: "Problem Description",
      type: "text",
      validation: (Rule) => Rule.required().min(50).max(1000),
    },
    {
      name: "goalId",
      title: "SDG Goal ID",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(17),
    },
    {
      name: "author",
      title: "Author Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "authorEmail",
      title: "Author Email",
      type: "email",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "authorId",
      title: "Author ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "solutions",
      title: "Solutions",
      type: "array",
      of: [{ type: "reference", to: [{ type: "solution" }] }],
    },
    {
      name: "mediaFiles",
      title: "Media Files",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
          type: "file",
          options: {
            accept: "video/*",
          },
        },
      ],
    },
    {
      name: "hasMedia",
      title: "Has Media",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
    {
      name: "location",
      title: "Location",
      type: "string",
    },
    {
      name: "urgency",
      title: "Urgency Level",
      type: "string",
      options: {
        list: [
          { title: "Low", value: "low" },
          { title: "Medium", value: "medium" },
          { title: "High", value: "high" },
          { title: "Critical", value: "critical" },
        ],
      },
      initialValue: "medium",
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author",
      media: "mediaFiles.0",
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title,
        subtitle: `by ${subtitle}`,
      }
    },
  },
  orderings: [
    {
      title: "Created Date, New",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
}
