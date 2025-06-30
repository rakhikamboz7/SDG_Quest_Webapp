export default {
  name: "solution",
  title: "Solution",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Solution Title",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(200),
    },
    {
      name: "description",
      title: "Solution Description",
      type: "text",
      validation: (Rule) => Rule.required().min(20).max(1000),
    },
    {
      name: "problemId",
      title: "Related Problem",
      type: "reference",
      to: [{ type: "problemSubmission" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "author",
      title: "Solution Author",
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
      type: "email",
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
    },
    {
      name: "implementationSteps",
      title: "Implementation Steps",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "requiredResources",
      title: "Required Resources",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "estimatedCost",
      title: "Estimated Cost",
      type: "string",
    },
    {
      name: "timeframe",
      title: "Implementation Timeframe",
      type: "string",
    },
    {
      name: "impact",
      title: "Expected Impact",
      type: "text",
    },
    {
      name: "mediaFiles",
      title: "Supporting Media",
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
        },
      ],
    },
    {
      name: "votes",
      title: "Votes",
      type: "number",
      initialValue: 0,
    },
    {
      name: "featured",
      title: "Featured Solution",
      type: "boolean",
      initialValue: false,
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
}
