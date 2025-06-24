import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import { goalDetails, getGoalDetails, mergeGoalData } from "../goalDetail"

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "qmqcpnth",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: false, // IMPORTANT: Set to false for mutations
  apiVersion: "2023-05-03", // Fixed API version (not 2025)
  token: import.meta.env.SANITY_API_TOKEN, // Your new editor token
  ignoreBrowserTokenWarning: true, // Only for development
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)

// Test function to verify permissions
export const testPermissions = async () => {
  try {
    const result = await client.fetch('*[_type == "sdgGoal"][0]')
    console.log("✅ Read permissions working")
    return result
  } catch (error) {
    console.error("❌ Permission test failed:", error)
    throw error
  }
}

// Enhanced function to upload images
export const uploadImage = async (file, filename) => {
  try {
    const asset = await client.assets.upload("image", file, {
      filename: filename || file.name,
    })
    return asset
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export const getSDGGoals = async () => {
  try {
    const sanityGoals = await client.fetch(`
      *[_type == "sdgGoal"] | order(goalNumber asc) {
        _id,
        goalNumber,
        title,
        shortDescription,
        overview,
        color,
        heroImage,
        knowledgeBite,
        keyPoints,
        videos,
        resources,
        published
      }
    `)

    // Merge with static data and ensure all 17 goals are present
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
    // Return static data as fallback
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
        heroImage,
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
