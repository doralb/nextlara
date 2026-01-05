import { router } from '@/routes/web';
import { notFound } from 'next/navigation';

/**
 * Nextlara Catch-all Web Router
 * 
 * This file handles ALL web requests and resolves them using routes/web.ts.
 * You never have to create another page.tsx file again!
 */
export default async function CatchAllWebPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = slug ? '/' + slug.join('/') : '/';
  const route = router.findRoute(path, 'GET');

  if (route && typeof route.handler === 'function') {
    const Component = (await route.handler()) as any;
    const routeParams = router.extractParams(route.path, path);
    return <Component params={routeParams} />;
  }

  return notFound();
}
