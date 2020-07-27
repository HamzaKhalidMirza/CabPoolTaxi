import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "home",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("./../home/home.module").then((m) => m.HomePageModule),
          },
        ],
      },
      {
        path: "rides",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../rides/rides.module").then((m) => m.RidesPageModule),
          },
        ],
      },
      {
        path: "requests",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../requests/requests.module").then(
                (m) => m.RequestsPageModule
              ),
          },
        ],
      },
      {
        path: "account",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../account/account.module").then(
                (m) => m.AccountPageModule
              ),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
