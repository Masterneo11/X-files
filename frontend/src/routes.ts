import Login from "./Pages/Login"
import Create from "./Pages/CreateAccount"

interface AppRoutes {
    name: string;
    path: string;
    component: React.FC;
}

const routes: AppRoutes[] = [
    {
        name: "Login",
        path: "/Login",
        component: Login
    },
    {
        name: "account",
        path: "/createaccount",
        component: Create
    }
]
