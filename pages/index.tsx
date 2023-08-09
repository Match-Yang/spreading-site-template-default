import Post from "../interfaces/post";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";

export default function Index(props) {
  const [firstKey, setFirstKey] = useState("")

  if (typeof window !== "undefined") {
    const router = useRouter();
    const { asPath } = router;
    const url = asPath === "/" ? '/api/tree' : '/api/tree?isPreview=true'

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

    fetch(url).then((response) => {
      response.json().then(({ result }) => {
        console.log('fetch fullTreeData', result);
        const firstProject = result[0]
        const firstVersion = firstProject.children[0]
        const firstLanguage = firstVersion && firstVersion.children[0]
        const firstPlatform = firstLanguage && firstLanguage.children[0]
        const firstFileKey = firstPlatform && findFirstFileKey(firstPlatform)
        console.log('firstFileKey', firstFileKey);
        if (firstFileKey) {
          setFirstKey(firstFileKey)
        }
      });
    });
  }

  useEffect(() => {
    if (firstKey) {
      Router.push("docs/" + firstKey);

    }
  }, [firstKey])

  return (
    <div />
  );
}
