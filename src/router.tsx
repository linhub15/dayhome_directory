import * as PostHog from "@/lib/analytics/posthog_provider";
import * as TanstackQuery from "@/lib/tanstack_query/tanstack_query_provider";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const reactQueryContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: { ...reactQueryContext },
    defaultPreload: "intent",
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <PostHog.Provider>
          <TanstackQuery.Provider {...reactQueryContext}>
            {props.children}
          </TanstackQuery.Provider>
        </PostHog.Provider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: reactQueryContext.queryClient,
  });

  return router;
};
