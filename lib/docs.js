import { bundleMDX } from "mdx-bundler";
import { getMdxContent, getProjectNames, getStructure, getVersions } from "./docs-helper"

const PREVIEW_KEY = "preview"

// e.g. https://diggingking123.spreading.io/docs/123/main/en_us/android/Untitled/FAQ/9047c002/preview
function traverseChildren(children, preSlug, projectID, version, isPreview) {
  const result = []
  for (const item of children) {
    // file can have children too
    if (item.children) {
      result.push(...traverseChildren(item.children, preSlug.concat(item.name), projectID, version, isPreview))
    } 
    if (item.type == "file") {
      // 如果是preview，那么preview_hash和publish_hash任意一个值应该有效，否则证明是一个新创建且没有预览也没有发布过的文件
      if (isPreview && !item.attributes.preview_hash && !item.attributes.publish_hash) continue
      // 如果不是preview，那么publish_hash必须为有效值才表示这个文件是需要发布的
      if (!isPreview && !item.attributes.publish_hash) continue

      const itemSlug = item.uri.replace(/\.mdx$/, '').split('/')
      itemSlug.shift()
      const fileID = itemSlug.pop()
      const previewSlug = isPreview? [PREVIEW_KEY] : []
      const slug = [...preSlug, ...itemSlug, item.name, fileID, ...previewSlug]//preSlug.concat(itemSlug)
      result.push({
        params: {
          slug,
          projectID,
          version
        }
      })
    }
  }
  return result
}

async function getSlugs(project, isPreview) {
  let slugs = []

  let versions = []
  try {
    versions = await getVersions(project, isPreview)
  } catch (error) {
    console.log(`[Spreading][getSlugs][${project}][${isPreview}] getSlugs failed while getting versions: ${error}`)
  }
  for (const version of versions) {
    const structure = await getStructure(project, version, isPreview)
    const projectName = structure.name
    const folderGroups = structure.folder_group
    const topLevelFolders = structure.folders
    for (const fg of folderGroups) {
      const groupKey = fg.key
      const groupFolderIDs = fg.values
      const groupFolders = []
      for (const topLevelFolder of topLevelFolders) {
        if (groupFolderIDs.includes(topLevelFolder.id)) {
          groupFolders.push(topLevelFolder)
        }
      }
      // 开始将分组下的uri进行组合
      const languageSlug = folderGroups.length > 1 ? [groupKey.toLowerCase()] : []
      for (const topLevelFolder of groupFolders) {
        const platformSlug = groupFolders.length > 1 ? [topLevelFolder.name] : []
        slugs = slugs.concat(traverseChildren(topLevelFolder.children, [projectName, version, ...languageSlug, ...platformSlug], structure.id, version, isPreview))
      }
    }
  }

  return slugs
}
export async function getAllSlugs() {
  var slugs = []

  const projects = await getProjectNames()
  for (const project of projects) {
    const publicSlugs = await getSlugs(project, false)
    const previewSlugs = await getSlugs(project, true)
    slugs = slugs.concat(publicSlugs)
    slugs = slugs.concat(previewSlugs)
  }

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>> slugs: ", JSON.stringify(slugs))
  return slugs
}

export async function readDoc(slug) {
  // console.log('[Spreading] readDoc begin:', slug)
  const projectName = slug[0]
  const isPreview = slug[slug.length - 1] === PREVIEW_KEY
  const version = slug[1]
  const mdxFileName = isPreview ? slug[slug.length - 2] : slug[slug.length - 1]
  const mdxContent = await getMdxContent(projectName, version, mdxFileName, isPreview)
  const { code, frontmatter } = await bundleMDX({
    source: mdxContent,
  });

  // console.log('[Spreading] readDoc end:', slug)

  return {
    slug,
    frontmatter,
    code,
  };
}