import { useEffect } from 'react';

const BASE_TITLE = 'AutoSphere — Independent car service centre in Mumbai';

/** Sets document.title for the lifetime of the component. */
export function useDocumentTitle(title: string | null) {
    useEffect(() => {
        document.title = title ? `${title} | AutoSphere` : BASE_TITLE;
        return () => { document.title = BASE_TITLE; };
    }, [title]);
}
