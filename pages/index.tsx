import Post from "../interfaces/post";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";

export default function Index(props) {
  if (typeof window !== "undefined") {
    const router = useRouter();
    const { query } = router;
    const { isPreview } = query;
    if (isPreview !== undefined) {
      const url = isPreview ? '/api/tree?isPreview=true' : '/api/tree'

      console.log('router: ', router)
      fetch(url).then((response) => {
        response.json().then(({ result }) => {
          console.log('fetch fullTreeData>>', result);
          const firstProject = result[0]
          const firstVersion = firstProject.children[0]
          const firstLanguage = firstVersion && firstVersion.children[0]
          const firstPlatform = firstLanguage && firstLanguage.children[0]
          const firstFileKey = firstPlatform && findFirstFileKey(firstPlatform)
          console.log('firstFileKey', firstFileKey);
          if (firstFileKey) {
            Router.push("docs/" + firstFileKey);
          }
        });
      });
    }
  }

  const findFirstFileKey = (node) => {
    if (node && node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (child.type === "file") {
          return child.key
        } else if (child.type === "folder") {
          const firstFileKey = findFirstFileKey(child)
          if (firstFileKey) {
            return firstFileKey
          }
        }
      }

    }
    return undefined;
  }

  return (
    <div />
  );
}
