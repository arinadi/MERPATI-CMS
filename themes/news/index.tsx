import { ThemeExports } from "@/lib/themes";
import ThemeLayout from "./components/layout";
import Archive from "./components/archive";
import SinglePost from "./components/single-post";
import SinglePage from "./components/single-page";
import NotFound from "./components/not-found";
import Home from "./components/home";
import { options } from "./options";
import "./theme.css";

export { ThemeLayout, Archive, SinglePost, SinglePage, NotFound, Home, options };

export const newsTheme: ThemeExports = {
    ThemeLayout,
    Archive,
    SinglePost,
    SinglePage,
    NotFound,
    Home,
    options
};
