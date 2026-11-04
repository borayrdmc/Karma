import { Dashboard } from "@/components/dashboard/dashboard-elements/Dashboard";
import { auth } from "@/lib/AuthConfig";
import { fetchTrackedProducts } from "@/lib/FetchTrackedProducts";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage(){

    const session=await auth.api.getSession({
        headers:await headers(),
    });

    if(!session){
        redirect("/signin");
    }

    const initialProducts=await fetchTrackedProducts(session.user.id);

    return(
        <Dashboard
            trackedProductsList={initialProducts}
            userName={session.user.name}
        />
    );
}