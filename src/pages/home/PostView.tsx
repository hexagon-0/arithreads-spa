import { useState } from "react"
import { useAuth } from "../../AuthContext"

export type Post = {
    id: number
    operand: number
    operator?: string | null
    username: string
    responses: Post[]
}

export interface PostProps {
    post: Post
    offset?: number
    previousResult?: number,
}

export default function PostView ({ post, offset = 0, previousResult }: PostProps) {
    const { auth } = useAuth();

    const [answerVisible, setAnswerVisible] = useState(false);

    const offsetFactor = 1;
    const left = offset * offsetFactor;

    let summary = '';
    let result = post.operand;

    if (previousResult !== undefined) {
        let validOperator = false;

        switch (post.operator) {
            case '+': {
                result = previousResult + post.operand;
                validOperator = true;
            } break;

            case '-': {
                result = previousResult - post.operand;
                validOperator = true;
            } break;

            case '*': {
                result = previousResult * post.operand;
                validOperator = true;
            } break;

            case '/': {
                result = previousResult / post.operand;
                validOperator = true;
            } break;
        }

        if (validOperator) {
            summary = `${previousResult} ${post.operator} ${post.operand}`;
        }
    }

    return (
        <>
            <div
                className="p-4 bg-zinc-600 rounded-sm shadow-md"
                style={{ marginLeft: `${left}rem` }}
            >
                <p className="text-base">{post.username}</p>
                <p className="text-xs text-zinc-300">{summary}</p>
                <p className="text-xl py-2">{result}</p>
                {auth.status === 'authenticated' &&
                    <>
                        <button
                            className="underline text-blue-400"
                            type="button"
                            onClick={() => setAnswerVisible(value => !value)}
                        >
                            {answerVisible ? 'Cancel' : 'Answer'}
                        </button>

                        {answerVisible &&
                            <div className="space-y-1">
                                <textarea
                                    className="block bg-zinc-800 rounded-md resize px-2 py-1"
                                ></textarea>
                                <button
                                    className="bg-emerald-400 text-zinc-900 rounded-md py-1 px-2"
                                    type="button"
                                    onClick={() => setAnswerVisible(value => !value)}
                                >
                                    Publish
                                </button>
                            </div>
                        }
                    </>
                }
            </div>
            {post.responses.map(r =>
                <PostView key={r.id} post={r} offset={offset + 1} previousResult={result} />
            )}
        </>
    );
}
