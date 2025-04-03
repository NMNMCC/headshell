import "./index.css";
import "@fontsource/inter";
import "@fontsource-variable/roboto-mono";

import { render } from "preact";
import { LocationProvider, Route, Router } from "preact-iso";
import { CssVarsProvider } from "@mui/joy/styles/CssVarsProvider";

import { Header } from "./components/base/Header";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Main as NodeMain } from "./pages/nodes/Main";
import { Register as NodeRegister } from "./pages/nodes/Register";
import { Detail as NodeDetail } from "./pages/nodes/Detail";
import { Main as UserMain } from "./pages/users/Main";
import { Create as UserCreate } from "./pages/users/Create";
import { Detail as UserDetail } from "./pages/users/Detail";
import { Fallback } from "./pages/Fallback";

export function App() {
    return (
        <LocationProvider>
            <CssVarsProvider>
                <Header />
                <div class="flex h-full w-full flex-col items-center justify-center p-8">
                    <Router>
                        <Route path="/" component={Home} />
                        <Route path="/auth" component={Auth} />
                        <Route path="/nodes" component={NodeMain} />
                        <Route path="/nodes/register" component={NodeRegister} />
                        <Route path="/nodes/:id" component={NodeDetail} />
                        <Route path="/users" component={UserMain} />
                        <Route path="/users/create" component={UserCreate} />
                        <Route path="/users/:id" component={UserDetail} />

                        <Route default component={Fallback} />
                    </Router>
                </div>
            </CssVarsProvider>
        </LocationProvider>
    );
}

render(<App />, document.getElementById("app")!);
