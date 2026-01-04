import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { BuildingIcon, ShieldUser } from "lucide-react";
import Link from "next/link";

const CustomUserButton = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
        },
      }}
    >
      <UserButton.UserProfilePage
        label="Organizations"
        labelIcon={<BuildingIcon className="size-4" />}
        url="/organizations"
      >
        <div className="p-4">
          <h2>Manage Organization</h2>
          <OrganizationSwitcher
            hidePersonal={true}
            afterCreateOrganizationUrl={"/submit"}
            afterSelectPersonalUrl={"/submit"}
            appearance={{
              elements: {
                rootBox: "w-full",
              },
            }}
          />
        </div>
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage
        label="Admin"
        labelIcon={<ShieldUser className="size-4" />}
        url="/admin"
      >
        <div className="p-4">
          <h2 className="text-2xl tracking-tight font-normal">Admin Panel</h2>
          <Link
            href={"/admin"}
            className="bg-zinc-900 py-3 px-2 rounded-lg w-full text-white"
          >
            <button className="w-full text-start py-4 tracking-tight text-sm">
              Go to Admin Panel
            </button>
          </Link>
        </div>
      </UserButton.UserProfilePage>
    </UserButton>
  );
};

export default CustomUserButton;
