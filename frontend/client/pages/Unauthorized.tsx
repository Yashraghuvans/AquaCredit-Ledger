import Layout from "@/components/Layout";

export default function Unauthorized() {
  return (
    <Layout>
      <div className="max-w-xl">
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          You do not have permission to view this page. Switch to a user with the appropriate role from the header.
        </p>
      </div>
    </Layout>
  );
}
