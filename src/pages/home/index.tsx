import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";
import PostView, { Post } from "./PostView";

export default function HomePage () {
    const { auth, setAuth } = useAuth();

    const [postFormVisible, setPostFormVisible] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        async function makeRequest () {
            try {
                const response = await axios.get(
                    `${API_URL}/posts/`,
                    { signal: controller.signal },
                );

                setPosts(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        makeRequest();

        return () => {
            controller.abort();
        };
    }, []);

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
                    <>
                        <button
                            className="underline text-blue-400 block m-auto"
                            type="button"
                            onClick={() => setPostFormVisible(value => !value)}
                        >
                            {postFormVisible ? 'Cancel' : 'New post'}
                        </button>

                        {postFormVisible &&
                            <div className="space-y-1 bg-zinc-600 rounded-md p-2 w-fit m-auto">
                                <textarea
                                    className="block bg-zinc-800 rounded-md resize px-2 py-1"
                                ></textarea>
                                <button
                                    className="bg-emerald-400 text-zinc-900 rounded-md py-1 px-2"
                                    type="button"
                                    onClick={() => setPostFormVisible(value => !value)}
                                >
                                    Publish
                                </button>
                            </div>
                        }
                    </>
                }

                {posts.map(post =>
                    <PostView key={post.id} post={post} />
                )}
            </main>

            <footer>
                <div className="h-4"></div>
            </footer>
        </div>
    );
}

