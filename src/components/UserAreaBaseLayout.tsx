import { signOut } from "next-auth/react";
import { ReactElement } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Button from "./Button";
import Card from "./Card";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <>
      <main className="h-screen w-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] py-8 px-4">
        <Card>
          <div className="mb-2 flex w-full flex-wrap-reverse justify-between gap-y-1">
            <Breadcrumbs />
            <Button size="small" onClick={() => void signOut()}>
              Logout
            </Button>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </Card>
      </main>
    </>
  );
}

export function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}
