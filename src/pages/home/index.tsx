import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";
import PostView, { Post } from "./PostView";
import PostForm from "./PostForm";

export default function HomePage () {
    const { auth, setAuth } = useAuth();

    const [posts, setPosts] = useState<Post[]>([]);

    async function loadPosts (signal?: AbortSignal) {
        try {
            const response = await axios.get(
                `${API_URL}/posts/`,
                { signal },
            );

            setPosts(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const controller = new AbortController();

        loadPosts(controller.signal);

        return () => {
            controller.abort();
        };
    }, []);

    function validateStartingPostContents (contents: string) {
        const operand = Number.parseFloat(contents);

        if (Number.isNaN(operand)) {
            throw new Error('Operand must be a valid number');
        }

        return operand;
    }

    const handleStartingPostPublish = (accessToken: string) => async function (contents: string) {
        const operand = validateStartingPostContents(contents);

        await axios.post(
            `${API_URL}/posts/`,
            { operand },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        await loadPosts();
    }

    return (
        <div className="w-full h-screen bg-zinc-800 text-zinc-100 overflow-auto">
            <header className="py-10 space-y-10">
                <div className="text-center">
                    <h1 className="text-5xl">Arithreads</h1>
                </div>
                <nav>
                    <ul className="w-fit mx-auto space-x-2">
                        {auth.status === 'unauthenticated' ?
                            <>
                                <li className="inline">
                                    <Link
                                        to={'/login'}
                                        className="underline text-blue-400"
                                    >
                                        Log in
                                    </Link>
                                </li>
                                <span className="border-l border-zinc-100"></span>
                                <li className="inline">
                                    <Link
                                        to={'/register'}
                                        className="underline text-blue-400"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                            :
                            <li className="inline">
                                {auth.username}
                                &nbsp;
                                <button
                                    className="underline text-blue-400"
                                    onClick={() => setAuth({ status: 'unauthenticated' })}
                                >
                                    (Log out)
                                </button>
                            </li>
                        }
                    </ul>
                </nav>
            </header>

            <main className="space-y-4 px-2 max-w-screen-lg mx-auto">
                {auth.status === 'authenticated' &&
                    <PostForm toggleText="New post" onPublish={handleStartingPostPublish(auth.token)} />
                }

                {posts.map(post =>
                    <PostView key={post.id} post={post} onReply={() => loadPosts()} />
                )}
            </main>

            <footer>
                <div className="h-4"></div>
            </footer>
        </div>
    );
}

