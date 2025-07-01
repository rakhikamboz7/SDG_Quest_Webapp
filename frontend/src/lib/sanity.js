import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import { goalDetails, getGoalDetails, mergeGoalData } from "../goalDetail"

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "qmqcpnth",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2023-05-03",
  token: import.meta.env.VITE_SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

// Test function to verify permissions
export const testPermissions = async () => {
  try {
    const result = await client.fetch('*[_type == "sdgGoal"][0]')
    console.log("✅ Read permissions working")

    const testDoc = {
      _type: "sdgGoal",
      goalNumber: 999,
      title: "Test Goal",
      published: false,
    }
    const created = await client.create(testDoc)
    await client.delete(created._id)
    console.log("✅ Write permissions working")
    return result
  } catch (error) {
    console.error("❌ Permission test failed:", error)
    throw error
  }
}

// Enhanced function to upload images with better error handling
export const uploadImage = async (file, filename) => {
  try {
    console.log("Uploading image:", filename)
    const asset = await client.assets.upload("image", file, {
      filename: filename || file.name,
    })
    console.log("Image uploaded successfully:", asset)
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

// Upload video files
export const uploadVideo = async (file, filename) => {
  try {
    console.log("Uploading video:", filename)
    const asset = await client.assets.upload("file", file, {
      filename: filename || file.name,
    })
    console.log("Video uploaded successfully:", asset)
    return {
      _type: "file",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error("Error uploading video:", error)
    throw new Error(`Video upload failed: ${error.message}`)
  }
}

// SDG Goals functions (existing)
export const getSDGGoals = async () => {
  try {
    const sanityGoals = await client.fetch(`
      *[_type == "sdgGoal"] | order(goalNumber asc) {
        _id,
        goalNumber,
        title,
        shortDescription,
        overview,
        description,
        color,
        "heroImage": heroImage.asset->url,
        "icon": icon.asset->url,
        knowledgeBite,
        keyPoints,
        videos,
        resources,
        published
      }
    `)

    const mergedGoals = []
    for (let i = 1; i <= 17; i++) {
      const sanityGoal = sanityGoals.find((g) => g.goalNumber === i)
      const staticGoal = getGoalDetails(i)
      const mergedGoal = sanityGoal ? mergeGoalData(sanityGoal, staticGoal) : staticGoal
      if (mergedGoal) {
        mergedGoals.push(mergedGoal)
      }
    }
    return mergedGoals
  } catch (error) {
    console.error("Error fetching from Sanity, using static data:", error)
    return Object.values(goalDetails)
  }
}

export const getSDGGoal = async (goalNumber) => {
  try {
    const sanityGoal = await client.fetch(
      `
      *[_type == "sdgGoal" && goalNumber == $goalNumber][0] {
        _id,
        goalNumber,
        title,
        shortDescription,
        overview,
        description,
        color,
        "heroImage": heroImage.asset->url,
        "icon": icon.asset->url,
        knowledgeBite,
        keyPoints,
        videos,
        resources,
        interactiveElements,
        published
      }
    `,
      { goalNumber },
    )

    const staticGoal = getGoalDetails(goalNumber)
    return sanityGoal ? mergeGoalData(sanityGoal, staticGoal) : staticGoal
  } catch (error) {
    console.error("Error fetching goal from Sanity, using static data:", error)
    return getGoalDetails(goalNumber)
  }
}

// Problem Submission functions
export const fetchProblemSubmissions = async (status = null) => {
  try {
    let query = `
      *[_type == "problemSubmission"
    `

    if (status) {
      query += ` && status == "${status}"`
    }

    query += `] | order(_createdAt desc) {
        _id,
        title,
        description,
        goalId,
        author,
        authorEmail,
        authorId,
        status,
        "solutions": solutions[]-> {
          _id,
          title,
          description,
          author,
          authorId,
          status,
          votes,
          _createdAt
        },
        "mediaFiles": mediaFiles[] {
          asset-> {
            url,
            mimeType
          }
        },
        hasMedia,
        tags,
        location,
        urgency,
        _createdAt,
        _updatedAt
      }
    `

    const submissions = await client.fetch(query)
    return submissions.map((submission) => ({
      id: submission._id,
      title: submission.title,
      description: submission.description,
      goalId: submission.goalId,
      author: submission.author,
      authorEmail: submission.authorEmail,
      authorId: submission.authorId,
      status: submission.status,
      solutions: submission.solutions || [],
      mediaFiles: submission.mediaFiles || [],
      hasMedia: submission.hasMedia || false,
      tags: submission.tags || [],
      location: submission.location,
      urgency: submission.urgency,
      createdAt: submission._createdAt,
      updatedAt: submission._updatedAt,
    }))
  } catch (error) {
    console.error("Error fetching problem submissions:", error)
    throw error
  }
}

export const createProblemSubmission = async (data) => {
  try {
    // Upload media files if provided
    const uploadedMedia = []
    if (data.mediaFiles && data.mediaFiles.length > 0) {
      for (const file of data.mediaFiles) {
        if (file.type.startsWith("image/")) {
          const uploadedImage = await uploadImage(file, file.name)
          uploadedMedia.push(uploadedImage)
        } else if (file.type.startsWith("video/")) {
          const uploadedVideo = await uploadVideo(file, file.name)
          uploadedMedia.push(uploadedVideo)
        }
      }
    }

    const doc = {
      _type: "problemSubmission",
      title: data.title,
      description: data.description,
      goalId: Number.parseInt(data.goalId),
      author: data.author,
      authorEmail: data.authorEmail,
      authorId: data.authorId,
      status: data.status || "pending",
      mediaFiles: uploadedMedia,
      hasMedia: uploadedMedia.length > 0,
      tags: data.tags || [],
      location: data.location || "",
      urgency: data.urgency || "medium",
    }

    const result = await client.create(doc)

    // If there's an initial solution, create it
    if (data.solution && data.solution.trim()) {
      await createSolution({
        title: `Solution for: ${data.title}`,
        description: data.solution,
        problemId: result._id,
        author: data.author,
        authorId: data.authorId,
        authorEmail: data.authorEmail,
        status: "approved", // Auto-approve solutions from problem creators
      })
    }

    return result
  } catch (error) {
    console.error("Error creating problem submission:", error)
    throw error
  }
}

export const updateSubmissionStatus = async (submissionId, status) => {
  try {
    // Ensure submissionId is a string and properly formatted
    const docId = submissionId.toString()

    const result = await client
      .patch(docId)
      .set({
        status: status,
        _updatedAt: new Date().toISOString(),
      })
      .commit()

    console.log("Successfully updated submission status:", result)
    return result
  } catch (error) {
    console.error("Error updating submission status:", error)
    throw new Error(`Failed to update submission status: ${error.message}`)
  }
}

export const fetchUserSubmissions = async (userId) => {
  try {
    const query = `
      *[_type == "problemSubmission" && authorId == $userId] | order(_createdAt desc) {
        _id,
        title,
        description,
        goalId,
        status,
        "solutions": solutions[]-> {
          _id,
          title,
          description,
          author,
          status
        },
        _createdAt
      }
    `

    const submissions = await client.fetch(query, { userId })
    return submissions.map((submission) => ({
      id: submission._id,
      title: submission.title,
      description: submission.description,
      goalId: submission.goalId,
      status: submission.status,
      solutions: submission.solutions || [],
      createdAt: submission._createdAt,
    }))
  } catch (error) {
    console.error("Error fetching user submissions:", error)
    throw error
  }
}

// Solution functions
export const createSolution = async (data) => {
  try {
    // Upload media files if provided
    const uploadedMedia = []
    if (data.mediaFiles && data.mediaFiles.length > 0) {
      for (const file of data.mediaFiles) {
        if (file.type.startsWith("image/")) {
          const uploadedImage = await uploadImage(file, file.name)
          uploadedMedia.push(uploadedImage)
        } else if (file.type.startsWith("video/")) {
          const uploadedVideo = await uploadVideo(file, file.name)
          uploadedMedia.push(uploadedVideo)
        }
      }
    }

    const doc = {
      _type: "solution",
      title: data.title,
      description: data.description,
      problemId: {
        _type: "reference",
        _ref: data.problemId,
      },
      author: data.author,
      authorId: data.authorId,
      authorEmail: data.authorEmail,
      status: data.status || "pending",
      implementationSteps: data.implementationSteps || [],
      requiredResources: data.requiredResources || [],
      estimatedCost: data.estimatedCost || "",
      timeframe: data.timeframe || "",
      impact: data.impact || "",
      mediaFiles: uploadedMedia,
      votes: 0,
      featured: false,
    }

    const result = await client.create(doc)

    // Add solution reference to the problem
    await client
      .patch(data.problemId)
      .setIfMissing({ solutions: [] })
      .append("solutions", [{ _type: "reference", _ref: result._id }])
      .commit()

    return result
  } catch (error) {
    console.error("Error creating solution:", error)
    throw error
  }
}

export const fetchSolutionsForProblem = async (problemId) => {
  try {
    const query = `
      *[_type == "solution" && problemId._ref == $problemId && status == "approved"] | order(_createdAt desc) {
        _id,
        title,
        description,
        author,
        authorId,
        implementationSteps,
        requiredResources,
        estimatedCost,
        timeframe,
        impact,
        votes,
        featured,
        _createdAt
      }
    `

    return await client.fetch(query, { problemId })
  } catch (error) {
    console.error("Error fetching solutions:", error)
    throw error
  }
}

export const voteSolution = async (solutionId) => {
  try {
    const solution = await client.fetch(`*[_type == "solution" && _id == $solutionId][0]`, { solutionId })
    if (!solution) throw new Error("Solution not found")

    return await client
      .patch(solutionId)
      .set({ votes: (solution.votes || 0) + 1 })
      .commit()
  } catch (error) {
    console.error("Error voting for solution:", error)
    throw error
  }
}

// Helper function to get image URL with transformations
export const getImageUrl = (image, options = {}) => {
  if (!image) return null

  let builder = urlFor(image)
  if (options.width) builder = builder.width(options.width)
  if (options.height) builder = builder.height(options.height)
  if (options.quality) builder = builder.quality(options.quality)
  if (options.format) builder = builder.format(options.format)

  return builder.url()
}

// Helper function to render rich text blocks
export const renderRichText = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return null

  return blocks
    .map((block, index) => {
      if (block._type === "block") {
        return block.children?.map((child, childIndex) => child.text).join("") || ""
      }
      return ""
    })
    .join(" ")
}

// Pledge functions
export const createPledge = async (data) => {
  try {
    const doc = {
      _type: "pledge",
      title: data.title,
      description: data.description,
      goalType: data.goalType,
      author: data.author,
      authorId: data.authorId,
      authorEmail: data.authorEmail,
      isPublic: data.isPublic || true,
      startDate: data.startDate,
      endDate: data.endDate,
      frequency: data.frequency,
      targetValue: data.targetValue,
      currentProgress: 0,
      status: "active",
      motivation: data.motivation,
      relatedSDG: data.relatedSDG,
      progressLog: [],
      likes: 0,
      comments: [],
    }

    return await client.create(doc)
  } catch (error) {
    console.error("Error creating pledge:", error)
    throw error
  }
}

export const fetchUserPledges = async (userId) => {
  try {
    const query = `
      *[_type == "pledge" && authorId == $userId] | order(_createdAt desc) {
        _id,
        title,
        description,
        goalType,
        author,
        isPublic,
        startDate,
        endDate,
        frequency,
        targetValue,
        currentProgress,
        status,
        motivation,
        relatedSDG,
        progressLog,
        likes,
        _createdAt
      }
    `

    return await client.fetch(query, { userId })
  } catch (error) {
    console.error("Error fetching user pledges:", error)
    throw error
  }
}

export const fetchPublicPledges = async () => {
  try {
    const query = `
      *[_type == "pledge" && isPublic == true] | order(_createdAt desc) {
        _id,
        title,
        description,
        goalType,
        author,
        startDate,
        endDate,
        frequency,
        targetValue,
        currentProgress,
        status,
        motivation,
        relatedSDG,
        likes,
        _createdAt
      }
    `

    return await client.fetch(query)
  } catch (error) {
    console.error("Error fetching public pledges:", error)
    throw error
  }
}

export const updatePledgeProgress = async (pledgeId, progressData) => {
  try {
    const pledge = await client.fetch(`*[_type == "pledge" && _id == $pledgeId][0]`, { pledgeId })
    if (!pledge) throw new Error("Pledge not found")

    const newProgress = pledge.currentProgress + 1
    const newProgressLog = [
      ...(pledge.progressLog || []),
      {
        date: new Date().toISOString().split("T")[0],
        completed: true,
        note: progressData.note || "",
      },
    ]

    const isCompleted = newProgress >= pledge.targetValue
    const newStatus = isCompleted ? "completed" : pledge.status

    return await client
      .patch(pledgeId)
      .set({
        currentProgress: newProgress,
        progressLog: newProgressLog,
        status: newStatus,
      })
      .commit()
  } catch (error) {
    console.error("Error updating pledge progress:", error)
    throw error
  }
}

// Comment functions
export const createComment = async (data) => {
  try {
    const doc = {
      _type: "comment",
      text: data.text,
      author: data.author,
      authorId: data.authorId,
      authorEmail: data.authorEmail,
      parentType: data.parentType,
      parentId: data.parentId,
      likes: 0,
      replies: [],
    }

    return await client.create(doc)
  } catch (error) {
    console.error("Error creating comment:", error)
    throw error
  }
}

export const fetchComments = async (parentType, parentId) => {
  try {
    const query = `
      *[_type == "comment" && parentType == $parentType && parentId == $parentId] | order(_createdAt desc) {
        _id,
        text,
        author,
        authorId,
        likes,
        replies,
        _createdAt
      }
    `

    return await client.fetch(query, { parentType, parentId })
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw error
  }
}

// Reaction functions
export const createReaction = async (data) => {
  try {
    // Check if user already reacted
    const existingReaction = await client.fetch(
      `*[_type == "reaction" && userId == $userId && targetType == $targetType && targetId == $targetId && type == $type][0]`,
      {
        userId: data.userId,
        targetType: data.targetType,
        targetId: data.targetId,
        type: data.type,
      },
    )

    if (existingReaction) {
      // Remove existing reaction
      await client.delete(existingReaction._id)
      return { action: "removed" }
    } else {
      // Create new reaction
      const doc = {
        _type: "reaction",
        type: data.type,
        userId: data.userId,
        userName: data.userName,
        targetType: data.targetType,
        targetId: data.targetId,
      }

      await client.create(doc)
      return { action: "added" }
    }
  } catch (error) {
    console.error("Error creating reaction:", error)
    throw error
  }
}

export const fetchReactions = async (targetType, targetId) => {
  try {
    const query = `
      *[_type == "reaction" && targetType == $targetType && targetId == $targetId] {
        _id,
        type,
        userId,
        userName,
        _createdAt
      }
    `

    return await client.fetch(query, { targetType, targetId })
  } catch (error) {
    console.error("Error fetching reactions:", error)
    throw error
  }
}

export const getReactionCounts = async (targetType, targetId) => {
  try {
    const reactions = await fetchReactions(targetType, targetId)
    const counts = {}

    reactions.forEach((reaction) => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1
    })

    return counts
  } catch (error) {
    console.error("Error getting reaction counts:", error)
    return {}
  }
}

// Delete functions (for admin)
export const deleteProblemSubmission = async (submissionId) => {
  try {
    // First, delete all associated solutions
    const solutions = await client.fetch(`*[_type == "solution" && problemId._ref == $submissionId]`, { submissionId })
    for (const solution of solutions) {
      await client.delete(solution._id)
    }

    // Then delete the problem submission
    return await client.delete(submissionId)
  } catch (error) {
    console.error("Error deleting problem submission:", error)
    throw error
  }
}

export const deleteSolution = async (solutionId) => {
  try {
    const solution = await client.fetch(`*[_type == "solution" && _id == $solutionId][0]`, { solutionId })
    if (!solution) throw new Error("Solution not found")

    // Remove solution reference from problem
    await client
      .patch(solution.problemId._ref)
      .unset([`solutions[_ref == "${solutionId}"]`])
      .commit()

    // Delete the solution
    return await client.delete(solutionId)
  } catch (error) {
    console.error("Error deleting solution:", error)
    throw error
  }
}

export const fetchSingleSubmission = async (submissionId) => {
  try {
    const query = `
      *[_type == "problemSubmission" && _id == $submissionId][0] {
        _id,
        title,
        description,
        goalId,
        author,
        authorEmail,
        authorId,
        status,
        "solutions": solutions[]-> {
          _id,
          title,
          description,
          author,
          authorId,
          status,
          votes,
          _createdAt
        },
        "mediaFiles": mediaFiles[] {
          asset-> {
            url,
            mimeType
          }
        },
        hasMedia,
        tags,
        location,
        urgency,
        _createdAt,
        _updatedAt
      }
    `

    return await client.fetch(query, { submissionId })
  } catch (error) {
    console.error("Error fetching single submission:", error)
    throw error
  }
}
