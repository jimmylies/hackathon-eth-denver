import withPageTitle from './components/PageTitle';
import Earn from './pages/Earn';
import ErrorPage from './pages/ErrorPage';
import Pool from './pages/Pool';
import RemoveLiquidity from './pages/Pool/components/RemoveLiquidity';
import Swap from './pages/Swap';

export const routeNames = {
  home: '/',
  swap: '/swap',
  liquidityItem: '/pools/:poolToken0/:poolToken1',
  addliquidity: '/addliquidity',
  remove: '/remove/:token0/:token1',
  earn: '/earn',
  error: '*'
};

const routes: Array<any> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Swap
  },
  {
    path: routeNames.swap,
    title: 'Swap',
    component: Swap
  },
  {
    path: routeNames.liquidityItem,
    title: 'Pool',
    component: Pool
  },
  {
    path: routeNames.addliquidity,
    title: 'Add Liquidity',
    component: Pool
  },
  {
    path: routeNames.remove,
    title: 'Remove Liquidity',
    component: RemoveLiquidity
  },
  {
    path: routeNames.earn,
    title: 'Earn',
    component: Earn
  },
  {
    path: routeNames.error,
    title: 'Error',
    component: ErrorPage
  }
];

export const mappedRoutes = routes.map((route) => {
  const title = route.title ? `${route.title} • Dusa` : 'Dusa Protocol';

  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent
  };
});
