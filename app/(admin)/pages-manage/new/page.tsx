import EditorClient from "../../posts/editor-client";

export default function NewPage() {
    return <EditorClient initialData={{ type: "page" }} />;
}
