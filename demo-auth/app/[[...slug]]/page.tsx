import { router } from '@/routes/web';
import { notFound } from 'next/navigation';

/**
 * Nextlara Catch-all Web Router
 * 
 * This file handles ALL web requests and resolves them using routes/web.ts.
 * You never have to create another page.tsx file again!
 */
export default async function CatchAllWebPage({ params }: { params: { slug?: string[] } }) {
  const path = params.slug ? '/' + params.slug.join('/') : '/';
  const route = router.findRoute(path, 'GET');

  if (route && typeof route.handler === 'function') {
    const Component = await route.handler();
    const routeParams = router.extractParams(route.path, path);
    return <Component params={routeParams} />;
  }

  return notFound();
}
