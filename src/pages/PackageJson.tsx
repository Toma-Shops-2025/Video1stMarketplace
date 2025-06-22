import PackageJsonViewer from "@/components/PackageJsonViewer";
import { AppLayout } from "@/components/AppLayout";

const PackageJson = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20">
          <PackageJsonViewer />
        </div>
      </div>
    </AppLayout>
  );
};

export default PackageJson;