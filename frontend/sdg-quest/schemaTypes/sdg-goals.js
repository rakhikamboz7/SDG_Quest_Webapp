export default {
  name: "sdgGoal",
  title: "SDG Goal",
  type: "document",
  fields: [
    {
      name: "goalNumber",
      title: "Goal Number",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(17),
    },
    {
      name: "title",
      title: "Goal Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      description: "Brief overview for the wheel display",
    },
    {
      name: "overview",
      title: "Overview",
      type: "text",
      description: "Detailed overview of the goal",
    },
    {
      name: "description",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Comprehensive description with rich text",
    },
    {
      name: "color",
      title: "Goal Color",
      type: "string",
      description: "Hex color code for the goal",
    },
    {
      name: "icon",
      title: "Goal Icon",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "knowledgeBite",
      title: "Knowledge Bite",
      type: "text",
      description: "Interesting fact or statistic",
    },
    {
      name: "keyPoints",
      title: "Key Points",
      type: "array",
      of: [{ type: "string" }],
      description: "Main objectives of this goal",
    },
    {
      name: "videos",
      title: "Related Videos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Video Title",
              type: "string",
            },
            {
              name: "youtubeId",
              title: "YouTube Video ID",
              type: "string",
            },
            {
              name: "description",
              title: "Video Description",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      name: "resources",
      title: "Additional Resources",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Resource Title",
              type: "string",
            },
            {
              name: "url",
              title: "Resource URL",
              type: "url",
            },
            {
              name: "description",
              title: "Resource Description",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      name: "interactiveElements",
      title: "Interactive Elements",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              title: "Element Type",
              type: "string",
              options: {
                list: [
                  { title: "Quiz Question", value: "quiz" },
                  { title: "Interactive Infographic", value: "infographic" },
                  { title: "Action Challenge", value: "challenge" },
                ],
              },
            },
            {
              name: "title",
              title: "Element Title",
              type: "string",
            },
            {
              name: "content",
              title: "Element Content",
              type: "array",
              of: [{ type: "block" }],
            },
          ],
        },
      ],
    },
    {
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "title",
      goalNumber: "goalNumber",
      media: "icon",
    },
    prepare(selection) {
      const { title, goalNumber } = selection
      return {
        title: `Goal ${goalNumber}: ${title}`,
      }
    },
  },
}
