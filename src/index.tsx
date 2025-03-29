import "./index.css";
import "@fontsource/inter";
import "@fontsource-variable/roboto-mono";

import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { Header } from "./components/Header";
import { NotFound } from "./pages/_404";

import { Home } from "./pages/Home";
import { Nodes } from "./pages/Nodes";
import { NodesEdit } from "./pages/NodesEdit";

export function App() {
    return (
        <LocationProvider>
            <Header />
            <main class="w-full h-full p-8">
                <Router>
                    <Route path="/" component={Home} />
                    <Route path="/nodes" component={Nodes} />
                    <Route path="/nodes/:id" component={NodesEdit} />
                    <Route default component={NotFound} />
                </Router>
            </main>
        </LocationProvider>
    );
}

render(<App />, document.getElementById("app")!);
