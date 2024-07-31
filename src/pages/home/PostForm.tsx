import { FormEvent, useEffect, useRef, useState } from "react";
import { useErrorList } from "../../components/ErrorList";

export interface PostFormProps {
    toggleText: string
    placeholder?: string
    onPublish: (contents: string) => Promise<void>
}

export default function PostForm ({ toggleText, placeholder = '', onPublish }: PostFormProps) {
    const [postFormVisible, setPostFormVisible] = useState(false);
    const [newPostContents, setNewPostContents] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    const [inFlight, setInFlight] = useState(false);
    const { setErrors, ErrorList } = useErrorList();

    useEffect(function () {
        inputRef.current?.focus();
    }, [postFormVisible]);

    function handlePublishClick (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        setInFlight(true);

        onPublish(newPostContents).then(() => {
            setPostFormVisible(false);
            setNewPostContents('');
        }, (err) => {
            if (
                Array.isArray(err?.response?.data)
            ) {
                setErrors(err.response.data);
            } else if (err instanceof Error) {
                setErrors([err.message]);
            }
        }).finally(() => {
            setInFlight(false);
        });
    }

    return (
        <>
            <button
                className="underline text-blue-400 block m-auto"
                type="button"
                onClick={() =>  setPostFormVisible(value => !value)}
            >
                {postFormVisible ? 'Cancel' : toggleText}
            </button>

            {postFormVisible &&
                <form
                    className="space-y-1 bg-zinc-600 rounded-md p-2 w-fit m-auto"
                    onSubmit={handlePublishClick}
                >
                    <input
                        type="text"
                        className="block bg-zinc-800 rounded-md resize px-2 py-1"
                        placeholder={placeholder}
                        ref={inputRef}
                        value={newPostContents}
                        onChange={e => {
                            setErrors([]);
                            setNewPostContents(e.target.value);
                        }}
                        disabled={inFlight}
                    />
                    <button
                        className="bg-emerald-400 text-zinc-900 rounded-md py-1 px-2"
                        type="submit"
                        disabled={inFlight}
                    >
                        {inFlight ? 'Publishing...' : 'Publish'}
                    </button>
                    <ErrorList />
                </form>
            }
        </>
    );
}