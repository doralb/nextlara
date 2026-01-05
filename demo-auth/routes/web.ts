import { router, view } from '@/lib/nextlara/Router';
import Welcome from '@/resources/views/welcome';

/**
 * Web Routes
 * 
 * Define your web page routes here
 */

router.get('/', () => view(Welcome));

export { router };
