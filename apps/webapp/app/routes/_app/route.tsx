import { ShouldRevalidateFunction, useLocation } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ImpersonationBanner } from "~/components/ImpersonationBanner";
import { NoMobileOverlay } from "~/components/NoMobileOverlay";
import { AppContainer } from "~/components/layout/AppLayout";
import { NavBar } from "~/components/navigation/NavBar";
import { useIsProjectChildPage } from "~/hooks/useIsProjectChildPage";
import { getOrganizations } from "~/models/organization.server";

import { getImpersonationId } from "~/services/impersonation.server";
import { clearRedirectTo, commitSession } from "~/services/redirectTo.server";
import { requireUserId } from "~/services/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const organizations = await getOrganizations({ userId });
  const impersonationId = await getImpersonationId(request);

  return typedjson(
    {
      organizations,
      impersonationId,
    },
    {
      headers: [
        ["Set-Cookie", await commitSession(await clearRedirectTo(request))],
      ],
    }
  );
};

export const shouldRevalidate: ShouldRevalidateFunction = (options) => {
  //added an org
  if (options.formAction === "/orgs/new") return true;

  //added a project
  if (
    options.formAction &&
    /^\/orgs\/[^\/]+\/projects\/new$/i.test(options.formAction)
  ) {
    return true;
  }

  //left a team
  if (
    options.formAction &&
    /^\/orgs\/[^\/]+\/team$/i.test(options.formAction)
  ) {
    return true;
  }

  return false;
};

export default function App() {
  const { impersonationId } = useTypedLoaderData<typeof loader>();
  const isProjectChildPage = useIsProjectChildPage();

  const showBackgroundGradient = !isProjectChildPage;

  return (
    <>
      {impersonationId && (
        <ImpersonationBanner impersonationId={impersonationId} />
      )}
      <NoMobileOverlay />
      <AppContainer showBackgroundGradient={showBackgroundGradient}>
        <NavBar />
        <Outlet />
      </AppContainer>
    </>
  );
}
