import { getCollection } from 'astro:content';

export async function getElementsBySameTags(collectionName, parentElement, count = 4) {
  const posts = await getCollection(collectionName, ({ data }) => {
    if (data.title === parentElement.data.title) return false;
    return data.tags.some(tag => parentElement.data.tags.includes(tag));
  });
  return posts.slice(0, count);
}